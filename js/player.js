var Player = function(id, startX, startY) {
    this._forward = 0;
    this._backward = 0;
    this._left = 0;
    this._right = 0;
    this._id = id;
    this._car = new Car(startX, startY);
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
    this._left = value;
}

Player.prototype.getRight = function() {
    return this._right;
}

Player.prototype.setRight = function(value) {
    this._right = value;
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

var Keyboard = function(startX, startY) {
    Player.call(this, undefined, startX, startY);
    this.addListeners();
}
Keyboard.prototype = Object.create(Player.prototype);
Keyboard.prototype.constructor = Keyboard;
Keyboard.prototype.addListeners = function() {
    var self = this;
    window.addEventListener("keydown", function(e) {
        switch(e.which) {
            case 38: //Up
                self.setForward(1);
                break;
            case 40: //Down
                self.setBackward(1);
                break;
            case 37: //Left
                self.setRight(1);
                break;
            case 39: //Right
                self.setLeft(1);
                break;
            case 32: //Space
                self.enableBoost();
                break;
        }
    });
    window.addEventListener("keyup", function(e) {
        switch(e.keyCode) {
            case 38: //Up
                self.setForward(0);
                break;
            case 40: //Down
                self.setBackward(0);
                break;
            case 37: //Left
                self.setRight(0);
                break;
            case 39: //Right
                self.setLeft(0);
                break;
            case 32: //Space
                self.disableBoost();
                break;
        }
    });
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
    if(this.getGamepad().axes[0] < -0.2) {
        this.setLeft(0);
        this.setRight(Math.abs(this.getGamepad().axes[0]));
    } else if(this.getGamepad().axes[0] > 0.2) {
        this.setLeft(Math.abs(this.getGamepad().axes[0]));
        this.setRight(0);
    } else {
        this.setLeft(0);
        this.setRight(0);
    }

    if(this.getGamepad().buttons[7].value > 0) {
        this.setForward(Math.abs(this.getGamepad().buttons[7].value));
        this.setBackward(0);
    } else if(this.getGamepad().buttons[6].value > 0) {
        this.setForward(0);
        this.setBackward(Math.abs(this.getGamepad().buttons[6].value));
    } else {
        this.setForward(0);
        this.setBackward(0);        
    }

    if(this.getGamepad().buttons[0].pressed) {
        this.enableBoost();
    } else {
        this.disableBoost();
    }
}