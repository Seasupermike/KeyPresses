"use strict";
Object.defineProperty(globalThis, "Input", {
    value: (function () {
        class Key {
            #onPressFuncs;
            #onReleaseFuncs;
            constructor() {
                this.#onPressFuncs = new Set();
                this.#onReleaseFuncs = new Set();
                this.pressed = false;
            }
            onPress(func) {
                if (typeof func != "function")
                    throw TypeError(`onPress expected a function, received a ${typeof func}`);
                this.#onPressFuncs.add(func);
            }
            onRelease(func) {
                if (typeof func != "function")
                    throw TypeError(`onRelease expected a function, received a ${typeof func}`);
                this.#onReleaseFuncs.add(func);
            } 
      
            down(k) {
                this.pressed = true;
                for (const func of this.#onPressFuncs) {
                    func(k);
                }
            }
            release(k) {
                this.pressed = false;
                for (const func of this.#onReleaseFuncs) {
                    func(k);
                }
            }
        }
        let keypresses = {
          preventDefaultBehavior: false
        };
        for (let i = 33; i <= 126; i++) {
            keypresses[String.fromCharCode(i)] = new Key();
        }
        ["any", "shift", "control", "metaKey", "alt", "tab", "enter", "backspace", "escape", "space"]
        .forEach(function (e) {
            keypresses[e] = new Key();
        });
        function onDown(event) {
            if (keypresses.preventDefaultBehavior) event.preventDefault()
            let k = (event.key == " ") ? "space" : event.metaKey ? "metaKey" : event.key.toLowerCase();
            if (!(k in keypresses)) { 
                console.error(`Key ${k} is not predefined please open an issue in the repo to get it fixed`); 
                keypresses[k] = new Key()
                return;
            }
            keypresses[k].down(k);
            keypresses.any.down(k);
        }
        function onUp(event) {
            if (keypresses.preventDefaultBehavior) event.preventDefault()
            let k = (event.key == " ") ? "space" : event.metaKey ? "metaKey" : event.key.toLowerCase();
            if (!(k in keypresses)) { 
                console.error(`Key ${k} is not predefined please open an issue in the repo to get it fixed`); 
                keypresses[k] = new Key()
                return;
            }            
            keypresses[k].release(k);
            keypresses.any.release(k);
        }
        globalThis.addEventListener("keydown", (event) => onDown(event));
        globalThis.addEventListener("keyup", (event) => onUp(event));
        return keypresses;
    })(),
    writable: false,
    configurable: false
});
