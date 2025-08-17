import 'dotenv/config';
import OpenAI from 'openai';
import scrape from 'website-scraper';
import path from 'path';
import fs from 'fs';
import { URL as URLConstructor } from 'url';

const openai = new OpenAI({
  apiKey: process.env.GEMINI_API_KEY,
  baseURL: 'https://generativelanguage.googleapis.com/v1beta/openai/',
});

export async function scrapeWebsite(websiteURL) {
  const domainName = new URLConstructor(websiteURL).hostname.replace(/\./g, '-'); //folder name should contain '-' instead of '.'
  const downloadsPath = path.join(process.cwd(), 'downloads');
  
  if (!fs.existsSync(downloadsPath)) {
    fs.mkdirSync(downloadsPath);
  }
  
  const OUTPUT_DIR = path.join(downloadsPath, domainName);
  
  await scrape({
    urls: [websiteURL],
    directory: OUTPUT_DIR,
    recursive: false, // Only scrape the landing page, for subdomains -> true
    plugins: [],
    subdirectories: [
      { directory: 'images', extensions: ['.jpg', '.png', '.gif', '.svg'] },
      { directory: 'js', extensions: ['.js'] },
      { directory: 'css', extensions: ['.css'] },
    ],
    urlFilter: (url) => url.startsWith('http'),
  });

  return domainName;
}

export async function resolveWebsiteURL(keyword) {
  const response = await openai.chat.completions.create({
    model: 'gemini-2.0-flash',
    messages: [
      {
        role: 'system',
        content: `You are a helpful assistant that only returns the official homepage URL for a given company, product, or service keyword. Return null if unsure.`,
      },
      { role: 'user', content: `Give me the official website URL for: "${keyword} or try to find relevant website's URL for: ${keyword}"` },
    ],
  });

  const answer = response.choices[0].message.content.trim();
  const match = answer.match(/https?:\/\/[^\s"]+/);//Extract the website URL from AI's Response
  return match ? match[0] : null; //Only the first URL
}
