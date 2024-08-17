const evaParser = require('../../src/parser/evaParser');
const EvaInterpreter = require('../../src/EvaInterpreter');
const evaInterpreter = new EvaInterpreter();

function _interpret(code) {
  return evaInterpreter.eval(evaParser.parse(code));
}

//self-evaluating expressions:

test("number expressions return the number as value", () => {
  expect(_interpret(`1`)).toBe(1);
  expect(_interpret(`0`)).toBe(0);
  expect(_interpret(`1.5`)).toBe(1.5);
  expect(_interpret(`-1`)).toBe(-1);
});

test("string expressions return the string without surrounding double quotes as value", () => {
  expect(_interpret(`"test"`)).toBe('test');
  expect(_interpret(`"0"`)).toBe('0');
  expect(_interpret(`"lorem ipsum"`)).toBe('lorem ipsum');
});

//-------------------

//block expressions:
test('block expressions are correctly executed', () => {
  expect(_interpret(`
    (begin 
      (var x 15)
      (var y 5)
      (- x y)
    )
  `)).toBe(10);
});

test('block expression has is own scope', () => {
  //declare variable x in global scope with value 10
  expect(_interpret(`
    (var x 10)
  `)).toBe(10);

  //shadow variable x in block scope with value 20
  expect(_interpret(`
    (begin
      (var x 20)
    )
  `)).toBe(20);

  //lookup at variable x value outside block scope to check if it's still 10
  expect(_interpret(`x`)).toBe(10);
});

test('block environment has access to parent environment', () => {
  expect(_interpret(`
    (begin
      (var x 10)
      (begin
        x
      )
    )
  `)).toBe(10);
});

//-------------------

//math expressions:

test("sum expression returns the sum of the operands as value", () => {
  expect(_interpret(`(+ 0 3)`)).toBe(3);
  expect(_interpret(`(+ 4 7)`)).toBe(11);
  expect(_interpret(`(+ 2.4 12.3)`)).toBeCloseTo(14.7);
  expect(_interpret(`(+ (+ 4 8) 7)`)).toBe(19);
  expect(_interpret(`(+ 2 (+ 1 1))`)).toBe(4);
  expect(_interpret(`(+ (+ 1 3) (+ 5 9))`)).toBe(18);
});

test('subtraction expression returns the difference between the operands as value', () => {
  expect(_interpret(`(- 3 0)`)).toBe(3);
  expect(_interpret(`(- 7 4)`)).toBe(3);
  expect(_interpret(`(- 2 8)`)).toBe(-6);
  expect(_interpret(`(- 2.4 12.3)`)).toBeCloseTo(-9.9);
  expect(_interpret(`(- 14.8 11.1)`)).toBeCloseTo(3.7);
  expect(_interpret(`(- (- 114 8) 7)`)).toBe(99);
  expect(_interpret(`(- 2 (- 1 1))`)).toBe(2);
  expect(_interpret(`(- (- 1 3) (- 5 9))`)).toBe(2);
});

test('multiplication expression returns the product of the operands as value', () => {
  expect(_interpret(`(* 3 0)`)).toBe(0);
  expect(_interpret(`(* 7 4)`)).toBe(28);
  expect(_interpret(`(* 2 -8)`)).toBe(-16);
  expect(_interpret(`(* 2.4 12.3)`)).toBeCloseTo(29.52);
  expect(_interpret(`(* -14.8 11.1)`)).toBeCloseTo(-164.28);
  expect(_interpret(`(* (* 114 8) 7)`)).toBe(6384);
  expect(_interpret(`(* 2 (* 1 1))`)).toBe(2);
  expect(_interpret(`(* (* 3 3) (* 5 9))`)).toBe(405);
});

test('division expression returns the ratio between the operands as value', () => {
  expect(_interpret(`(/ 3 0)`)).toBe(Infinity);
  expect(_interpret(`(/ 8 4)`)).toBe(2);
  expect(_interpret(`(/ 8 -8)`)).toBe(-1);
  expect(_interpret(`(/ 22.4 12.3)`)).toBeCloseTo(1.82);
  expect(_interpret(`(/ -14.8 7.1)`)).toBeCloseTo(-2.08);
  expect(_interpret(`(/ (/ 114 8) 7)`)).toBeCloseTo(2.035);
  expect(_interpret(`(/ 2 (/ 1 2))`)).toBe(4);
  expect(_interpret(`(/ (/ 3 3) (/ 12 3))`)).toBeCloseTo(0.25);
});

test('module expression returns the reminder of the division between the operands as value', () => {
  expect(_interpret(`(% 3 0)`)).toBe(NaN);
  expect(_interpret(`(% 8 4)`)).toBe(0);
  expect(_interpret(`(% 8 -7)`)).toBe(1);
  expect(_interpret(`(% 22.4 12.3)`)).toBeCloseTo(10.1);
  expect(_interpret(`(% (% 114 8) 7)`)).toBe(2);
  expect(_interpret(`(% 2 (% 1 2))`)).toBe(0);
  expect(_interpret(`(% (% 7 3) (% 12 5))`)).toBe(1);
});

//-------------------

//comparison expressions:

