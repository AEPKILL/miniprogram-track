/**
 * @overview
 * @author AEPKILL
 * @created 2024-04-17 08:48:00
 */

export enum WxmlTagEnum {
  block = "block",
  template = "template"
}

export type WxmlChildren = string | WxmlNode;

export class WxmlNode {
  parent: WxmlNode | null;
  children: WxmlChildren[];
  attrs: Record<string, any>;
  proxy: WxmlNode | null;

  constructor(
    readonly tag: string,
    parent?: WxmlNode | null,
    attrs?: Record<string, any>
  ) {
    this.attrs = {
      ...attrs
    };
    this.parent = parent || null;
    this.proxy = null;
    this.children = [];
  }

  get wxVkey(): string | undefined {
    return this.attrs["wx:key"];
  }

  set wxVkey(value: string) {
    if (WxmlNode.currentIfBlock) {
      if (this.proxy) this.proxy = null;
      this.appendChild(WxmlNode.currentIfBlock);
      this.proxy = WxmlNode.currentIfBlock;
      WxmlNode.currentIfBlock = null;
    }
    this.attrs["wx:key"] = value;
  }

  appendChild(child: WxmlChildren): void {
    if (this.proxy) return this.proxy.appendChild(child);

    if (child instanceof WxmlNode) {
      child.parent = this;
    }
    this.children.push(child);
  }

  appendChildToFirst(child: WxmlChildren): void {
    if (this.proxy) return this.proxy.appendChildToFirst(child);

    if (child instanceof WxmlNode) {
      child.parent = this;
    }
    this.children.unshift(child);
  }

  toWxml(): string {
    let wxml = `<${this.tag}`;

    for (const key in this.attrs) {
      wxml = `${wxml} ${key}="${this.attrs[key]}"`;
    }

    if (this.children.length) {
      wxml += `>\n`;
      wxml += this.children
        .map((child) => (child instanceof WxmlNode ? child.toWxml() : child))
        .join("\n");
      wxml += `</${this.tag}>`;
    } else {
      wxml += `/>`;
    }

    return wxml;
  }

  optimize(): WxmlNode {
    return this;
    // // eslint-disable-next-line @typescript-eslint/no-this-alias
    // let node: WxmlNode = this;

    // if (node.tag === WxmlTagEnum.block) {
    //   if (this.children.length === 1) {
    //     const child = this.children[0];

    //     if (child instanceof WxmlNode) {
    //       node = new WxmlNode(child.tag);
    //       node.children = child.children;

    //       for (const key in this.attrs) {
    //         node.attrs[key] = this.attrs[key];
    //       }

    //       for (const key in child.attrs) {
    //         node.attrs[key] = child.attrs[key];
    //       }
    //     }
    //   }
    // }

    // if (node.children.length) {
    //   node.children = this.children
    //     .filter((it) => {
    //       if (it instanceof WxmlNode) {
    //         if (it.tag === WxmlTagEnum.block) {
    //           if (it.children.length === 0) {
    //             return false;
    //           }
    //         }
    //       }
    //       return true;
    //     })
    //     .map((it) => (it instanceof WxmlNode ? it.optimize() : it));
    // }

    // return node;
  }

  static currentIfBlock: WxmlNode | null = null;
}
