function validate(y: any){
    return function (target: any, property: string, descriptor: PropertyDescriptor){
        console.log(y)
    }
}

class Mine {
    x: string;
    constructor() {this.x = "lol";}

    @validate(this)
    test(f: string) {}
}

let mine = new Mine();
mine.test('guh')