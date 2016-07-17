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

Player.prototype.getForward = function() {
    return this._forward;
}

Player.prototype.setForward = function(value) {
    this._forward = Math.abs(value);
}

Player.prototype.getBackward = function() {
    return this._backward;
}

Player.prototype.setBackward = function(value) {
    this._backward = Math.abs(value);
}

Player.prototype.getLeft = function() {
    return this._left;
}

Player.prototype.setLeft = function(value) {
    this._left = Math.abs(value);
}

Player.prototype.getRight = function() {
    return this._right;
}

Player.prototype.setRight = function(value) {
    this._right = Math.abs(value);
}

Player.prototype.getCar = function() {
    return this._car;
}

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

Player.prototype.getId = function() {
    return this._id;
}

Player.prototype.enableBoost = function() {
    this._car.setBoost(true);
}

Player.prototype.disableBoost = function() {
    this._car.setBoost(false);
}
Player.prototype.addPlayerDisplay = function(playerDescription) {
    var players = document.getElementById("players");
    
    var display = document.createElement("li");
    
    var description = document.createElement("div");
    description.className = "description";
    description.appendChild(document.createTextNode(playerDescription));
    description.appendChild(this.getCar().getImage());
    display.appendChild(description);
    
    if(typeof this._mappings !== "undefined") {
        var bindings = document.createElement("dl");
        bindings.className = "bindings";
        for (var key in this._mappings) {
            var dt = document.createElement("dt");
            dt.appendChild(document.createTextNode(key));
            bindings.appendChild(dt);

            var dd = document.createElement("dd");
            var button = document.createElement("button");
            if(typeof this._mappings[key] == "object") {
                button.innerText = this._mappings[key].type + "[" + this._mappings[key].index + "]";
            } else {
            button.innerText = this._mappings[key];
            }
            button.dataset.binding = key;
            this._mappingListen[key] = this.startBindingListen.bind(this);
            button.addEventListener("click", this._mappingListen[key]);
            dd.appendChild(button);
            bindings.appendChild(dd);
        }
        display.appendChild(bindings);
    }

    players.appendChild(display);

    return display;
}
Player.prototype.removePlayerDisplay = function() {
    if(this._playerDisplay) {
        this._playerDisplay.parentElement.removeChild(this._playerDisplay);
        this._playerDisplay = undefined;
    }
}
Player.prototype.startBindingListen = function(e) {
    e.target.innerText = "listening...";
    e.target.disabled = true;

    this.listenForNewBinding(e.target);

    e.target.removeEventListener("click", this._mappingListen[e.target.dataset.binding]);
    this._mappingListen[e.target.dataset.binding] = this.endBindingListen.bind(this, e.target);
    e.target.addEventListener("click", this._mappingListen[e.target.dataset.binding]);
}
Player.prototype.recordNewBinding = function(target, binding, value) {
    this._mappings[binding] = value;
    this.endBindingListen(target);
}
Player.prototype.endBindingListen = function(target) {
    if(typeof this._mappings[target.dataset.binding] == "object") {
        target.innerText = this._mappings[target.dataset.binding].type + "[" + this._mappings[target.dataset.binding].index + "]";
    } else {
        target.innerText = this._mappings[target.dataset.binding];
    }
    target.disabled = false;

    target.removeEventListener("click", this._mappingListen[target.dataset.binding]);
    this._mappingListen[target.dataset.binding] = this.startBindingListen.bind(this);
    target.addEventListener("click", this._mappingListen[target.dataset.binding]);
}

