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

show("I love u.", "and you", "and youAll");
