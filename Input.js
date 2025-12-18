"use strict";
Object.defineProperty(globalThis, "Input", {
    value: (function () {
        class Key {
            #onPressFuncs;
            #onReleaseFuncs;
            constructor(name) {
                this.name = name;
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
            constructor(name) {
                this.name = name;
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
                this.pressed = (this.getPressedKeys().length == 0);
                this.#keysPressed.delete(k)
                for (const func of this.#onReleaseFuncs) {
                    func(k);
                }
            }
            
            clear() {
              this.#keysPressed = new Set()
            }
            
            getPressedKeys() {
                return [...this.#keysPressed.values()];
            }
        }
        let keypresses = {
          preventDefaultBehavior: false,
        };
        Object.defineProperty(keypresses, "addKey", {
          value: function (key) {
            if (key in this) return
            Object.defineProperty(keypresses, key, {
                value: new Key(key),
                writable: false,
                configurable: false
            })
          },
          
          writable: false,
          configurable: false 
        })
        for (let i = 33; i <= 126; i++) {
            keypresses.addKey(String.fromCharCode(i))
        }
        ["shift", "control", "metakey", "alt", "tab", "enter", "backspace", "escape", "space", "arrowup", "arrowdown", "arrowleft", "arrowright", "F1", "F2", "F3", "F4", "F5", "F6", "F7", "F8", "F9", "F10", "F11", "F12", "F13", "F14", "F15", "F16", "F17", "F18", "F19", "F20", "F21", "F22", "F23", "F24"]
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
            if (event.repeat) return
            if (keypresses.preventDefaultBehavior) event.preventDefault()
            let k = (event.key == " ") ? "space" : event.metaKey ? "metakey" : event.key.toLowerCase();
            if (!(k in keypresses)) { 
                console.error(`Key ${k} is not predefined please open an issue in the repo to get it fixed`); 
                keypresses.addKey(k)
            }
            keypresses[k].down(k);
            keypresses.any.down(k);
        }
        function onUp(event) {
            if (event.repeat) return
            if (keypresses.preventDefaultBehavior) event.preventDefault()
            let k = (event.key == " ") ? "space" : event.metaKey ? "metakey" : event.key.toLowerCase();
            if (!(k in keypresses)) { 
                console.error(`Key ${k} is not predefined please open an issue in the Keypresses repo to get it fixed`); 
                keypresses.addKey(k)
            }            
            keypresses[k].release(k);
            keypresses.any.release(k);
        }
        globalThis.addEventListener("keydown", (event) => onDown(event));
        globalThis.addEventListener("keyup", (event) => onUp(event));
        globalThis.addEventListener("blur", () => {
            keypresses.any.clear() 
            for (let k in keypresses) {
              if (typeof keypresses[k] != "object") return
              keypresses[k].pressed = false
            }
            
        });
        return keypresses;
    })(),
    writable: false,
    configurable: false
});
