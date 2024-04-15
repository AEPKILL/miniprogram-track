/**
 * @overview
 * @author AEPKILL
 * @created 2024-04-15 12:32:28
 */
import fs from "fs-extra";
import path from "path";

export interface BundleFile {
  name: string;
  buffer: Buffer;
  size: number;
}

export class FileBundle {
  #files: Record<string, BundleFile> = {};

  get files(): Record<string, BundleFile> {
    return this.#files;
  }

  get filesList(): BundleFile[] {
    return Object.values(this.#files);
  }

  isExist(name: string): boolean {
    return name in this.#files;
  }

  append(file: BundleFile): void {
    this.#files[file.name] = file;
  }

  get(name: string): BundleFile | undefined {
    return this.#files[name];
  }

  remove(name: string): void {
    delete this.#files[name];
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
      const filePath = path.join(targetDir, file.name);
      const fileDir = path.parse(filePath).dir;
      await fs.ensureDir(fileDir);
      await fs.writeFile(filePath, file.buffer);
    }
  }
}
