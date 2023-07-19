function beforeAfterMethodWrapper(target, methodName, beforeFn, afterFn) {
    const originalMethod = target[methodName];
  
    target[methodName] = function (...args) {
      if (beforeFn) {
        beforeFn(methodName, args);
      }
  
      const result = originalMethod.apply(this, args);
  
      if (afterFn) {
        afterFn(methodName, result);
      }
  
      return result;
    };
  }
  
  class MyClass {
    method1() {
      console.log("Method 1 is called.");
    }
  
    method2() {
      console.log("Method 2 is called.");
    }
  }
  
  // Wrapping method1 and method2 with additional functions
  beforeAfterMethodWrapper(MyClass.prototype, "method1", (methodName, args) => {
    console.log(`Before ${methodName}`);
  }, (methodName, result) => {
    console.log(`After ${methodName}`);
  });
  
  beforeAfterMethodWrapper(MyClass.prototype, "method2", (methodName, args) => {
    console.log(`Before ${methodName}`);
  }, (methodName, result) => {
    console.log(`After ${methodName}`);
  });
  
  const myObj = new MyClass();
  myObj.method1();
  myObj.method2();