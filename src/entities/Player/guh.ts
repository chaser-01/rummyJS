var valuesArr = ["v1","v2","v3","v4","v5"];
var removeValFrom = [0, 2, 4];
valuesArr = valuesArr.filter(function(value, index) {
     return removeValFrom.indexOf(index) == -1;
})

console.log(valuesArr)