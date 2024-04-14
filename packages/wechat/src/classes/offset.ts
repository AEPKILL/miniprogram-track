/**
 * @overview
 * @author AEPKILL
 * @created 2024-04-14 21:25:51
 */

export class Offset {
  #index: number;

  constructor(index: number) {
    this.#index = index;
  }

  get index(): number {
    return this.#index;
  }

  forward(offset: number): number {
    const current = this.#index;
    this.#index += offset;
    return current;
  }
}
