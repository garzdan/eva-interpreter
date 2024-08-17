const Transformer = require('./../../../src/transformer/Transformer');
const transformer = new Transformer();

test('`def` expressions are translated to variable declarations with lambda expressions', () => {
  const defExp = ['def', 'foo', ['x'],['begin', 'x']];
  const varExp = transformer.transformDefToLambda(defExp);

  expect(varExp).toEqual(['var', 'foo', ['lambda', ['x'], ['begin', 'x']]]);
});

test('`switch` expressions are translated to `if` expressions', () => {
  const switchExp = ['switch',
    [['=', 'x', 5], ['print', '"foo"']],
    [['>', 'x', 5], ['print', '"bar"']],
    ['else', ['print', '"else"']],
  ];

  const ifExp = transformer.transformSwitchToIf(switchExp);

  expect(ifExp).toEqual(['if',
    ['=', 'x', 5],
    ['print', '"foo"'],
    ['if', ['>', 'x', 5],
      ['print', '"bar"'],
      ['print', '"else"'],
    ],
  ]);
});

test('`for` expressions are transformed to `while` expressions`', () => {
  const forExp = ['for', ['var', 'i', 0], ['<', 'i', 5], ['++', 'i'],
    ['print', 'i']
  ];

  const whileExp = transformer.transformForToWhile(forExp);

  expect(whileExp).toEqual(['begin',
    ['var', 'i', 0],
    ['while', ['<', 'i', 5], ['begin',
      ['print', 'i'],
      ['++', 'i'],
    ]],
  ]);
});

test('`++` expressions are transformed to `set` expressions which increase variable values by 1', () => {
  const incExp = ['++', 'i'];
  const setExp = transformer.transformIncToSet(incExp);

  expect(setExp).toEqual(['set', 'i', ['+', 'i', 1]]);
});

test('`--` expressions are transformed to `set` expressions which decrease variable values by 1', () => {
  const decExp = ['--', 'i'];
  const setExp = transformer.transformDecToSet(decExp);

  expect(setExp).toEqual(['set', 'i', ['-', 'i', 1]]);
});


