var Player = function(id, startX, startY) {
    this._forward = 0;
    this._backward = 0;
    this._left = 0;
    this._right = 0;
    this._id = id;
    this._car = new Car(startX, startY);
    this._bindings = {
        left: undefined,
        right: undefined,
        forward: undefined,
        backward: undefined,
        boost: undefined
    }
    this._playerDisplay = undefined;
    this._bindingListen = {};
}

Player.prototype.getForward = function() {
    return this._forward;
}

Player.prototype.setForward = function(value) {
    this._forward = value;
}

Player.prototype.getBackward = function() {
    return this._backward;
}

Player.prototype.setBackward = function(value) {
    this._backward = value;
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
    display.appendChild(description);
    
    var bindings = document.createElement("dl");
    bindings.className = "bindings";
    for (var key in this._bindings) {
        var dt = document.createElement("dt");
        dt.appendChild(document.createTextNode(key));
        bindings.appendChild(dt);

        var dd = document.createElement("dd");
        var input = document.createElement("input");
        input.setAttribute("type", "text");
        input.setAttribute("value", this._bindings[key]);
        input.dataset.binding = key;
        this._bindingListen[key] = this.startBindingListen.bind(this);
        input.addEventListener("click", this._bindingListen[key]);
        dd.appendChild(input);
        bindings.appendChild(dd);
    }
    display.appendChild(bindings);

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
    console.log("listening...");

    e.target.value = "listening...";
    e.target.disabled = true;

    this.listenForNewBinding(e.target);

    e.target.removeEventListener("click", this._bindingListen[e.target.dataset.binding]);
    this._bindingListen[e.target.dataset.binding] = this.endBindingListen.bind(this, e.target);
    e.target.addEventListener("click", this._bindingListen[e.target.dataset.binding]);
}
Player.prototype.recordNewBinding = function(target, binding, value) {
    this._bindings[binding] = value;
    this.endBindingListen(target);
}
Player.prototype.endBindingListen = function(target) {
    console.log("stopped listening");

    target.value = this._bindings[target.dataset.binding];
    target.disabled = false;

    target.removeEventListener("click", this._bindingListen[target.dataset.binding]);
    this._bindingListen[target.dataset.binding] = this.startBindingListen.bind(this);
    target.addEventListener("click", this._bindingListen[target.dataset.binding]);
}

var Keyboard = function(startX, startY) {
    Player.call(this, undefined, startX, startY);
    this.setDefaultBindings();
    this.addListeners();
    this._playerDisplay = this.addPlayerDisplay("keyboard");
}
Keyboard.prototype = Object.create(Player.prototype);
Keyboard.prototype.constructor = Keyboard;
Keyboard.prototype.setDefaultBindings = function() {
    this._bindings = {
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
            case self._bindings.forward: //Up
                self.setForward(1);
                break;
            case self._bindings.backward: //Down
                self.setBackward(1);
                break;
            case self._bindings.left: //Left
                self.setLeft(1);
                break;
            case self._bindings.right: //Right
                self.setRight(1);
                break;
            case self._bindings.boost: //Space
                self.enableBoost();
                break;
        }
    });
    window.addEventListener("keyup", function(e) {
        switch(e.which) {
            case self._bindings.forward: //Up
                self.setForward(0);
                break;
            case self._bindings.backward: //Down
                self.setBackward(0);
                break;
            case self._bindings.left: //Left
                self.setLeft(0);
                break;
            case self._bindings.right: //Right
                self.setRight(0);
                break;
            case self._bindings.boost: //Space
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
}
Controller.prototype = Object.create(Player.prototype);
Controller.prototype.constructor = Controller;
Controller.prototype.getGamepad = function() {
    return this._gamepad;
}
Controller.prototype.updateMovement = function() {
    var gamepad = this.getGamepad();

    if(gamepad.axes[0] < -0.2) {
        this.setLeft(gamepad.axes[0]);
        this.setRight(0);
    } else if(gamepad.axes[0] > 0.2) {
        this.setLeft(0);
        this.setRight(gamepad.axes[0]);
    } else {
        this.setLeft(0);
        this.setRight(0);
    }

    if(gamepad.buttons[7].value > 0) {
        this.setForward(gamepad.buttons[7].value);
        this.setBackward(0);
    } else if(gamepad.buttons[6].value > 0) {
        this.setForward(0);
        this.setBackward(gamepad.buttons[6].value);
    } else {
        this.setForward(0);
        this.setBackward(0);
    }

    if(gamepad.buttons[0].pressed) {
        this.enableBoost();
    } else {
        this.disableBoost();
    }
}