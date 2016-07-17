var Car = function(startX, startY) {
    var _x = !isNaN(startX) ? startX : 0;
    var _y = !isNaN(startY) ? startY : 0;
    var _direction = 0;
    var _driveSpeed = 1;
    var _turnSpeed = 0.05;
    var _boost = false;
    var _image;
    var _carType = Math.floor(Math.random() * 5);

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

    function setBoost(boost) {
        _boost = boost;
    }

    function _getNextX(angle, amount) {
        var xPos = amount * Math.sin(angle);

        return _x - xPos;
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

        // console.log(_direction);
    }

    function go(delta, amount) {
        var angle = _getAngle();
        var speed = _driveSpeed;
        if(_boost) {
            speed *= 2;
        }
        speed *= delta;
        _x = _getNextX(angle, amount * speed);
        _y = _getNextY(angle, amount * speed);
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
        _image.src = "../assets/cars/car" + _carType + ".svg";
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
        getImage: getImage,
        setBoost: setBoost
    }
};