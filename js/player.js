/**
 * Holds basic control instructions for each car
 *
 * @param {String} id
 * @param {Float} startX
 * @param {Float} startY
 */
var Player = function(id, startX, startY) {
    this._forward = 0;
    this._backward = 0;
    this._left = 0;
    this._right = 0;
    this._id = id;
    this._car = new Car(startX, startY);
    this._mappings = undefined;
    this._playerDisplay = undefined;
    this._mappingListen = {};
}

/**
 * Returns current forward value
 *
 * @return {Float} _forward
 */
Player.prototype.getForward = function() {
    return this._forward;
}

/**
 * Sets forward value
 *
 * @param {Float} value
 */
Player.prototype.setForward = function(value) {
    this._forward = Math.abs(value);
}

/**
 * Returns current backward value
 *
 * @return {Float} _backward
 */
Player.prototype.getBackward = function() {
    return this._backward;
}

/**
 * Sets backward value
 *
 * @param {Float} value
 */
Player.prototype.setBackward = function(value) {
    this._backward = Math.abs(value);
}

/**
 * Returns current left turn value
 *
 * @return {Float} _left
 */
Player.prototype.getLeft = function() {
    return this._left;
}

/**
 * Sets left turn value
 *
 * @param {Float} value
 */
Player.prototype.setLeft = function(value) {
    this._left = Math.abs(value);
}

/**
 * Returns current right turn value
 *
 * @return {Float} _right
 */
Player.prototype.getRight = function() {
    return this._right;
}

/**
 * Sets right turn value
 *
 * @param {Float} value
 */
Player.prototype.setRight = function(value) {
    this._right = Math.abs(value);
}

/**
 * Returns the car object for this player
 *
 * @return {Car} _car
 */
Player.prototype.getCar = function() {
    return this._car;
}

/**
 * Moves the car in canvas co-ordinates
 * based on input instructions
 * offset by the frame rate delta
 *
 * @param {Float} delta
 * @param {Float} startX
 * @param {Float} startY
 */
Player.prototype.moveCar = function(delta) {
    var turn = 0;
    if(this.getRight() > 0) {
        turn = this.getRight();
    } else {
        turn = -this.getLeft();
    }

    var go = 0;
    if(this.getForward() > 0) {
        go = this.getForward();
    } else {
        go = -this.getBackward();
    }

    this.getCar().turn(turn);
    this.getCar().go(delta, go);
}

/**
 * Returns the id for this player
 *
 * @return {String} _id
 */
Player.prototype.getId = function() {
    return this._id;
}

/**
 * Enables the car boost
 */
Player.prototype.enableBoost = function() {
    this._car.setBoost(true);
}

/**
 * Disables the car boost
 */
Player.prototype.disableBoost = function() {
    this._car.setBoost(false);
}

/**
 * Creates and inserts the display element for this player
 * Optionally shows input mapping options if set up
 *
 * @param {String} playerDescription
 */
Player.prototype.addPlayerDisplay = function(playerDescription) {
    var players = document.getElementById("players");
    
    //Create a container for the display
    var display = document.createElement("li");
    
    //Show a brief description of the player
    var description = document.createElement("div");
    description.className = "description";
    description.appendChild(document.createTextNode(playerDescription));
    description.appendChild(this.getCar().getImage());
    display.appendChild(description);
    
    //If custom mappings are enabled, show the buttons to remap them
    if(typeof this._mappings !== "undefined") {
        var bindings = document.createElement("dl");
        bindings.className = "bindings";
        for (var key in this._mappings) {
            //Input description
            var dt = document.createElement("dt");
            dt.appendChild(document.createTextNode(key));
            bindings.appendChild(dt);

            //Input mapping
            var dd = document.createElement("dd");
            var button = document.createElement("button");
            if(typeof this._mappings[key] == "object") {
                button.innerText = this._mappings[key].type + "[" + this._mappings[key].index + "]";
            } else {
            button.innerText = this._mappings[key];
            }
            button.dataset.binding = key;
            
            //Add listener for mapping change
            this._mappingListen[key] = this.startMappingListen.bind(this);
            button.addEventListener("click", this._mappingListen[key]);

            //Add to display
            dd.appendChild(button);
            bindings.appendChild(dd);
        }

        display.appendChild(bindings);
    }

    players.appendChild(display);

    return display;
}

/**
 * Removes the display element from view
 */
