[back](/readme.md)

## Creating objects
### Factory functions
```
const createCircle = (radius) => {
    return {
        radius,
        draw: () => console.log("draw circle")
    }
}

const c1 = createCircle(3);
c1.draw()
```
NOTE: Since factory functions uses object literals `{}` to create objects, it internally using built in Object constructor `new Object()`

### Constructor functions
```
function Circle(radius) {
    this.radius = radius;
    this.draw = () => console.log("draw");
}

const c2 = new Circle(2);
c2.draw()
```

### new Function
```
const Circle1 = new Function('radius',`
this.radius = radius;
this.draw = ()=>console.log("draws");
`)
a = new Circle1(3)
a.draw()
```

## Functions are objects
We can access different methods/properties such as call,apply,length,etc

### Call and apply
```
function Circle(radius) {
    this.radius = radius;
    console.log("rad:",this.radius);
    this.draw = () => console.log("draw");
}

Circle.call({},3)
Circle.apply({},[3]])
```
Call and apply are used to call the function, first parameter is the this context and subsequent params are the arguments to the function being called.
Call uses `,` separated list of arguments whereas apply uses `[]` of arguments


### Types in Javascript
Value Types and Reference types

#### Value Types:
- Number
- String
- Boolean
- Symbol
- undefined
- null

#### Reference Types:
- Object
- Array
- Function

> Premitive data types are copied by their value
> Objects are copied by reference

```
let x = 10;
let y = x;

x = 20
console.log(x,y) // output: x will be 20, y will be 10

let x = {value:10}
let y = x;

x.value = 20
console.log(x,y) // output: Both values will be 20
```

## Adding/Removing properties
```
function Circle(radius) {
    this.radius = radius;
    console.log("rad:",this.radius);
    this.draw = () => console.log("draw");
}


let circle = new Circle(3)

circle.location = {x:1};
circle['location'] = {x:1};

delete circle.location
```

## Enumerating properties in Objects
```
function Circle(radius) {
    this.radius = radius;
    this.draw = () => console.log("draw");
}


let circle = new Circle(3)

// iterate over object keys
for (let property in circle) {
    console.log(property, circle[property]);
    if (typeof circle[property] == 'function')
        circle[property]()
}

// get all the keys in object as array
const keys = Object.keys(circle);

// check if the key exists in object
if ('radius' in circle)
    console.log("circle has radius");
```

## Abstraction in javascript
Hide the methods/properties which are internal to object and is not required to be called from outside.
This can be achieved by creating local variables/methods inside the object(class) instead of creating object properties/methods using `this` keyword.

The concept of `abstraction` also introduces the concept of `clousure`. Closure allows the function inside another function to permanently access the local variables/functions outside the function. Such variables/functions are said to be in clousure with inside functions.

The clousures are not to be confused with scopes since scopes are tempory, and dies after the inner function call is over.

```
function Circle(radius) {
    this.radius = radius; // public member

    let proptohide = "secret"; // private member
    let methodtohide = () => console.log("hidden method");

    this.draw = () => {
        console.log("draw");
        methodtohide()
    };
}

let circle = new Circle(3)

//  NOTE: proptohide and methodtohide are in closure of draw method.

```

## Defining getters/setters for private members of object

There are 2 different ways to access private memebers of the class/object. First is to define a separate function in the object to return the private member or Second, is to define getters/setters.

The problem with first approach is that, we have to invoke some function within the object to get the private property. Ex: `let privProp = circle.getPrivateProp()`

Defining getters/setters with validations
```
function Circle(radius) {
    this.radius = radius;
    let proptohide = { x: 0, y: 0 };
    this.draw = () => {
        console.log("draw");
    };

    Object.defineProperty(this, 'proptohide', {
        get: () => proptohide,
        set: (value) => {
            if (!value || !value.x || !value.y)
                throw new Error("Invalid value to set")
            proptohide = value
        }
    })
}
let circle = new Circle(3)
```

## Stopwatch exersize:
Design a stopwatch will capabilities:
1. Start functionality
2. Stop functionality
3. duration between start and stop for subsequent laps
4. reset functionality
Note that the Stopwatch properties should not be editable from outside
```
function StopWatch() {
    let duration = 0.0;
    let isStarted = false;
    let startedAt = null;

    this.start = () => {
        if (isStarted)
            throw new Error("Stop watch is already running");
        startedAt = new Date().getTime()
        isStarted = true;
    };
    this.stop = () => {
        if (!isStarted)
            throw new Error("Stop watch is not running right now");
        duration += (new Date().getTime() - startedAt) / 1000;
        isStarted = false;
    };
    this.reset = () => {
        duration = 0.0;
        isStarted = false;
        startedAt = null;
    };

    Object.defineProperty(this, 'duration', {
        get: () => duration,
    })
}
```