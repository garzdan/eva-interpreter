const Environment = require('../../src/Environment');

test('variable is stored into the environment record and returned when defined', () => {
  const env = new Environment();

  expect(env.define('foo', 5)).toBe(5);
  expect(env.record['foo']).toBe(5);
});

test('variable value stored in the environment record is returned when a variable is looked up', () => {
  const env = new Environment();
  env.define('foo', 18);

  expect(env.lookup('foo')).toBe(18);
});

test('reference error is thrown if a looked up variable is not stored in environment record', () => {
  const env = new Environment();

  expect(() => { env.lookup('foo'); }).toThrow('Variable foo is not defined.')
});

test('variable value stored in parent environment record can be looked up', () => {
  const parentEnv = new Environment({x: 10});
  const env = new Environment({}, parentEnv);

  expect(env.lookup('x')).toBe(10);
});

test('variable value stored in environment chain is updated on new assignment', () => {
  const parentEnv = new Environment({x: 10});
  const env = new Environment({}, parentEnv);

  env.assign('x', 50);

  expect(env.record['x'] ?? null).toBeNull();
  expect(env.lookup('x')).toBe(50);
});

test('reference error is is thrown if a variable updated through assignment does not exist', () => {
  const env = new Environment();
  expect(() => { env.assign('x', 10) }).toThrow('Variable x is not defined.')
});