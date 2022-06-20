interface Options {
  random?: Array;
  rng?: () => Array;
}
export default function uuid(options?: Options , buf?: Buffer | Array, offset?: number = 0): string;
