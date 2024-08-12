const EvaInterpreter = require('../../src/EvaInterpreter');
const evaInterpreter = new EvaInterpreter();
const Environment = require('../../src/Environment');

//self-evaluating expressions:

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

//-------------------

//block expressions:
test('block expressions are correctly executed', () => {
  const result = evaInterpreter.eval(['begin',
    ['var', 'x', 15],
    ['var', 'y', 5],
    ['-', 'x', 'y']
  ]);

  expect(result).toBe(10);
});

test('block expression has is own scope', () => {
  evaInterpreter.eval(['var', 'x', 10]); //declare variable x in global scope with value 10

  expect(evaInterpreter.eval('x')).toBe(10);

  const result = evaInterpreter.eval(['begin',
    ['var', 'x', 20],
    'x'
  ]);

  expect(result).toBe(20);

  expect(evaInterpreter.eval('x')).toBe(10);
});

test('block environment has access to parent environment', () => {
  const result = evaInterpreter.eval(['begin',
    ['var', 'x', 10],
    ['begin',
      'x'
    ]
  ]);

  expect(result).toBe(10);
});

//-------------------

//math expressions:

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

//-------------------

//comparison expressions:

test('comparison expressions return a boolean', () => {
  expect(evaInterpreter.eval(['>', 10, 5])).toBe(true);
  expect(evaInterpreter.eval(['>', 2, 2])).toBe(false);
  expect(evaInterpreter.eval(['>', 3, 7])).toBe(false);
  expect(evaInterpreter.eval(['>=', 12, 8])).toBe(true);
  expect(evaInterpreter.eval(['>=', 53, 53])).toBe(true);
  expect(evaInterpreter.eval(['>=', 3, 5])).toBe(false);
  expect(evaInterpreter.eval(['<', 11, 32])).toBe(true);
  expect(evaInterpreter.eval(['<', 1, 1])).toBe(false);
  expect(evaInterpreter.eval(['<', 40, 11])).toBe(false);
  expect(evaInterpreter.eval(['<=', 3, 12])).toBe(true);
  expect(evaInterpreter.eval(['<=', 12, 12])).toBe(true);
  expect(evaInterpreter.eval(['<=', 22, 12])).toBe(false);
  expect(evaInterpreter.eval(['=', 65, 11])).toBe(false);
  expect(evaInterpreter.eval(['=', 4, 4])).toBe(true);
  expect(evaInterpreter.eval(['=', 5, 12])).toBe(false);
});

//-------------------

//variable expressions:

test('variable declaration expression returns the assigned value', () => {
  expect(evaInterpreter.eval(['var', 'x', 7])).toBe(7);
});

test('variable declaration expression stores variable in the current environment', () => {
  const env = new Environment();

  evaInterpreter.eval(['var', 'foo', 15], env);
  expect(env.lookup('foo')).toBe(15);
});

test('variable assignation correctly updates an existing variable value', () => {
  evaInterpreter.eval(['var', 'x', 7]);

  evaInterpreter.eval(['begin',
    ['set', 'x', 10]
  ]);

  expect(evaInterpreter.eval('x')).toBe(10);
});

test('variable assignment throws if the variable to update does not exist', () => {
  expect(() => {
    evaInterpreter.eval(['set', 'z', 10]);
  }).toThrow('Variable z is not defined.');
});

test('variable lookup resolve the identifier and returns the variable value', () => {
  const result = evaInterpreter.eval(['begin',
    ['var', 'x', 10],
    ['begin',
      'x'
    ]
  ]);

  expect(result).toBe(10);
});

test('variable lookup throws if the variable is not defined', () => {
  expect(() => evaInterpreter.eval('z')).toThrow('Variable z is not defined.');
});

//-------------------

//conditional expressions:

test('if expression executes consequent if condition is true', () => {
  expect(evaInterpreter.eval(['if', ['>', 3, 2], '"consequent"', '"alternate"'])).toBe('consequent');
});

test('if expression executes alternate if condition is false', () => {
  expect(evaInterpreter.eval(['if', ['<', 3, 2], '"consequent"', '"alternate"'])).toBe('alternate');
});

//-------------------

//cycle expressions:

test('while expression returns the result of its last iteration', () => {
  expect(evaInterpreter.eval(['begin',
    ['var', 'counter', 0],
    ['var', 'result', 1],
    ['while', ['<', 'counter', 5],
      ['begin',
        ['set', 'result', ['+', 'result', 'result']],
        ['set', 'counter', ['+', 'counter', 1]]
      ]
    ],
    'result',
  ])).toBe(32);
});

//-------------------
