const crypto = require('crypto')
const rnds8Pool = new Uint8Array(256)
let poolPtr = rnds8Pool.length

const byteToHex = []

for (let i = 0; i < 256; ++i) {
  byteToHex.push((i + 0x100).toString(16).slice(1))
}

function rng() {
  if (poolPtr > rnds8Pool.length - 16) {
    // in nodejs use randomFillSync
    // jsre use randomFill
    crypto.randomFillSync ? crypto.randomFillSync(rnds8Pool) : crypto.randomFill(rnds8Pool)
    poolPtr = 0
  }
  return rnds8Pool.slice(poolPtr, poolPtr += 16)
}

function unsafeStringify (arr, offset = 0) {
  return (
    byteToHex[arr[offset + 0]] +
    byteToHex[arr[offset + 1]] +
    byteToHex[arr[offset + 2]] +
    byteToHex[arr[offset + 3]] +
    '-' +
    byteToHex[arr[offset + 4]] +
    byteToHex[arr[offset + 5]] +
    '-' +
    byteToHex[arr[offset + 6]] +
    byteToHex[arr[offset + 7]] +
    '-' +
    byteToHex[arr[offset + 8]] +
    byteToHex[arr[offset + 9]] +
    '-' +
    byteToHex[arr[offset + 10]] +
    byteToHex[arr[offset + 11]] +
    byteToHex[arr[offset + 12]] +
    byteToHex[arr[offset + 13]] +
    byteToHex[arr[offset + 14]] +
    byteToHex[arr[offset + 15]]
  ).toLowerCase()
}

module.exports = function (options, buf, offset) {
  if (crypto.randomUUID) {
    return crypto.randomUUID();
  }
  options = options || {}
  const rnds = options.random || (options.rng || rng)();
  rnds[6] = (rnds[6] & 0x0f) | 0x40
  rnds[8] = (rnds[8] & 0x3f) | 0x80

  // Copy bytes to buffer, if provided
  if (buf) {
    offset = offset || 0;

    for (let i = 0; i < 16; ++i) {
      buf[offset + i] = rnds[i];
    }

    return buf;
  }

  return unsafeStringify(rnds)
}