Player.prototype.removePlayerDisplay = function() {
    if(this._playerDisplay) {
        this._playerDisplay.parentElement.removeChild(this._playerDisplay);
        this._playerDisplay = undefined;
    }
}

/**
 * Enables the input mapping mode
 *
 * @param {Event} e
 */
Player.prototype.startMappingListen = function(e) {
    e.target.innerText = "listening...";
    e.target.disabled = true;

    this.listenForNewMapping(e.target);

    //Repeated click on the button would cancel remapping, not create another listener
    e.target.removeEventListener("click", this._mappingListen[e.target.dataset.binding]);
    this._mappingListen[e.target.dataset.binding] = this.endMappingListen.bind(this, e.target);
    e.target.addEventListener("click", this._mappingListen[e.target.dataset.binding]);
}

/**
 * Assigns the new input mapping to the player
 *
 * @param {Element} target
 * @param {String} binding
 * @param {String} value
 */
Player.prototype.recordNewMapping = function(target, binding, value) {
    this._mappings[binding] = value;
    this.endMappingListen(target);
}

/**
 * Stops listening for new mapping
 * and adjusts the view accordingly
 *
 * @param {Element} target
 */
Player.prototype.endMappingListen = function(target) {
    if(typeof this._mappings[target.dataset.binding] == "object") {
        target.innerText = this._mappings[target.dataset.binding].type + "[" + this._mappings[target.dataset.binding].index + "]";
    } else {
        target.innerText = this._mappings[target.dataset.binding];
    }
    target.disabled = false;

    //Set mapping back to default state
    target.removeEventListener("click", this._mappingListen[target.dataset.binding]);
    this._mappingListen[target.dataset.binding] = this.startMappingListen.bind(this);
    target.addEventListener("click", this._mappingListen[target.dataset.binding]);
}

/**
 * Holds special interpretations for keyboard input 
 *
 * @param {Float} startX
 * @param {Float} startY
 */
var Keyboard = function(startX, startY) {
    Player.call(this, undefined, startX, startY);
    this.init();
}
Keyboard.prototype = Object.create(Player.prototype);
Keyboard.prototype.constructor = Keyboard;

/**
 * Sets up default key mapping for keyboard input
 */
Keyboard.prototype.setDefaultMappings = function() {
    this._mappings = {
        left: 37,
        right: 39,
        forward: 38,
        backward: 40,
        boost: 32
    }
}

/**
 * Create listeners for keypresses
 * to control the car
 */
Keyboard.prototype.addListeners = function() {
    var self = this;
    window.addEventListener("keydown", function(e) {
        switch(e.which) {
            case self._mappings.forward:
                self.setForward(1);
                break;
            case self._mappings.backward:
                self.setBackward(1);
                break;
            case self._mappings.left:
                self.setLeft(1);
                break;
            case self._mappings.right:
                self.setRight(1);
                break;
            case self._mappings.boost:
                self.enableBoost();
                break;
        }
    });
    window.addEventListener("keyup", function(e) {
        switch(e.which) {
            case self._mappings.forward:
                self.setForward(0);
                break;
            case self._mappings.backward:
                self.setBackward(0);
                break;
            case self._mappings.left:
                self.setLeft(0);
                break;
            case self._mappings.right:
                self.setRight(0);
                break;
            case self._mappings.boost:
                self.disableBoost();
                break;
        }
    });
}

/**
 * Captures input to create the new mapping for an input
 *
 * @param {Element} target
 */
Keyboard.prototype.listenForNewMapping = function(target) {
    var self = this;

    //Create a separate function so we can remove the listener later
    var onKeyDown = function(e) {
        self.recordNewMapping(target, target.dataset.binding, e.which);
        window.removeEventListener("keydown", onKeyDown);
    };

    window.addEventListener("keydown", onKeyDown);
}

/**
 * Holds special interpretations for gamepad input 
 *
 * @param {Gamepad} gamepad
 * @param {Float} startX
 * @param {Float} startY
 */
var Controller = function(gamepad, startX, startY) {
    Player.call(this, gamepad.index, startX, startY);
    this.init(gamepad);
}
Controller.prototype = Object.create(Player.prototype);
Controller.prototype.constructor = Controller;

/**
 * Returns the associated Gamepad object for this controller
 *
 * @return {Gamepad} _gamepad
 */
Controller.prototype.getGamepad = function() {
    return this._gamepad;
}

