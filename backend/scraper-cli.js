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
  try {
    const response = await openai.chat.completions.create({
      model: 'gemini-2.0-flash',
      messages: [
        {
          role: 'system',
          content: `You are a helpful assistant that only returns the official homepage URL for a given company, product, or service keyword. Return only the URL, nothing else. 
          Return null if unsure.Check if the given prompt is a valid URL itself then no need to find,just return it.`,
        },
        { 
          role: 'user', 
          content: `Give me the official website URL for: "${keyword}" or try to find the most relevant website's URL for: ${keyword}` 
        },
      ],
    });

    const answer = response.choices[0].message.content.trim();
    const match = answer.match(/https?:\/\/[^\s"]+/); //Extract the website URL from AI's Response
    return match ? match[0] : null; //Only the first URL
  } catch (error) {
    console.error('Error resolving website URL:', error);
    return null;
  }
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