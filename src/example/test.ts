function test (s: string){
    console.log(s)
}

function test2 <Type> (s: Type[]){
    s.map(x => console.log(x))
}

function test3 <Type extends {length: number}> (s: Type[]){
    s.map(x => console.log(`${x}, ${x.length}`))
}

function myForEach(arr: any[], callback: (arg: any, index?: number) => void) {
    for (let i=0; i<arr.length; i++){
        callback(arr[i]);
    }

}

myForEach([1,2,3,4,5], (a, i) => console.log(a, i))