/**
 * Sets the Gamepad object for this controller 
 *
 * @param {Gamepad} gamepad
 */
Controller.prototype.setGamepad = function(gamepad) {
    this._gamepad = gamepad;
}

/**
 * Interprets both axes and button inputs
 * to determine whether they are active or not 
 *
 * @param {String} action
 * @param {Boolean} asBoolean
 * @return {Float} value
 * @return {Boolean} value
 */
Controller.prototype.getValue = function(action, asBoolean) {
    if(typeof asBoolean === "undefined") {
        var asBoolean = false;
    }

    var binding = this._mappings[action];
    var gamepad = this.getGamepad();

    //Check all the right bits have been set
    if(!gamepad || !binding || (binding.type != "axes" && binding.type != "buttons")) {
        throw new Error("Gamepad not defined");
    } else if(!binding) {
        throw new Error("Binding not defined");
    } else if(binding.type != "axes" && binding.type != "buttons") {
        throw new Error("Incorrect binding");
    }
    
    if(binding.type == "axes") {
        if(binding.threshold > 0) {
            //Movement is towards the positive side
            if(gamepad["axes"][binding.index] > binding.threshold) {
                if(asBoolean) {
                    return true;
                } else {
                    return gamepad["axes"][binding.index];
                }
            } else {
                if(asBoolean) {
                    return false;
                } else {
                    return gamepad["axes"][binding.index];
                }
            }
        } else {
            //Movement is towards the negative side
            if(gamepad["axes"][binding.index] < binding.threshold) {
                if(asBoolean) {
                    return true;
                } else {
                    return gamepad["axes"][binding.index];
                }
            } else {
                if(asBoolean) {
                    return false;
                } else {
                    return gamepad["axes"][binding.index];
                }
            }
        }
    } else {
        if(asBoolean) {
            return gamepad["buttons"][binding.index].pressed;    
        } else {
            return gamepad["buttons"][binding.index].value;
        }
    }
};

/**
 * Sets the default mapping for a controller input
 */
Controller.prototype.setDefaultMappings = function() {
    this._mappings = {
        left: {
            type: "axes",
            index: 0,
            threshold: -0.2
        },
        right: {
            type: "axes",
            index: 0,
            threshold: 0.2
        },
        forward: {
            type: "buttons",
            index: 7    
        },
        backward: {
            type: "buttons",
            index: 6    
        },
        boost: {
            type: "buttons",
            index: 0    
        }
    }
}

/**
 * Captures input to create the new mapping for an input
 *
 * @param {Element} target
 */
Controller.prototype.listenForNewMapping = function(target) {
    var self = this;

    //Take a snapshot of current input state
    var startState = {
        axes: {},
        buttons: {}
    }
    for(axis in this.getGamepad().axes) {
        startState.axes[axis] = this.getGamepad().axes[axis];
    }
    for(button in this.getGamepad().buttons) {
        startState.buttons[button] = this.getGamepad().buttons[button].value;
    }

    //Create a function to loop over until we find a matdh
    function bindingPoll() {
        //Capture gamepad inside function so Edge gets the latest data
        var gamepad = self.getGamepad();
        var found = false;

        //Check axis changes first...
        for(axis in gamepad.axes) {
            var difference = Math.abs(gamepad.axes[axis] - startState.axes[axis]);
            if(difference > 0.5) {
                if(gamepad.axes[axis] < -0.2) {
                    found = true;
                    self.recordNewMapping(target, target.dataset.binding, {
                        type: "axes",
                        index: axis,
                        threshold: -0.2
                    });
                    break;
                } else if(gamepad.axes[axis] > 0.2) {
                    found = true;
                    self.recordNewMapping(target, target.dataset.binding, {
                        type: "axes",
                        index: axis,
                        threshold: 0.2
                    });
                    break;
                }
            }
        }

        //...then check button changes...
        if(!found) {
            for(button in gamepad.buttons) {
                var difference = Math.abs(gamepad.buttons[button].value - startState.buttons[button]);
                if(difference > 0.5) {
                    found = true;
                    self.recordNewMapping(target, target.dataset.binding, {
                        type: "buttons",
                        index: button
                    });
                    break;
                }
            }
        }

        //...then if no changes, try again next frame.
        if(!found) {
            requestAnimationFrame(bindingPoll);
        }
    }
    requestAnimationFrame(bindingPoll);
}