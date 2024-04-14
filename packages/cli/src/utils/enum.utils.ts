/**
 * @overview
 * @author AEPKILL
 * @created 2024-04-12 20:13:14
 */

export function getEnumKeys<T extends object>(enumObject: T): Array<keyof T> {
  return Object.keys(enumObject).filter((key) => isNaN(Number(key))) as Array<
    keyof T
  >;
}

export function valueInEnum<T extends object>(
  enumObject: T,
  value: number | string
): boolean {
  return getEnumKeys(enumObject).some((key) => enumObject[key] === value);
}

export function getEnumValues<T extends object>(
  enumObject: T
): Array<T[keyof T]> {
  return getEnumKeys(enumObject).map((key) => enumObject[key]);
}

export function displayEnum<T extends object>(
  enumObject: T,
  separate = ", "
): string {
  return getEnumValues(enumObject).join(separate);
}
