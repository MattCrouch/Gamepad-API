var Car = function(startX, startY) {
    var _x = !isNaN(startX) ? startX : 0;
    var _y = !isNaN(startY) ? startY : 0;
    var _direction = 0;
    var _driveSpeed = 1;
    var _turnSpeed = 0.05;
    var _boost = false;
    var _image;
    var _carType = Math.floor(Math.random() * 5);

    /**
     * Get current X co-ordinate
     *
     * @return {Float} _x;
     */
    function getX() {
        return _x;
    }

    /**
     * Get current Y co-ordinate
     *
     * @return {Float} _y;
     */
    function getY() {
        return _y;
    }

    /**
     * Get current direction in radians
     *
     * @return {Float} _direction;
     */
    function getDirection() {
        return _direction;
    }

    /**
     * Get the image for the car
     *
     * @return {Image} _image;
     */
    function getImage() {
        return _image;
    }

    /**
     * Set whether boost is enabled or disabled
     *
     * @param {Boolean} _boost;
     */
    function setBoost(boost) {
        _boost = boost;
    }

    /**
     * Calculate the X co-ordinate for the next frame
     *
     * @param {Float} angle;
     * @param {Float} amount;
     * @param {Float} nextXPos; 
     */
    function _getNextX(angle, amount) {
        var xPos = amount * Math.sin(angle);

        return _x - xPos;
    }

    /**
     * Calculate the Y co-ordinate for the next frame
     *
     * @param {Float} angle;
     * @param {Float} amount;
     * @param {Float} nextYPos; 
     */
    function _getNextY(angle, amount) {
        var yPos = amount * Math.cos(angle);

        return _y + yPos;
    }

    /**
     * Calculate the angle for the next frame
     *
     * @param {Float} amount; 
     */
    function turn(amount) {
        _direction += amount * _turnSpeed;

        //If the car has turned full circle, then add/remove one full turn from the value
        if(_direction > Math.PI * 2) {
            _direction -= Math.PI * 2;
        } else if(_direction < -(Math.PI * 2)) {
            _direction += Math.PI * 2;
        }
    }

    /**
     * Set the X and Y co-ordinates for the next frame
     * based on current angle and speed
     * and the frame rate
     *
     * @param {Float} delta;
     * @param {Float} amount;
     */
    function go(delta, amount) {
        var angle = getDirection();
        var speed = _driveSpeed;

        //Boost doubles the speed
        if(_boost) {
            speed *= 2;
        }

        //Offset for frame rate
        speed *= delta;
        
        _x = _getNextX(angle, amount * speed);
        _y = _getNextY(angle, amount * speed);
    }

    /**
     * Reposition the car if it will render off-screen
     *
     * @param {Float} width;
     * @param {Float} height;
     */
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

    /**
     * Load the image for the car
     *
     */
    function _loadImage() {
        _image = new Image();
        _image.src = "../assets/cars/car" + _carType + ".svg";
    }

    /**
     * Initialise the car
     */
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