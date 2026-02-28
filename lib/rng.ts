export default class PRNG {
  private seed: number;

  constructor(seed: string | number) {
    this.seed = typeof seed === "string" ? this.hash(seed) : seed;
  }

  private hash(str: string): number {
    let h = 2166136261;
    for (let i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i);
      h = (h * 16777619) >>> 0;
    }
    return h;
  }

  private next(): number {
    this.seed ^= this.seed << 13;
    this.seed ^= this.seed >> 17;
    this.seed ^= this.seed << 5;
    this.seed = this.seed >>> 0; // keep unsigned 32bit
    return this.seed;
  }

  nextFloat(): number {
    return this.next() / 0xffffffff;
  }

  nextInt(): number {
    return this.next();
  }

  nextRange(from: number, to: number): number {
    return Math.floor(this.nextFloat() * (to - from)) + from;
  }
}
