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
        
        class anyKey {
            #onPressFuncs;
            #onReleaseFuncs;
            #keysPressed;
            constructor() {
                this.#onPressFuncs = new Set();
                this.#onReleaseFuncs = new Set();
                this.#keysPressed = new Set();
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
                this.#keysPressed.add(k)
                for (const func of this.#onPressFuncs) {
                    func(k);
                }
            }
            release(k) {
                this.pressed = false;
                this.#keysPressed.delete(k)
                for (const func of this.#onReleaseFuncs) {
                    func(k);
                }
            }
            
            getPressedKeys() {
              return this.#keysPressed.values().toArray()
            }
        }
        let keypresses = {
          preventDefaultBehavior: false,
        };
        Object.defineProperty(keypresses, "addKey", {
          value: function (key) {
            if (key in this) return
            this[key] = new Key()
          },
          
          writable: false,
          configurable: false 
        })
        for (let i = 33; i <= 126; i++) {
            Object.defineProperty(keypresses, String.fromCharCode(i), 
            {  value: new Key(), 
               writable: false,
               configurable: false 
            });
        }
        ["shift", "control", "metaKey", "alt", "tab", "enter", "backspace", "escape", "space", "arrowup", "arrowdown", "arrowleft", "arrowright"]
        .forEach(function (e) {
            Object.defineProperty(keypresses, e, 
            {  value: new Key(), 
               writable: false,
               configurable: false 
            });
        });
        Object.defineProperty(keypresses, "any", 
            {  value: new anyKey(), 
               writable: false,
               configurable: false 
            });
        function onDown(event) {
            if (keypresses.preventDefaultBehavior) event.preventDefault()
            let k = (event.key == " ") ? "space" : event.metaKey ? "metaKey" : event.key.toLowerCase();
            if (!(k in keypresses)) { 
                console.error(`Key ${k} is not predefined please open an issue in the repo to get it fixed`); 
                keypresses[k] = new Key()
            }
            keypresses[k].down(k);
            keypresses.any.down(k);
        }
        function onUp(event) {
            if (keypresses.preventDefaultBehavior) event.preventDefault()
            let k = (event.key == " ") ? "space" : event.metaKey ? "metaKey" : event.key.toLowerCase();
            if (!(k in keypresses)) { 
                console.error(`Key ${k} is not predefined please open an issue in the Keypresses repo to get it fixed`); 
                keypresses[k] = new Key()
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
