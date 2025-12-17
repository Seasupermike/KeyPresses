# keyPresses library
A simple browser keyboard input handler.This library attaches an Input object directly to the global window scope (globalThis), providing a clean API to check which keys are pressed and attach custom callbacks to key events.

##### How to link
Imbed the following code into your head to use the library
````html
<script src="https://cdn.jsdelivr.net/gh/Seasupermike/KeyPresses@main/Input.js"></script>
````

#### Usage
The input handler exposes a global object named Input.
1. Checking Key State (Is a key currently held down?)
You can check the pressed property of any supported key.
````javascript
// Check if the 'space' bar is currently held down
if (Input.space.pressed) {
    console.log("Jumping!");
}

// Check if the 'D' key is pressed
if (Input.d.pressed) {
    console.log("Moving Right!");
}

// Check modifier keys
if (Input.shift.pressed && Input.a.pressed) {
    console.log("Running left!");
}
````
2. Attaching Event Callbacks (On Press / On Release)
You can attach functions that run once when a key is pressed down or released.
````javascript
// Log a message every time the 'Enter' key is pressed
Input.enter.onDown(() => {
    console.log("Action confirmed!");
});

// Log a message when the 'Escape' key is released
Input.escape.onUp(function () {
    console.log("Menu closed.");
});
````

3. The any Key Handler
A special key Input.any is available. Its callbacks run whenever any tracked key is pressed or released. The callback function receives the name of the key that triggered the event as an argument.
````javascript
Input.any.onDown((keyName) => {
    console.log(`Key pressed globally: ${keyName}`);
});

Input.any.onUp(function (keyName) {
    console.log(`Key released globally: ${keyName}`);
});
````

#### Configuration
The default browser behavior for certain keys (like Tab changing focus or Backspace navigating back a page) is active by default.

To prevent these default actions in your application (common for games), set the preventDefaultBehavior flag to true:
````javascript
// Stop the browser from using default key behaviors (like tabbing between elements)
Input.preventDefaultBehavior = true;
````

#### Supported Keys
The library pre-defines standard ASCII characters (!, ", #, $ ... ~) as well as the following special keys:
1. any
2. shift
3. control
4. alt
5. metaKey (Command on Mac, Windows key on PC)
6. tab
7. enter
8. backspace
9. escape
10. space

Keys are normalized to lowercase internally (e.g., you check Input.a.pressed, not Input.A.pressed).
Handling Unknown Keys
If a user presses a key that wasn't included in the initial configuration (e.g.,  numpad keys, or international characters), the system dynamically adds a new Key object for it and logs a console error asking you to open an issue in the repo to get it fixed. The key will then be tracked like any other key.
