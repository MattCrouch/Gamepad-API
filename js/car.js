var Car = function(startX, startY) {
    var _x = Number.isInteger(startX) ? startX : 0;
    var _y = Number.isInteger(startY) ? startY : 0;
    var _direction = 0;
    var _driveSpeed = 10;
    var _turnSpeed = 0.05;
    var _image;

    function getX() {
        return _x;
    }

    function getY() {
        return _y;
    }

    function getDirection() {
        return _direction;
    }

    function _getAngle() {
        return _direction;
    }

    function getImage() {
        return _image;
    }

    function _getNextX(angle, amount) {
        var xPos = amount * Math.sin(angle);

        return _x + xPos;
    }

    function _getNextY(angle, amount) {
        var yPos = amount * Math.cos(angle);

        return _y + yPos;
    }

    function turn(amount) {
        _direction += amount * _turnSpeed;

        if(_direction > Math.PI * 2) {
            _direction -= Math.PI * 2;
        } else if(_direction < -(Math.PI * 2)) {
            _direction += Math.PI * 2;
        }
    }

    function go(amount) {
        var angle = _getAngle();
        _x = _getNextX(angle, amount * _driveSpeed);
        _y = _getNextY(angle, amount * _driveSpeed);
    }

    function checkBounds(width, height) {
        if(_x < 0) {
            _x = width;
        } else if(_x > width) {
            _x = 0;
        }

        if(_y < 0) {
            _y = height;
        } else if(_y > height) {
            _y = 0;
        }
    }

    function _loadImage() {
        _image = new Image();
        _image.src = "../assets/car.svg";
    }

    function init() {
        _loadImage();
    }

    init();

    return {
        getX: getX,
        getY: getY,
        getDirection: getDirection,
        turn: turn,
        go: go,
        checkBounds: checkBounds,
        getImage: getImage
    }
};