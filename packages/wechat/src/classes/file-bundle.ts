/**
 * @overview
 * @author AEPKILL
 * @created 2024-04-15 12:32:28
 */
import fs from "fs-extra";
import path from "path";

export interface BundleFile {
  path: string;
  buffer: Buffer;
  size?: number;
}

function addRootPrefix(path: string): string {
  if (path[0] === "/") return path;
  return `/${path}`;
}

export class FileBundle {
  #files: Record<string, BundleFile> = {};

  get files(): Record<string, BundleFile> {
    return this.#files;
  }

  get filesList(): BundleFile[] {
    return Object.values(this.#files);
  }

  isExist(path: string): boolean {
    return addRootPrefix(path) in this.#files;
  }

  append(file: BundleFile): void {
    this.#files[addRootPrefix(file.path)] = file;
  }

  get(path: string): BundleFile | undefined {
    return this.#files[addRootPrefix(path)];
  }

  remove(path: string): void {
    delete this.#files[addRootPrefix(path)];
  }

  clone(): FileBundle {
    const Bundle = new FileBundle();
    for (const file of this.filesList) {
      Bundle.append(file);
    }
    return Bundle;
  }

  async saveTo(targetDir: string): Promise<void> {
    for (const file of this.filesList) {
      const filePath = path.join(targetDir, file.path);
      const fileDir = path.parse(filePath).dir;
      const exists = await fs.exists(filePath);

      if (exists) {
        console.log(`WARN: file ${filePath} already exists, overwrite it`);
      }

      await fs.ensureDir(fileDir);
      await fs.writeFile(filePath, file.buffer);
    }
  }
}