var Keyboard = function(startX, startY) {
    Player.call(this, undefined, startX, startY);
    this.setDefaultMappings();
    this.addListeners();
    this._playerDisplay = this.addPlayerDisplay("Keyboard");
}
Keyboard.prototype = Object.create(Player.prototype);
Keyboard.prototype.constructor = Keyboard;
Keyboard.prototype.setDefaultMappings = function() {
    this._mappings = {
        left: 37,
        right: 39,
        forward: 38,
        backward: 40,
        boost: 32
    }
}
Keyboard.prototype.addListeners = function() {
    var self = this;
    window.addEventListener("keydown", function(e) {
        switch(e.which) {
            case self._mappings.forward: //Up
                self.setForward(1);
                break;
            case self._mappings.backward: //Down
                self.setBackward(1);
                break;
            case self._mappings.left: //Left
                self.setLeft(1);
                break;
            case self._mappings.right: //Right
                self.setRight(1);
                break;
            case self._mappings.boost: //Space
                self.enableBoost();
                break;
        }
    });
    window.addEventListener("keyup", function(e) {
        switch(e.which) {
            case self._mappings.forward: //Up
                self.setForward(0);
                break;
            case self._mappings.backward: //Down
                self.setBackward(0);
                break;
            case self._mappings.left: //Left
                self.setLeft(0);
                break;
            case self._mappings.right: //Right
                self.setRight(0);
                break;
            case self._mappings.boost: //Space
                self.disableBoost();
                break;
        }
    });
}
Keyboard.prototype.listenForNewBinding = function(target) {
    var self = this;

    var onKeyDown = function(e) {
        self.recordNewBinding(target, target.dataset.binding, e.which);
        window.removeEventListener("keydown", onKeyDown);
    };

    window.addEventListener("keydown", onKeyDown);
}

var Controller = function(gamepad, startX, startY) {
    Player.call(this, gamepad.index, startX, startY);
    this._gamepad = gamepad;
    this.setDefaultMappings();
    this._playerDisplay = this.addPlayerDisplay("Controller");
}
Controller.prototype = Object.create(Player.prototype);
Controller.prototype.constructor = Controller;
Controller.prototype.getGamepad = function() {
    return this._gamepad;
}
Controller.prototype.setGamepad = function(gamepad) {
    this._gamepad = gamepad;
}
Controller.prototype.getValue = function(action, asBoolean) {
    if(typeof asBoolean === "undefined") {
        var asBoolean = false;
    }

    var binding = this._mappings[action];
    var gamepad = this.getGamepad();

    if(!gamepad || !binding || (binding.type != "axes" && binding.type != "buttons")) {
        throw new Error("Gamepad not defined");
    } else if(!binding) {
        throw new Error("Binding not defined");
    } else if(binding.type != "axes" && binding.type != "buttons") {
        throw new Error("Incorrect binding");
    }
    
    if(binding.type == "axes") {
        if(binding.threshold > 0) {
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
Controller.prototype.updateMovement = function() {
    var gamepad = this.getGamepad();

    if(this.getValue("left", true)) {
        this.setLeft(this.getValue("left"));
        this.setRight(0);
    } else if(this.getValue("right", true)) {
        this.setLeft(0);
        this.setRight(this.getValue("right"));
    } else {
        this.setLeft(0);
        this.setRight(0);
    }

    if(this.getValue("forward", true)) {
        this.setForward(this.getValue("forward"));
        this.setBackward(0);
    } else if(this.getValue("backward", true)) {
        this.setForward(0);
        this.setBackward(this.getValue("backward"));
    } else {
        this.setForward(0);
        this.setBackward(0);
    }

    if(this.getValue("boost", true)) {
        this.enableBoost();
    } else {
        this.disableBoost();
    }
}
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
Controller.prototype.listenForNewBinding = function(target) {
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

    function bindingPoll() {
        var gamepad = self.getGamepad(); //Captured here so Edge gets the latest data
        var found = false;
        for(axis in gamepad.axes) {
            var difference = Math.abs(gamepad.axes[axis] - startState.axes[axis]);
            if(difference > 0.5) {
                if(gamepad.axes[axis] < -0.2) {
                    found = true;
                    self.recordNewBinding(target, target.dataset.binding, {
                        type: "axes",
                        index: axis,
                        threshold: -0.2
                    });
                    break;
                } else if(gamepad.axes[axis] > 0.2) {
                    found = true;
                    self.recordNewBinding(target, target.dataset.binding, {
                        type: "axes",
                        index: axis,
                        threshold: 0.2
                    });
                    break;
                }
            }
        }

        if(!found) {
            for(button in gamepad.buttons) {
                var difference = Math.abs(gamepad.buttons[button].value - startState.buttons[button]);
                if(difference > 0.5) {
                    found = true;
                    self.recordNewBinding(target, target.dataset.binding, {
                        type: "buttons",
                        index: button
                    });
                    break;
                }
            }
        }

        if(!found) {
            requestAnimationFrame(bindingPoll);
        }
    }
    requestAnimationFrame(bindingPoll);
}