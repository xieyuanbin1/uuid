interface Options {
  random?: ArrayLike<number> | undefined;
  rng?: (() => ArrayLike<number>) | undefined;
}
export default function uuid(options?: Options , buf?: ArrayLike<number>, offset?: number): string;
