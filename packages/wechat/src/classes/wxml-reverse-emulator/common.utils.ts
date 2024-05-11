/**
 * @overview
 * @author AEPKILL
 * @created 2024-04-18 21:12:19
 */

export enum BracketTypeEnum {
  braces = "{",
  bracket = "[",
  parentheses = "("
}

export const BracketWrapRecord: Record<BracketTypeEnum, [string, string]> = {
  [BracketTypeEnum.braces]: ["{", "}"],
  [BracketTypeEnum.bracket]: ["[", "]"],
  [BracketTypeEnum.parentheses]: ["(", ")"]
};

export function wrapBracket(
  value: string,
  type = BracketTypeEnum.braces
): string {
  const [start, end] = BracketWrapRecord[type];

  {
    let index = 0;
    while (!value.startsWith(start)) {
      value = `${start.substring(index, index + 1)}${value}`;
      index++;
    }
  }

  {
    let index = end.length;
    while (!value.endsWith(end)) {
      value = `${value}${end.substring(index - 1, index)}`;
      index--;
    }
  }

  return value;
}

export function wrapScope(value: string): string {
  while (!value.startsWith("{{")) {
    value = `{${value}`;
  }
  while (!value.endsWith("}}")) {
    value = `${value}}`;
  }
  return value;
}
