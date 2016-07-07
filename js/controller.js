var Controller = function() {
    this._forward = 0;
    this._backward = 0;
    this._left = 0;
    this._right = 0;
    this._car = new Car();
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

var Keyboard = function() {
    Controller.call(this);
    console.log("KEYBOARD");
    // this.addListeners.call(this);
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

var Gamepad = function() {
    Controller.call(this);
}
Gamepad.prototype = Object.create(Controller.prototype);
Gamepad.prototype.constructor = Gamepad;





// var Controller = function(method) {
//     var _forward = 0;
//     var _backward = 0;
//     var _left = 0;
//     var _right = 0;
//     var _car;

//     function getForward() {
//         return _forward;
//     }

//     function setForward(val) {
//         _forward = val;
//     }

//     function getBackward() {
//         return _backward;
//     }

//     function setBackward(val) {
//         _backward = val;
//     }

//     function getLeft() {
//         return _left;
//     }

//     function setLeft(val) {
//         _left = val;
//     }

//     function getRight() {
//         return _right;
//     }

//     function setRight(val) {
//         _right = val;
//     }

//     function getCar() {
//         return _car;
//     }

//     function setCar(car) {
//         _car = car;
//     }

//     setCar(new Car());

//     return {
//         getForward: getForward,
//         setForward: setForward,
//         getBackward: getBackward,
//         setBackward: setBackward,
//         getLeft: getLeft,
//         setLeft: setLeft,
//         getRight: getRight,
//         setRight: setRight,
//         getCar: getCar,
//         setCar: setCar
//     }
// };