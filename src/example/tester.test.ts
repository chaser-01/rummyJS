import { x } from "./tester";

test('Add 1+2 should be 3', ()=>{
    expect(x(1,2)).toBe(3)
})