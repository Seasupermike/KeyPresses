"use strict";
Object.defineProperty(globalThis, "Input", {
    value: (function () {
        class Key {
            #onPressFuncs;
            #onReleaseFuncs
            constructor() {
                this.#onPressFuncs = new Set();
                this.#onReleaseFuncs = new Set();
                this.pressed = false;
            }
            onDown(func) {
                if (typeof func != "function")
                    throw TypeError(`onDown expected a function, received a ${typeof func}`);
                this.#onPressFuncs.add(func);
            }
            onUp(func) {
                if (typeof func != "function")
                    throw TypeError(`onUp expected a function, received a ${typeof func}`);
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
        let keypresses = {};
        for (let i = 32; i <= 126; i++) {
            keypresses[String.fromCharCode(i)] = new Key();
        }
        ["any", "shift", "control", "alt", "tab", "enter", "backspace", "escape", "space"]
            .forEach(function (e) {
            keypresses[e] = new Key();
        });
        function onDown(event) {
            if (keypresses[event.key] == undefined) {
                console.log(event.key);
            }
            let k = (event.key == " ") ? "space" : event.key.toLowerCase();
            keypresses[k].down();
            keypresses.any.down(k);
        }
        function onUp(event) {
            let k = (event.key == " ") ? "space" : event.key.toLowerCase();
            keypresses[k].release();
            keypresses.any.release(k);
        }
        globalThis.addEventListener("keydown", (event) => onDown(event));
        globalThis.addEventListener("keyup", (event) => onUp(event));
        return keypresses;
    })(),
    writable: false,
    configurable: false
});
