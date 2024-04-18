/**
 * @overview
 * @author AEPKILL
 * @created 2024-04-17 08:48:00
 */

export enum WxmlTagEnum {
  block = "block"
}

export class WxmlNode {
  parent: WxmlNode | null = null;
  children: WxmlNode[] = [];
  attrs: Record<string, string> = {};
  constructor(readonly tag: string) {}

  appendChild(child: WxmlNode): void {
    child.parent = this;
    if (!this.children.includes(child)) {
      this.children.push(child);
    }
  }

  toWxml(): string {
    let wxml = `<${this.tag}`;

    for (const key in this.attrs) {
      wxml = `${wxml} ${key}="${this.attrs[key]}"`;
    }

    if (this.children.length) {
      wxml += `>\n`;
      wxml += this.children.map((child) => child.toWxml()).join("\n");
      wxml += `</${this.tag}>`;
    } else {
      wxml += `/>`;
    }

    return wxml;
  }

  optimize(): WxmlNode {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    let node: WxmlNode = this;

    if (node.tag === WxmlTagEnum.block) {
      if (this.children.length === 1) {
        const child = this.children[0];
        node = new WxmlNode(child.tag);
        node.parent = this.parent;
        node.children = child.children;

        for (const key in this.attrs) {
          node.attrs[key] = this.attrs[key];
        }

        for (const key in child.attrs) {
          node.attrs[key] = child.attrs[key];
        }
      }
    }

    if (node.children.length) {
      node.children = this.children.map((it) => it.optimize());
    }

    return node;
  }
}
