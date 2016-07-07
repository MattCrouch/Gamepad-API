var Car = function() {
    var _x = 0;
    var _y = 0;
    var _direction = 0;
    var _driveSpeed = 10;
    var _turnSpeed = 0.05;

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
        // if(_direction < (Math.PI / 2)) {
        //     return _direction;
        // } else if(_direction < Math.PI) {
        //     return Math.PI - _direction;
        // } else if(_direction < ((3 * Math.PI) / 2)) {
        //     return _direction - Math.PI;
        // } else {
        //     return (Math.PI * 2) - _direction;
        // }
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

    return {
        getX: getX,
        getY: getY,
        getDirection: getDirection,
        turn: turn,
        go: go,
        checkBounds: checkBounds
    }
};