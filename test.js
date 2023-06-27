class T{
    test(){
        console.log('hi')
    }
}

class B extends T{
    test(){
        super.test();
        console.log('hi2')
    }
}

let x = new B();
x.test()