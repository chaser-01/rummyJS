function x (test: string|number): {[arg: string]: string|number} {
    return {test}
}

console.log(x(1))