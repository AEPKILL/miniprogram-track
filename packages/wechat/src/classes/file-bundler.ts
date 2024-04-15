/**
 * @overview
 * @author AEPKILL
 * @created 2024-04-15 12:32:28
 */
import fs from "fs-extra";
import path from "path";

export interface BundlerFile {
  name: string;
  buffer: Buffer;
  size: number;
}

export class FileBundler {
  #files: Record<string, BundlerFile> = {};

  get files(): Record<string, BundlerFile> {
    return this.#files;
  }

  get filesList(): BundlerFile[] {
    return Object.values(this.#files);
  }

  isExist(name: string): boolean {
    return name in this.#files;
  }

  append(file: BundlerFile): void {
    this.#files[file.name] = file;
  }

  remove(name: string): void {
    delete this.#files[name];
  }

  clone(): FileBundler {
    const bundler = new FileBundler();
    for (const file of this.filesList) {
      bundler.append(file);
    }
    return bundler;
  }

  saveTo(targetDir: string): void {
    for (const file of this.filesList) {
      const filePath = path.join(targetDir, file.name);
      const fileDir = path.parse(filePath).dir;
      fs.ensureDirSync(fileDir);
      fs.writeFileSync(filePath, file.buffer);
    }
  }
}
