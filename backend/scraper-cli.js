import 'dotenv/config';
import OpenAI from 'openai';
import scrape from 'website-scraper';
import path from 'path';
import fs from 'fs';
import { URL as URLConstructor } from 'url';
import { ContentExtractor } from './content-extractor.js';


const openai = new OpenAI({
  apiKey: process.env.GEMINI_API_KEY,
  baseURL: 'https://generativelanguage.googleapis.com/v1beta/openai/',
});

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
let lastApiCallTime = 0;
const MIN_TIME_BETWEEN_CALLS = 2000; 

function getUniqueFolderName(basePath, baseName) {
  let folderName = baseName;
  let counter = 1;
  
  let fullPath = path.join(basePath, folderName);
  
  while (fs.existsSync(fullPath)) {
    folderName = `${baseName}(${counter})`;
    fullPath = path.join(basePath, folderName);
    counter++;
  }
  
  return folderName;
}

export async function scrapeWebsiteByScraper(websiteURL,isRecursive = false) {
  const baseDomainName = new URLConstructor(websiteURL).hostname.replace(/\./g, '-'); //folder name should contain '-' instead of '.'
  const downloadsPath = path.join(process.cwd(), 'downloads');
  
  if (!fs.existsSync(downloadsPath)) {
    fs.mkdirSync(downloadsPath);
  }
  
  const uniqueFolderName = getUniqueFolderName(downloadsPath, baseDomainName);
  const OUTPUT_DIR = path.join(downloadsPath, uniqueFolderName);
  
  try {
    await scrape({
      urls: [websiteURL],
      directory: OUTPUT_DIR,
      recursive: isRecursive, // Only scrape the landing page -> false, for subdomains also -> true
      plugins: [],
      subdirectories: [
        { directory: 'images', extensions: ['.jpg', '.png', '.gif', '.svg'] },
        { directory: 'js', extensions: ['.js'] },
        { directory: 'css', extensions: ['.css'] },
      ],
      urlFilter: (url) => url.startsWith('http'),
    });

    return uniqueFolderName;
  } catch (error) {
    console.error('Error scraping website:', error);
    
    // Clean up the directory if scraping failed
    if (fs.existsSync(OUTPUT_DIR)) {
      fs.rmSync(OUTPUT_DIR, { recursive: true, force: true });
    }
    
    throw error;
  }
}

export async function resolveWebsiteURL(keyword) {
  // Check if input is already a valid URL
  const urlPattern = /^(https?:\/\/)?([\w\-]+\.)+[\w\-]+(\/.*)?$/i;
  if (urlPattern.test(keyword)) {
    // If it starts with http/https, return as is
    if (keyword.startsWith('http://') || keyword.startsWith('https://')) {
      console.log('Valid URL detected, using directly:', keyword);
      return keyword;
    }
    // If it's a domain without protocol, add https://
    const url = `https://${keyword}`;
    console.log('Domain detected, adding protocol:', url);
    return url;
  }

  const now = Date.now();
  const timeSinceLastCall = now - lastApiCallTime;
  if (timeSinceLastCall < MIN_TIME_BETWEEN_CALLS) {
    const waitTime = MIN_TIME_BETWEEN_CALLS - timeSinceLastCall;
    console.log(`Rate limiting: waiting ${waitTime}ms before API call...`);
    await delay(waitTime);
  }

  let retries = 3;
  let retryDelay = 5000; 

  while (retries > 0) {
    try {
      lastApiCallTime = Date.now();
      
      const response = await openai.chat.completions.create({
        model: 'gemini-2.0-flash',
        messages: [
          {
            role: 'system',
            content: `You are a helpful assistant that returns only the official homepage URL for a given company, product, or service.
            Return ONLY the URL, nothing else. No explanation, no additional text.
            Examples:
            - Input: "google" -> Output: https://www.google.com
            - Input: "github" -> Output: https://github.com
            - Input: "tesla" -> Output: https://www.tesla.com`,
          },
          { 
            role: 'user', 
            content: `Website URL for: ${keyword}` 
          },
        ],
        max_tokens: 100,
        temperature: 0.3,
      });

      const answer = response.choices[0].message.content.trim();
      const match = answer.match(/https?:\/\/[^\s"]+/); //Extract the website URL from AI's Response
      return match ? match[0] : null; //Only the first URL
    } catch (error) {
      if (error.status === 429) {
        retries--;
        if (retries > 0) {
          console.log(`Rate limit hit. Retrying in ${retryDelay/1000} seconds... (${retries} retries left)`);
          await delay(retryDelay);
          retryDelay *= 2; 
        } else {
          console.error('Rate limit exceeded. Please wait a minute and try again.');
          throw new Error('Rate limit exceeded. Please try again in a minute.');
        }
      } else {
        console.error('Error resolving website URL:', error);
        throw error;
      }
    }
  }
  
  return null;
}

export async function scrapeWebsiteByPuppeteer(websiteURL) {
  const baseDomainName = new URLConstructor(websiteURL).hostname.replace(/\./g, '-');
  const downloadsPath = path.join(process.cwd(), 'downloads');

  if (!fs.existsSync(downloadsPath)) {
    fs.mkdirSync(downloadsPath);
  }

  const uniqueFolderName = getUniqueFolderName(downloadsPath, baseDomainName);
  const OUTPUT_DIR = path.join(downloadsPath, uniqueFolderName);

  try {
    await ContentExtractor.extractFrontendContent(websiteURL, OUTPUT_DIR);
    return uniqueFolderName;
  } catch (error) {
    console.error("Error scraping website with puppeteer:", error);

    if (fs.existsSync(OUTPUT_DIR)) {
      fs.rmSync(OUTPUT_DIR, { recursive: true, force: true });
    }
    throw error;
  }
}