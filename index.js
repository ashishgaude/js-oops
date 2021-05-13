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

