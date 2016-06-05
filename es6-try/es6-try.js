let print = (input) => console.log(input);
let upper = (input) => input.toUpperCase();

let show = (info, ...others) => { // Spread/Rest turn arguments into real array
    print(`param: ${info}`);

    if (!(others.length > 0)) {
        print(`no other param, others.length: ${others.length}`);
        return;
    }

    // for(let param of others) { // 1. for...of loop
    for (var ret, param, iterator = others[Symbol.iterator]();
        (ret = iterator.next()) && !ret.done; /* not other action for each loop */ ) { // 2. Symbol.iterator loop
        param = ret.value;
        print(`other param: ${upper(param)}`); // template literals
    }
};

// show("I love u.", "and you", "and youAll");

function chained(functions) {
  return arg => functions.reduce((prev, cur) => cur(prev), arg);
}

function f1(x){ return x*2 }
function f2(x){ return x+2 }
function f3(x){ return Math.pow(x,2) }

function f4(x){ return x.split("").concat().reverse().join("").split(" ")}
function f5(xs){ return xs.concat().reverse() }
function f6(xs){ return xs.join("_") }

print(chained([f1,f2,f3])(0))
print(chained([f1,f2,f3])(2))
print(chained([f3,f2,f1])(2))