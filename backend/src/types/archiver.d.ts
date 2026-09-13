declare module 'archiver' {
  import * as stream from 'node:stream';
  import { ZlibOptions } from 'node:zlib';

  export interface CoreOptions {
    statConcurrency?: number;
  }

  export interface TransformOptions {
    allowHalfOpen?: boolean;
    readableObjectMode?: boolean;
    writableObjectMode?: boolean;
    decodeStrings?: boolean;
    encoding?: BufferEncoding;
    highWaterMark?: number;
    objectMode?: boolean;
  }

  export interface ZipOptions {
    comment?: string;
    forceLocalTime?: boolean;
    forceZip64?: boolean;
    namePrependSlash?: boolean;
    store?: boolean;
    level?: number;
    zlib?: ZlibOptions;
  }

  export interface TarOptions {
    gzip?: boolean;
    gzipOptions?: ZlibOptions;
  }

  export type ArchiverOptions = CoreOptions & TransformOptions & ZipOptions & TarOptions;

  export interface EntryData {
    name: string;
    type?: 'directory' | 'file' | 'symlink';
    date?: Date | string;
    mode?: number;
    prefix?: string;
    stats?: any;
  }

  export interface Archiver extends stream.Transform {
    abort(): this;
    append(source: stream.Readable | Buffer | string, data?: EntryData): this;
    directory(dirpath: string, destpath: false | string, data?: any): this;
    file(filename: string, data?: EntryData): this;
    glob(pattern: string, options?: any, data?: Partial<EntryData>): this;
    finalize(): Promise<void>;
    pointer(): number;
    symlink(filepath: string, target: string, mode?: number): this;
    on(event: string, listener: (...args: any[]) => void): this;
    pipe<T extends NodeJS.WritableStream>(destination: T, options?: { end?: boolean }): T;
  }

  function archiver(format: 'zip' | 'tar' | string, options?: ArchiverOptions): Archiver;

  export default archiver;
  export { archiver };
}
