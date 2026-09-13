declare module 'website-scraper' {
  export interface Subdirectory {
    directory: string;
    extensions: string[];
  }

  export interface ScrapeOptions {
    urls: string[] | Array<{ url: string; filename?: string }>;
    directory: string;
    recursive?: boolean;
    maxDepth?: number;
    plugins?: any[];
    subdirectories?: Subdirectory[];
    urlFilter?: (url: string) => boolean;
    sources?: Array<{ selector: string; attr?: string }>;
    request?: Record<string, any>;
    ignoreErrors?: boolean;
  }

  export interface Resource {
    url: string;
    filename: string;
    assets: Resource[];
  }

  export default function scrape(options: ScrapeOptions): Promise<Resource[]>;
}
