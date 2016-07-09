var Controller = function(id, startX, startY) {
    console.log("CONTROLLER:", startX, startY);
    this._forward = 0;
    this._backward = 0;
    this._left = 0;
    this._right = 0;
    this._id = id;
    this._car = new Car(startX, startY);
}

Controller.prototype.getForward = function() {
    return this._forward;
}

Controller.prototype.setForward = function(value) {
    this._forward = value;
}

Controller.prototype.getBackward = function() {
    return this._backward;
}

Controller.prototype.setBackward = function(value) {
    this._backward = value;
}

Controller.prototype.getLeft = function() {
    return this._left;
}

Controller.prototype.setLeft = function(value) {
    this._left = value;
}

Controller.prototype.getRight = function() {
    return this._right;
}

Controller.prototype.setRight = function(value) {
    this._right = value;
}

Controller.prototype.getCar = function() {
    return this._car;
}

Controller.prototype.moveCar = function() {
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
    this.getCar().go(go);
}

Controller.prototype.getId = function() {
    return this._id;
}

var Keyboard = function(startX, startY) {
    Controller.call(this, undefined, startX, startY);
    this.addListeners();
}
Keyboard.prototype = Object.create(Controller.prototype);
Keyboard.prototype.constructor = Keyboard;
Keyboard.prototype.addListeners = function() {
    var self = this;
    window.addEventListener("keydown", function(e) {
        switch(e.keyCode) {
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
        }
    });
}

var Gamepad = function(id, startX, startY) {
    Controller.call(this, id, startX, startY);
}
Gamepad.prototype = Object.create(Controller.prototype);
Gamepad.prototype.constructor = Gamepad;
Gamepad.prototype.updateMovement = function(gamepad) {
    if(gamepad.axes[2] < -0.2) {
        this.setLeft(0);
        this.setRight(Math.abs(gamepad.axes[2]));
    } else if(gamepad.axes[2] > 0.2) {
        this.setLeft(Math.abs(gamepad.axes[2]));
        this.setRight(0);
    } else {
        this.setLeft(0);
        this.setRight(0);
    }

    if(gamepad.buttons[7].value > 0) {
        this.setForward(Math.abs(gamepad.buttons[7].value));
        this.setBackward(0);
    } else if(gamepad.buttons[6].value > 0) {
        this.setForward(0);
        this.setBackward(Math.abs(gamepad.buttons[6].value));
    } else {
        this.setForward(0);
        this.setBackward(0);        
    }
}