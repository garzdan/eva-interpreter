const EvaInterpreter = require('../../src/EvaInterpreter')

test("number expressions return the number as value", () => {
  const evaInterpreter = new EvaInterpreter();

  expect(evaInterpreter.eval(1)).toBe(1);
  expect(evaInterpreter.eval(0)).toBe(0);
  expect(evaInterpreter.eval(-1)).toBe(-1);
  expect(evaInterpreter.eval(-1.5)).toBe(-1.5);
});

test("string expressions return the string without surrounding double quotes", () => {
  const evaInterpreter = new EvaInterpreter();

  expect(evaInterpreter.eval('"test"')).toBe('test');
  expect(evaInterpreter.eval('"0"')).toBe('0');
  expect(evaInterpreter.eval('"lorem ipsum"')).toBe('lorem ipsum');
});
