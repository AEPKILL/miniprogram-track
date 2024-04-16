/**
 * @overview
 * @author AEPKILL
 * @created 2024-04-14 17:52:50
 */
import fs from "fs-extra";
import { pbkdf2Sync, createDecipheriv } from "crypto";
import { Offset } from "./offset";
import { FileBundle } from "./file-bundle";

export interface WxapkgFileHeader {
  firstMask: number;
  info1: number;
  indexInfoLength: number;
  bodyInfoLength: number;
  lastMark: number;
  fileCount: number;
}

export interface WxapkgChunk {
  nameLength: number;
  name: string;
  offset: number;
  size: number;
}

export interface WxapkgMetadata {
  header: WxapkgFileHeader;
  chunks: WxapkgChunk[];
}

export interface WxapkgUnpackOptions {
  appid: string;
  pkgPath: string;
}

export class WxapkgUnpack {
  readonly pkgPath: string;
  readonly buffer: Buffer;
  readonly appid: string;

  constructor(options: WxapkgUnpackOptions) {
    const { pkgPath, appid } = options;

    this.pkgPath = pkgPath;
    this.appid = appid;

    const buffer = fs.readFileSync(pkgPath);
    if (WxapkgUnpack.isNeedDecrypt(buffer)) {
      this.buffer = WxapkgUnpack.decrypt(buffer, appid);
    } else {
      this.buffer = buffer;
    }
  }

  unpack(): FileBundle {
    const metadata = WxapkgUnpack.getFileMetadata(this.buffer);
    const { header } = metadata;
    const isValid =
      header.firstMask == WxapkgUnpack.pkgFirstMaskConst &&
      header.lastMark == WxapkgUnpack.pkgLastMaskConst;
    const Bundle = new FileBundle();

    if (!isValid) {
      throw new Error(`${this.pkgPath} 不是一个有效的 wxapkg 文件`);
    }

    for (const chunk of metadata.chunks) {
      Bundle.append({
        path: chunk.name,
        buffer: this.buffer.subarray(chunk.offset, chunk.offset + chunk.size),
        size: chunk.size
      });
    }

    return Bundle;
  }

  static readonly pkgFirstMaskConst = 0xbe;
  static readonly pkgLastMaskConst = 0xed;
  static readonly cryptPkgHeaderFlagConst = [
    0x56, 0x31, 0x4d, 0x4d, 0x57, 0x58
  ];

  static isNeedDecrypt(buffer: Buffer): boolean {
    return this.cryptPkgHeaderFlagConst.every((v, i) => buffer[i] === v);
  }

  static getFileMetadata(buffer: Buffer): WxapkgMetadata {
    const view = new DataView(buffer.buffer);
    const offset = new Offset(0);

    const metadata: WxapkgMetadata = {
      header: {
        firstMask: view.getUint8(offset.forward(1)),
        info1: view.getUint32(offset.forward(4)),
        indexInfoLength: view.getUint32(offset.forward(4)),
        bodyInfoLength: view.getUint32(offset.forward(4)),
        lastMark: view.getUint8(offset.forward(1)),
        fileCount: view.getUint32(offset.forward(4))
      },
      chunks: []
    };
    const fileCount = metadata.header.fileCount;

    for (let i = 0; i < fileCount; i++) {
      const nameLength = view.getUint32(offset.forward(4));
      const name = buffer
        .subarray(offset.index, (offset.forward(nameLength), offset.index))
        .toString();
      const chunk: WxapkgChunk = {
        name,
        nameLength,
        offset: view.getUint32(offset.forward(4)),
        size: view.getUint32(offset.forward(4))
      };

      metadata.chunks.push(chunk);
    }

    return metadata;
  }

  static decrypt(buffer: Buffer, appid: string): Buffer {
    const salt = "saltiest";
    const iv = "the iv: 16 bytes";
    const cryptPkgHeaderLength = 1024;
    const dk = pbkdf2Sync(
      Buffer.from(appid),
      Buffer.from(salt),
      1000,
      32,
      "sha1"
    );
    const head = Buffer.alloc(cryptPkgHeaderLength);
    const bodyKey =
      appid.length < 2 ? 0x66 : appid.charCodeAt(appid.length - 2);
    const body = buffer
      .subarray(
        WxapkgUnpack.cryptPkgHeaderFlagConst.length + cryptPkgHeaderLength
      )
      .map((it) => bodyKey ^ it);

    createDecipheriv("aes-256-cbc", dk, Buffer.from(iv))
      .setAutoPadding(false)
      .update(
        buffer.subarray(
          WxapkgUnpack.cryptPkgHeaderFlagConst.length,
          WxapkgUnpack.cryptPkgHeaderFlagConst.length + cryptPkgHeaderLength
        )
      )
      .copy(head);

    return Buffer.concat([head.subarray(0, 1023), body]);
  }
}
