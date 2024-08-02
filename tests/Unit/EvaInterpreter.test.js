const EvaInterpreter = require('../../src/EvaInterpreter');
const evaInterpreter = new EvaInterpreter();


test("number expressions return the number as value", () => {
  expect(evaInterpreter.eval(1)).toBe(1);
  expect(evaInterpreter.eval(0)).toBe(0);
  expect(evaInterpreter.eval(-1)).toBe(-1);
  expect(evaInterpreter.eval(-1.5)).toBe(-1.5);
});

test("string expressions return the string without surrounding double quotes as value", () => {
  expect(evaInterpreter.eval('"test"')).toBe('test');
  expect(evaInterpreter.eval('"0"')).toBe('0');
  expect(evaInterpreter.eval('"lorem ipsum"')).toBe('lorem ipsum');
});

test("sum expression returns the sum of the operands as value", () => {
  expect(evaInterpreter.eval(['+', 0, 3])).toBe(3);
  expect(evaInterpreter.eval(['+', 4, 7])).toBe(11);
  expect(evaInterpreter.eval(['+', 2.4, 12.3])).toBeCloseTo(14.7);
  expect(evaInterpreter.eval(['+', ['+', 4, 8], 7])).toBe(19);
  expect(evaInterpreter.eval(['+', 2, ['+', 1, 1]])).toBe(4);
  expect(evaInterpreter.eval(['+', ['+', 1, 3], ['+', 5, 9]])).toBe(18);
});

test('subtraction expression returns the difference between the operands as value', () => {
  expect(evaInterpreter.eval(['-', 3, 0])).toBe(3);
  expect(evaInterpreter.eval(['-', 7, 4])).toBe(3);
  expect(evaInterpreter.eval(['-', 2, 8])).toBe(-6);
  expect(evaInterpreter.eval(['-', 2.4, 12.3])).toBeCloseTo(-9.9);
  expect(evaInterpreter.eval(['-', 14.8, 11.1])).toBeCloseTo(3.7);
  expect(evaInterpreter.eval(['-', ['-', 114, 8], 7])).toBe(99);
  expect(evaInterpreter.eval(['-', 2, ['-', 1, 1]])).toBe(2);
  expect(evaInterpreter.eval(['-', ['-', 1, 3], ['-', 5, 9]])).toBe(2);
});

test('multiplication expression returns the product of the operands as value', () => {
  expect(evaInterpreter.eval(['*', 3, 0])).toBe(0);
  expect(evaInterpreter.eval(['*', 7, 4])).toBe(28);
  expect(evaInterpreter.eval(['*', 2, -8])).toBe(-16);
  expect(evaInterpreter.eval(['*', 2.4, 12.3])).toBeCloseTo(29.52);
  expect(evaInterpreter.eval(['*', -14.8, 11.1])).toBeCloseTo(-164.28);
  expect(evaInterpreter.eval(['*', ['*', 114, 8], 7])).toBe(6384);
  expect(evaInterpreter.eval(['*', 2, ['*', 1, 1]])).toBe(2);
  expect(evaInterpreter.eval(['*', ['*', 3, 3], ['*', 5, 9]])).toBe(405);
});

test('division expression returns the ratio between the operands as value', () => {
  expect(evaInterpreter.eval(['/', 3, 0])).toBe(Infinity);
  expect(evaInterpreter.eval(['/', 8, 4])).toBe(2);
  expect(evaInterpreter.eval(['/', 8, -8])).toBe(-1);
  expect(evaInterpreter.eval(['/', 22.4, 12.3])).toBeCloseTo(1.82);
  expect(evaInterpreter.eval(['/', -14.8, 7.1])).toBeCloseTo(-2.08);
  expect(evaInterpreter.eval(['/', ['/', 114, 8], 7])).toBeCloseTo(2.035);
  expect(evaInterpreter.eval(['/', 2, ['/', 1, 2]])).toBe(4);
  expect(evaInterpreter.eval(['/', ['/', 3, 3], ['/', 12, 3]])).toBeCloseTo(0.25);
});

test('module expression returns the reminder of the division between the operands as value', () => {
  expect(evaInterpreter.eval(['%', 3, 0])).toBe(NaN);
  expect(evaInterpreter.eval(['%', 8, 4])).toBe(0);
  expect(evaInterpreter.eval(['%', 8, -7])).toBe(1);
  expect(evaInterpreter.eval(['%', 22.4, 12.3])).toBeCloseTo(10.1);
  expect(evaInterpreter.eval(['%', ['%', 114, 8], 7])).toBe(2);
  expect(evaInterpreter.eval(['%', 2, ['%', 1, 2]])).toBe(0);
  expect(evaInterpreter.eval(['%', ['%', 7, 3], ['%', 12, 5]])).toBe(1);
});