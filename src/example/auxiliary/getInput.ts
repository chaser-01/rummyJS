import { createInterface } from "readline";

const readline = createInterface({
  input: process.stdin,
  output: process.stdout
});

//generic fn for getting inputs by command line
export function getInput<T>(prompt: string, validationCallback: (a: string)=>T): Promise<T> {
    return new Promise((resolve) => {
      function ask() {
        readline.question(prompt, (input) => {
          input = input.trim();
          const validatedInput = validationCallback(input);
          resolve(validatedInput);
        });
      }
      ask();
    });
  }