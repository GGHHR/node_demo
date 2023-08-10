
let a=1;
class b{
    #a=2;
    constructor(){
        console.log(this.#a)
    }
}

console.log(new b().a)