/**
 * AST transformer
 */

module.exports = class Transformer {
  /**
   * translate `def` expressions (function declarations) into a variable declaration with a lambda expression
   */
  transformDefToLambda(defExp) {
    const [_tag, name, params, body] = defExp;

    return  ['var', name, ['lambda', params, body]];
  }

  /**
   * translate `switch` expressions into a chain of `if` expressions (one for each one of the switch case, with the
   * `else` block as last alternate)
   */
  transformSwitchToIf(switchExp) {
    const [_tag, ...cases] = switchExp;
    const ifExp = ['if', null, null, null];
    let current = ifExp;

    for (let i = 0; i < cases.length - 1; i++) {
      const [currentCond, currentBlock] = cases[i];
      const next = cases[i + 1];
      const [nextCond, nextBlock] = next;

      current[1] = currentCond;
      current[2] = currentBlock;
      current[3] = (nextCond === 'else' ? nextBlock : ['if', null, null, null]);

      current = current[3];
    }

    return ifExp;
  }

  /**
   * translate `for` expressions into `while` expressions
   */
  transformForToWhile(forExp) {
    const [_tag, init, condition, modifier, body] = forExp;

    return ['begin',
      init,
      ['while', condition, ['begin',
        body,
        modifier,
      ]]
    ];
  }

  /**
   * translate `++ <variable>` expressions into `(set <variable> (+ <variable> 1))` expressions
   */
  transformIncToSet(incExp) {
    return ['set', incExp[1], ['+', incExp[1], 1]]
  }

  /**
   * translate `-- <variable>` expressions into `(set <variable> (- <variable> 1))` expressions
   */
  transformDecToSet(decExp) {
    return ['set', decExp[1], ['-', decExp[1], 1]]
  }
}