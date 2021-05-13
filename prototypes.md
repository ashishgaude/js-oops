[back](/readme.md)

## Prototypes and Prototypical inheritance

When new object is created, it inherits prototype from default base Object. This is the reason why methods such as toString() are defined automatically when new object is created in javascript.

Since javascript does not have actually object oriented classes, prototypes are used to simulate inheritance. Since inheritance is done using prototypes, it is called Prototypical Inheritance.

## Multi-level inheritance
When an object of user defined class is created in javascript, its prototype will be the constructor of that class, which will intern have the prototype of base object default class.
This is multi-level inheritance. 
```
function Circle(radius) {
    this.radius = radius;
    this.draw = () => console.log("draw");
}

let circle = new Circle(3)

```

## Property Descriptors
Property Descriptors allows you to see the descriptors for any property in the object.
In the example below, we create an object. `baseObject` variable holds the prototype of object `a`.
i.e. `a` contains methods such as `toString`. We now try to get the descriptors of `toString` property and store it in `toStringDesc`. It has following attributes:
1. configurable: this means whether the property can be deleted or not.
2. enumerable: this means whether the property can be enumerable with `Object.keys` or with `for in` loop.
3. writable: this means wheter the property could be re-assigned new value
4. value: this holds the actual value/defination. 
```
let a = { name: "ashish" }

let baseObject = Object.getPrototypeOf(a);
let toStringDesc = Object.getOwnPropertyDescriptor(baseObject, 'toString');
console.log(toStringDesc);
```

### Setting property descriptors for user defined objects
Following is an example of defining the property descriptors of custom object property.
We have made the property `name` as read only, non-deletable and non-enumerable.
```
let a = { name: "ashish" }
Object.defineProperty(a, 'name', {
    writable: false,
    configurable: false,
    enumerable: false
});
```

prototype of constructors are same as that of defined object prototype.
Ex:
```
a = []
a.__proto__ === Array.prototype === Object.getPrototypeOf(a)

b = new Circle()
b.__proto__ === Circle.prototype === Object.getPrototypeOf(b) 
```
## Instance v/s Prototype members
When there are 100s of objects of any class, it can lead to lot of memory usage. To overcome this, we can move some instance members as prototype and inherit them in every object using the class constructor.

```
function Circle(radius) {
    this.radius = radius; // Instance member
}

Circle.prototype.draw = () => console.log('draw') // prototypical member

let c1 = new Circle(3)
let c2 = new Circle(2)
```

### Overwritting the existing prototype memebers functionalities
You can overwrite the existing memebers of prototype object like following and js will use the most accessible one like how node_modues are accessed using fallback mechanism.
```
function Circle(radius) {
    this.radius = radius;
}

Circle.prototype.toString = function () { return "Circle with radius " + this.radius; }

let c1 = new Circle(3)
console.log(c1.toString()); // Circle with radius 3
```

You can also access the instance memebers in the prototype methods like follwoing:
```
function Circle(radius) {
    this.radius = radius;
    this.move = () => console.log("move");
}

Circle.prototype.toString = function () {
    this.move();
    return "Circle with radius " + this.radius;
}

let c1 = new Circle(3)
console.log(c1.toString());

// move
// Circle with radius 3
```

NOTE: It is not necessary that the prototype is modified/updaed at first before creating any objects of that class. The reason being they are references.
The follwoing will still work.

```
function Circle(radius) {
    this.radius = radius;
    this.move = () => console.log("move");
}

let c1 = new Circle(3)
Circle.prototype.toString = function () { return "Circle with radius " + this.radius; }
console.log(c1.toString()); // Circle with radius 3
```
## Iterating Instance and prototype members
In the example above, if we do `Object.keys()` it will only return `['radius','move']`.
But `for in` loop will also have access to `draw`.

```
c1.hasOwnProperty('radius'); // true
c1.hasOwnProperty('draw');   // false
```
We can use hasOwnProperty method to check if the property we are checking for belongs to object or not.

NOTE: Do not modify the Objects you do not own using prototypes. There can be some libraries which are using the prototypes in different ways