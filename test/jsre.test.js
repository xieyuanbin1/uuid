const assert = require('assert')
const v4 = require('../index')

function deepEqual(x, y) {
  if (x === y) {
      return true;
  }
  if (!(typeof x == "object" && x != null) || !(typeof y == "object" && y != null)){
      return false;
  }
  //比较对象内部
  if (Object.keys(x).length != Object.keys(y).length){
      return false;
  }
  for (var prop in x) {
      if (y.hasOwnProperty(prop))
      {  
          if (!deepEqual(x[prop], y[prop])){
              return false;
          }
      }
      else{
          return false;
      }
  }
  return true;
}

function test (desc, testcase) {
  console.info(desc)
  assert.deepEqual = deepEqual
  testcase(assert)
}
const randomBytesFixture = [
  0x10, 0x91, 0x56, 0xbe, 0xc4, 0xfb, 0xc1, 0xea, 0x71, 0xb4, 0xef, 0xe1, 0x67, 0x1c, 0x58, 0x36,
]

const expectedBytes = [16, 145, 86, 190, 196, 251, 65, 234, 177, 180, 239, 225, 103, 28, 88, 54]

test('subsequent UUIDs are different', t => {
  const id1 = v4();
  const id2 = v4();
  t.ok(id1 !== id2);
})

test('explicit options.random produces expected result', t => {
  const id = v4({
    random: randomBytesFixture,
  });
  t.strictEqual(id, '109156be-c4fb-41ea-b1b4-efe1671c5836');
});

test('explicit options.rng produces expected result', t => {
  const id = v4({
    rng: () => randomBytesFixture,
  });
  t.strictEqual(id, '109156be-c4fb-41ea-b1b4-efe1671c5836');
});

test('fills one UUID into a buffer as expected', t => {
  const buffer = [];
  const result = v4(
    {
      random: randomBytesFixture,
    },
    buffer
  );
  t.deepEqual(buffer, expectedBytes);
  t.strictEqual(buffer, result);
});

test('fills two UUIDs into a buffer as expected', t => {
  const buffer = [];
  v4(
    {
      random: randomBytesFixture,
    },
    buffer,
    0
  );
  v4(
    {
      random: randomBytesFixture,
    },
    buffer,
    16
  );
  t.deepEqual(buffer, expectedBytes.concat(expectedBytes));
});