test('comparison expressions return a boolean', () => {
  expect(_interpret(`(> 10 5)`)).toBe(true);
  expect(_interpret(`(> 2 2)`)).toBe(false);
  expect(_interpret(`(> 3 7)`)).toBe(false);
  expect(_interpret(`(>= 12 8 )`)).toBe(true);
  expect(_interpret(`(>= 53 53)`)).toBe(true);
  expect(_interpret(`(>= 3 5)`)).toBe(false);
  expect(_interpret(`(< 11 32)`)).toBe(true);
  expect(_interpret(`(< 1 1)`)).toBe(false);
  expect(_interpret(`(< 40 11)`)).toBe(false);
  expect(_interpret(`(<= 3 12)`)).toBe(true);
  expect(_interpret(`(<= 12 12)`)).toBe(true);
  expect(_interpret(`(<= 22 12)`)).toBe(false);
  expect(_interpret(`(= 65 11)`)).toBe(false);
  expect(_interpret(`(= 4 4)`)).toBe(true);
  expect(_interpret(`(= 5 12)`)).toBe(false);
});

//-------------------

//variable expressions:

test('variable declaration expression returns the assigned value', () => {
  expect(_interpret(`(var x 7)`)).toBe(7);
});

test('variable declaration expression stores variable in the current environment', () => {
  expect(_interpret(`
    (begin
      (var foo 15)
      foo
    )
    `)).toBe(15);
});

test('variable assignation correctly updates an existing variable value', () => {
  expect(_interpret(`
    (begin
      (var x 7)
      (begin
        (set x 10)
        x
      )
    )
  `)).toBe(10);
});

test('variable assignment throws if the variable to update does not exist', () => {
  expect(() => {
    _interpret(`(set z 10)`);
  }).toThrow('Variable z is not defined.');
});

test('variable lookup resolve the identifier and returns the variable value', () => {
  expect(_interpret(`
    (begin
      (var x 10)
      (begin
        x
      )
    )
  `)).toBe(10);
});

test('variable lookup throws if the variable is not defined', () => {
  expect(() => _interpret(`z`)).toThrow('Variable z is not defined.');
});

//-------------------

//conditional expressions:

test('if expression executes consequent if condition is true', () => {
  expect(_interpret(`(if (> 3 2) "consequent" "alternate")`)).toBe('consequent');
});

test('if expression executes alternate if condition is false', () => {
  expect(_interpret(`(if (< 3 2) "consequent" "alternate")`)).toBe('alternate');
});

test('switch expression executes the right case if condition is met', () => {
  expect(_interpret(`
    (begin
      (var x 10)
      (switch ((= x 5) 100)
              ((> x 5) 200)
              (else 300)
      )
    )
  `)).toBe(200)
})
//-------------------

//cycle expressions:

test('while loop returns the result of its last iteration', () => {
  expect(_interpret(`
    (begin
      (var counter 0)
      (var result 1)
      (while (< counter 5)
        (begin
          (set result (+ result result))
          (set counter (+ counter 1))
        )
      )
      result    
    )
  `)).toBe(32);
});

test('for loop returns the result of its last iteration', () => {
  expect(_interpret(`
    (begin
      (var result 1)
      (for (var counter 0) (< counter 5) (++ counter) (set result (+ result result)))
      result
    )
  `)).toBe(32);
})
//-------------------
//increment/decrement expressions
test('increment expression increase variable value by 1', () => {
  expect(_interpret(`
    (begin
      (var x 10)
      (++ x)
    )
  `)).toBe(11);
});

test('decrement expression decrease variable value by 1', () => {
  expect(_interpret(`
    (begin
      (var x 10)
      (-- x)
    )
  `)).toBe(9);
});
//-------------------
//function expressions
test('calling a user-defined function with parameters returns the expected result', () => {
  expect(_interpret(`
    (begin
      (def square (x)
        (* x x)
      )
      
      (square 2)
    )
  `)).toBe(4)
});

test('functions have a static scope', () => {
  expect(_interpret(`
    (begin
      (var x 8)
      
      (def foo (y)
        (begin
          (var result (* x y))
          result
        )
      )
      
      (begin
        (var x 20)
        (foo 2)
      )        
    )
  `)).toBe(16)
});

test(' functions are closures', () => {
  expect(_interpret(`
    (begin
      (var x 15)    
      (var y 13)
      (def calc (a b)
        (begin
          (var z (+ a b))
          (def inner (c)
            (+ (+ (+ x y) z) c)
          )
          inner
        )
      )
      
      (begin
        (var fn (calc 7 4))
        (fn 1)
      )        
    )
  `)).toBe(40);
});

test('lambda functions can be passed as argument to other functions', () => {
  expect(_interpret(`
    (begin
      (var x 10)
      (var y 20)
      
      (def foo (callback)
        (callback x y)
      )
      
      (foo (lambda (a b)
        (* a b)
      ))
    )
  `)).toBe(200);
});

test('lamba functions can be immediately invoked (IILE)', () => {
  expect(_interpret(`
    (begin
      ((lambda (x) (* x 20)) 2)
    )
  `)).toBe(40);
})

test ('functions can be called recursively', () => {
  expect(_interpret(`
    (begin
      (def factorial (x)
        (if (= 1 x)
          1
          (* x (factorial (- x 1)))
        )
      )
      
      (factorial 5)  
    )
  `)).toBe(120)
})
//-------------------
