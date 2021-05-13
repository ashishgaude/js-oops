[back](/readme.md)

## Ways to create instances of class
```
function Shape() { }

let s1 = new Shape();
let s2 = new Shape.prototype.constructor()
```
Both s1 and s2 will have instance of Shape class.

## Prototypical Inheritance in action
Prototypical inheritance can be achieved by Re-assigning the prototype of object using `Object.Create()` method as follows.
Object.create uses whaterver is passed as parameter as the prototype for the new object to be created.
```
function Shape() { }

Shape.prototype.duplicate = function () { console.log("duplicate") };

function Circle(radius) {
    this.radius = radius;
}

Circle.prototype = Object.create(Shape.prototype);
Circle.prototype.draw = function () { console.log("draw") };


let s = new Shape();  // Shape->Object
let c = new Circle(3) // Circle->Shape->Object
```
The problem with above approach is that, since we have re-assigned the prototype of Cirle
`Circle.prototype = Object.create(Shape.prototype);`, we lose the abilit to create a Circle instance using `let c = new Circle.prototype.constructor(2)`.
So as a best practice it is always recommended to re-define the constructor once the prototype is re-assigned as follows:
```
Circle.prototype = Object.create(Shape.prototype);
Circle.prototype.constructor = Circle;
```

## Calling the super constructor
Passing parameters to parent class can be achieved by using `call` methods of object. `call` allows to pass the context of object to the constructor of parent. This is necessary since, otherwise the this == window and parent constructor will set the constructor variables on window object.
```
function Shape(color) {
    this.color = color;
}

Shape.prototype.duplicate = function () { console.log("duplicate",this.color) };

function Circle(radius, color) {
    Shape.call(this, color);
    this.radius = radius;
}

Circle.prototype = Object.create(Shape.prototype);
Circle.prototype.constructor = Circle;
Circle.prototype.draw = function () { console.log("draw") };

let c = new Circle(3, "red")

```

## Intermediate Function Inheritance
This allows us to encapsulate the re-defination of the constructor inside a function as follows:
```
function Shape(color) {
    this.color = color;
}

Shape.prototype.duplicate = function () { console.log("duplicate", this.color) };

function extend(Child, Parent) {
    Child.prototype = Object.create(Parent.prototype);
    Child.prototype.constructor = Child;

}

function Circle(radius, color) {
    Shape.call(this, color);
    this.radius = radius;
}
extend(Circle, Shape);
Circle.prototype.draw = function () { console.log("draw") };

let c = new Circle(3, "red")

function Square(size, color) {
    Shape.call(this, color)
    this.size = size
}
extend(Square, Shape)
```
In above example, the extend method is a intermediate function for inheritance.

## Method Overriding
We might need to override the methods from the parent in the child class. The following is an example to achieve same.
```
function extend(Child, Parent) {
    Child.prototype = Object.create(Parent.prototype);
    Child.prototype.constructor = Child;
}

function Shape(color) {
    this.color = color;
}
Shape.prototype.duplicate = function () { console.log("duplicate", this.color) };


function Circle(radius, color) {
    Shape.call(this, color);
    this.radius = radius;
}
extend(Circle, Shape);
Circle.prototype.duplicate = function () {
    Shape.prototype.duplicate.call(this)
    console.log("duplicate circle")
};

let c = new Circle(3, "red");
```
NOTE: Javascript walks through the prototypical chain and picks up the most recent implementation of the method just like node_modules.

In above example `Shape.prototype.duplicate.call(this)` line could have been replaced with `Shape.prototype.duplicate()` if we are not using `this` operator in the duplicate method of shape class. `call` method allows us to pass the reference of Circle class to Shape class.

## Polymorphism
This means having many forms of same entity. In the example below, duplicate method which originally belonged to Shape class, is Overriden in Circle and Square class.
This allows us to have multiple forms of duplicate method in different types of objects.

```
function extend(Child, Parent) {
    Child.prototype = Object.create(Parent.prototype);
    Child.prototype.constructor = Child;
}

function Shape(color) {
    this.color = color;
}
Shape.prototype.duplicate = function () { console.log("duplicate", this.color) };


function Circle(radius, color) {
    Shape.call(this, color);
    this.radius = radius;
}
extend(Circle, Shape);
Circle.prototype.duplicate = function () {
    console.log("duplicate circle")
};


function Square(size) {
    this.size = size;
}

extend(Square, Shape);
Square.prototype.duplicate = function () { console.log("duplicate square") }

let c = new Circle(3, "red")

let shapes = [
    new Circle(2, 'red'),
    new Square(4)
]

for (shape of shapes) {
    shape.duplicate()
}

// duplicate circle
// duplicate square
```

## Where to use inheritance
Inheritance can create issues when we increase the levels of inheritance. We will have to think about the right place to implement the methods as the hirerchy becomes complex. It is always advisable to keep the inheritance at single level.
Composition is to be preffered over inheritance, since it allows us to create separate objects with capabilities and assign those capabilities to new classes/objects that we create.

## Mixins (Composition)
Composition allows us to add certail capabilities/behaviours to our classes without using inheritance.
We define the objects with behaviours first and then compose a class with different behaviours as follows.
```
function mixin(source, ...target) {
    Object.assign(source, ...target)
}
const canEat = {
    eat: function () {
        this.hunger--;
        console.log("Eating");
    }
}

const canWalk = {
    walk: function () { console.log("walking") }
}

const canSwim = {
    swim: function () { console.log("Swimming") }
}

function Person() { }
mixin(Person.prototype, canEat, canWalk)
let p = new Person()


function Fish() {
}

mixin(Fish.prototype, canEat, canSwim)
let f = new Fish()
```

## Exersize on prototypical inheritance and Polymorphism
- Design HTMLElement and HTMLSelectElement Objects
- Add new HTMLImgElement with src parameter
- Add render method to show polymorphism

```
function HTMLElement() {
    this.click = function () { console.log("click") }
}


HTMLElement.prototype.focus = function () { console.log("focus") };

a = new HTMLElement()


function HTMLSelectElement(items) {
    this.items = items || [];
    this.addItems = function (arr) {
        this.items = [...this.items, ...arr];
    }
    this.removeItem = function () {
        this.items.pop();
    }
    this.render = function () {
        if (!this.items.length) return null;
        let items = this.items.map(item => `<option>${item}</option>`);
        return `<select>${items.join('')}</select>`
    }
}

HTMLSelectElement.prototype = new HTMLElement()
HTMLSelectElement.prototype.constructor = HTMLSelectElement

xx = new HTMLSelectElement([1, 2, 3])


function HTMLImgElement(src) {
    this.src = src;
    this.render = function () {
        if (!this.src) return null
        return `<img src='${this.src}'/>`
    }
}

HTMLImgElement.prototype = new HTMLElement()
HTMLImgElement.prototype.constructor = HTMLImgElement

let i = new HTMLImgElement()


let elemets = [new HTMLSelectElement([1, 2, 3]), new HTMLImgElement("https://google.com")]

for (ele of elemets) {
    console.log(ele.render())
}
```