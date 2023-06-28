class A{
    constructor(foo){
        this.#foo = foo;
        this.bar = new B(this);
    }

    get foo(){return this.foo}
}

class B{
    constructor(object){
        this.thing = object;
    }
}

let test = new A('foo')

