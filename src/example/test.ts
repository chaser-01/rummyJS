class Test{
    private _readonly: number;

    constructor() {this._readonly = 1;}

    public get readonly() {return this._readonly;}
}

let test = new Test()

console.log(test.readonly)