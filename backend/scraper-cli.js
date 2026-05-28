import 'dotenv/config';
import OpenAI from 'openai';
import scrape from 'website-scraper';
import path from 'path';
import fs from 'fs';
import { URL as URLConstructor } from 'url';
import { ContentExtractor } from './content-extractor.js';
import fetch from 'node-fetch';
import * as cheerio from 'cheerio';
import dns from 'dns';
import { promisify } from 'util';


const openai = new OpenAI({
  apiKey: process.env.FIREWORKS_API_KEY || process.env.GEMINI_API_KEY,
  baseURL: process.env.FIREWORKS_BASE_URL || 'https://api.fireworks.ai/inference/v1',
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

const lookup = promisify(dns.lookup);
const resolutionCache = new Map();

async function validateURL(url) {
  try {
    const response = await fetch(url, {
      method: 'HEAD',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      },
      timeout: 5000
    });
    if (response.ok) return true;
    
    // Fallback GET
    const responseGet = await fetch(url, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      },
      timeout: 5000
    });
    return responseGet.ok;
  } catch (e) {
    return false;
  }
}

export async function resolveWebsiteURL(keyword) {
  const cleanKeyword = keyword.trim();
  const cacheKey = cleanKeyword.toLowerCase();

  // 1. Local Memory Cache Lookup
  if (resolutionCache.has(cacheKey)) {
    const cached = resolutionCache.get(cacheKey);
    console.log(`[Cache Hit] Resolved: "${cleanKeyword}" -> ${cached}`);
    return cached;
  }

  let targetUrl = null;

  // 2. Direct Match Protocol (Regex and DNS Lookup)
  const urlPattern = /^(https?:\/\/)?([\w\-]+\.)+[\w\-]+(\/.*)?$/i;
  if (urlPattern.test(cleanKeyword)) {
    let candidateUrl = cleanKeyword;
    if (!candidateUrl.startsWith('http://') && !candidateUrl.startsWith('https://')) {
      candidateUrl = `https://${candidateUrl}`;
    }

    try {
      const hostname = new URLConstructor(candidateUrl).hostname;
      await lookup(hostname);
      console.log(`[DNS Succeeded] "${hostname}" is reachable`);
      targetUrl = candidateUrl;
    } catch (dnsErr) {
      console.warn(`[DNS Failed] Hostname "${cleanKeyword}" could not resolve. Defaulting to query search.`);
    }
  }

  // 3. DuckDuckGo Scraper Lookup
  if (!targetUrl) {
    console.log(`[Search Lookup] Resolving "${cleanKeyword}" via DuckDuckGo`);
    try {
      const ddgUrl = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(cleanKeyword)}`;
      const response = await fetch(ddgUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        }
      });

      if (response.ok) {
        const html = await response.text();
        const $ = cheerio.load(html);
        const results = [];
        $('.result__a').each((idx, el) => {
          let href = $(el).attr('href');
          if (href) {
            if (href.startsWith('//')) href = 'https:' + href;
            if (href.includes('uddg=')) {
              const urlObj = new URL(href, 'https://duckduckgo.com');
              const realUrl = urlObj.searchParams.get('uddg');
              if (realUrl) results.push(realUrl);
            } else if (href.startsWith('http')) {
              results.push(href);
            }
          }
        });

        if (results.length > 0) {
          targetUrl = results[0];
          console.log(`[Search Succeeded] Resolved via DDG -> ${targetUrl}`);
        }
      }
    } catch (ddgErr) {
      console.error('[Search Failed] DuckDuckGo resolution failed:', ddgErr.message);
    }
  }

  // 4. LLM Fallback (Gemini API)
  if (!targetUrl) {
    console.log(`[LLM Fallback] Resolving "${cleanKeyword}" via Gemini API`);
    const now = Date.now();
    const timeSinceLastCall = now - lastApiCallTime;
    if (timeSinceLastCall < MIN_TIME_BETWEEN_CALLS) {
      await delay(MIN_TIME_BETWEEN_CALLS - timeSinceLastCall);
    }

    let retries = 3;
    let retryDelay = 5000;

    while (retries > 0) {
      try {
        lastApiCallTime = Date.now();
        const response = await openai.chat.completions.create({
          model: process.env.FIREWORKS_MODEL || 'accounts/fireworks/models/deepseek-v4-pro',
          messages: [
            {
              role: 'system',
              content: `You are a helpful assistant that returns only the official homepage URL for a given company, product, or service. Return ONLY the URL, nothing else. No explanation, no markdown formatting.
Examples:
- Input: "google" -> Output: https://www.google.com
- Input: "github" -> Output: https://github.com`
            },
            { role: 'user', content: `Website URL for: ${cleanKeyword}` }
          ],
          max_tokens: 100,
          temperature: 0.3
        });

        const answer = response.choices[0].message.content.trim();
        const match = answer.match(/https?:\/\/[^\s"]+/);
        if (match) {
          targetUrl = match[0];
          console.log(`[LLM Succeeded] Resolved via Fireworks -> ${targetUrl}`);
          break;
        }
      } catch (error) {
        if (error.status === 429) {
          retries--;
          if (retries > 0) {
            console.log(`[Rate Limit] Retrying in ${retryDelay/1000}s... (${retries} retries remaining)`);
            await delay(retryDelay);
            retryDelay *= 2;
          } else {
            throw new Error('LLM rate limit exceeded. Resolve flow failed.');
          }
        } else {
          console.error('[LLM Error] Error in Gemini resolution:', error.message);
          throw error;
        }
      }
    }
  }

  // 5. Pre-flight Validation & Protocol Adjustments
  if (targetUrl) {
    let isValid = await validateURL(targetUrl);
    
    // Fallback: If apex domain fails, test www prefix
    if (!isValid && !targetUrl.includes('www.') && !targetUrl.includes('http://localhost') && !targetUrl.includes('127.0.0.1')) {
      const parsedUrl = new URLConstructor(targetUrl);
      if (parsedUrl.protocol === 'https:') {
        const wwwFallback = `https://www.${parsedUrl.hostname}${parsedUrl.pathname}${parsedUrl.search}`;
        console.log(`[Pre-flight Validation] Fails apex. Verifying www fallback: ${wwwFallback}`);
        const isWwwValid = await validateURL(wwwFallback);
        if (isWwwValid) {
          targetUrl = wwwFallback;
          isValid = true;
        }
      }
    }

    if (isValid) {
      resolutionCache.set(cacheKey, targetUrl);
      return targetUrl;
    } else {
      console.warn(`[Pre-flight Warning] Resolved target "${targetUrl}" appears offline/unreachable.`);
      resolutionCache.set(cacheKey, targetUrl);
      return targetUrl;
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