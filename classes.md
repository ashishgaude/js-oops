[back](/index.md)

## Intro
ES6 introduced the concept of classes.
Now instead of using constructor functions to create new objects of particular type, we can use classes.
Note that javascript classes are not actually classes as in any other programming language, they are just a syntactic sugar. Internally they are javascript functions and for inheritance, they use prototypes of objects.
```
class Circle {
    constructor(radius) {
        this.radius = radius;
    }

    draw() {
        console.log("draw");
    }
}

let c = new Circle(4)
console.log(typeof(Circle)) // function
console.log(c.hasOwnProperty('draw')); // false
```
In above example, draw method is in the prototype of Circle.

## Hoisting
There are 2 ways to create a function
1. Function Declaration
`function sayHello(){}`  // hoisted
2. Function Expression
`const sayHello = function(){};` // not hoisted

There are 2 ways to create a class
1. Class Declaration
`class Circle{}`     // not hoisted
2. Class Expression
`const Circle = class {};`  // not hoisted

Javascript automatically hoists the function declaration. What this means is, below code will not throw error.
```
sayHello()
function sayHello(){}
```

## Static Methods
We use static methods in classes to create a utility functions that are not tied up to class objects.

```
class Circle {
    constructor(radius) {
        this.radius = radius;
    }

    // Instance method
    draw() {

    }

    // Static method
    static parse(str) {
        const radius = JSON.parse(str).radius;
        return new Circle(radius);
    }
}

const circle = Circle.parse('{"radius":1}');
console.log(circle);
```

## The this keyword
`this` keyword allows us to understand the context.

```
const Circle = function(){
    this.draw = function(){console.log(this)}
}


const c = new Circle()
// method call
c.draw()        // circle instance

const d = c.draw
// function call
d()             // window object
```
In the example above, when draw method from circle class is called using the object, the value of `this` is the Instance of that Class.
But then the reference to the draw method is stored in variable `d` and then invoked, the value of `this` becomes window object. This happens because the context with which the draw method was called has changed.

When the same code is executed in the strict mode, the invocation of `d()` will return `undefined` instead of window object. This is done so that, we do not modify the window/global object accidently.

```
class Circle {
    draw() {
        console.log(this);
    }
}


let c = new Circle();
c.draw();   // circle instance

cc = c.draw;
cc()        // undefined
```
The body of class by default executes in strict mode, so `cc()` function execution returns `undefined` instead of returning a window object.

## Private members to class using Symbols(Abstraction)

```
const _radius = Symbol();
const _draw = Symbol();

class Circle {
    constructor(radius){
        this[_radius] = radius
    }
    [_draw]() {
        console.log(this);
    }
}


let c = new Circle(4);
console.log(c);
```

## Private members using WeakMap
```
const _radius = new WeakMap();
const _draw = new WeakMap();

class Circle {
    constructor(radius) {
        _radius.set(this, radius);
        _draw.set(this, () => console.log(this))
    }
}


let c = new Circle(4);
console.log(c);
```

## Getters and setters for private members
For getters and setters in Function/Object based classes, we used to use `Object.defineProperty`. With ES6 classes, it is made easy.
```
const _radius = new WeakMap();

class Circle {
    constructor(radius) {
        _radius.set(this, radius);
    }

    get radius() {
        return _radius.get(this);
    }

    set radius(value) {
        if (value <= 0) throw new Error("Invalid radius");
        _radius.set(this, value);
    }
}


let c = new Circle(4);
c.radius        // 4
c.radius = 10 
c.radius        // 10
c.radius = -2   // Error: Invalid radius
c.radius        // 10
```

## Inheritance
Inheritance in es6 classes can be achived using `extends` keyword.
With `extend`, we do not have to re-set the construct of of the class as in case raw prototypical inheritance
```
class Shape {

    constructor(color) {
        this.color = color;
    }

    move() {
        console.log("move");
    }
}

class Circle extends Shape {

    constructor(color, radius) {
        super(color);
        this.radius = radius;
    }

    draw() {
        console.log("draw");
    }
}

const c = new Circle("red", 3);
```

## Method Overriding
Works similar as that of method overriding in prototypical inheritance.
we can call the parent method with `super` keyword
```
class Shape {
    move() {
        console.log("move");
    }
}

class Circle extends Shape {
    move() {
        super.move();
        console.log("circle move");
    }
}

const c = new Circle();

c.move()

// move
// circle move
```

## Exersize: Design stack data structure with classes
```
const _items = new WeakMap();

class Stack {
    constructor() {
        _items.set(this, []);
    }

    get count() {
        return _items.get(this).length;
    }

    peek() {
        const items = _items.get(this);
        if (items.length == 0) throw new Error("Stack is Empty");
        return items[items.length - 1]
    }

    pop() {
        const items = _items.get(this);
        if (items.length == 0) throw new Error("Stack is Empty");
        return items.pop();
    }

    push(value) {
        _items.get(this).push(value);
    }
}

const s = new Stack()
```