var Game = (function(canvas) {
    var _canvas = canvas;
    var _context = _canvas.getContext("2d");
    var _lastUpdate;
    var _players = [];

    /**
     * Initialise the game
     */
    function _init() {
        _addListeners();
        _onResize();

        _checkGamepadSupport();
        _addKeyboard();

        _loop();
    }

    /**
     * Add listeners to control Gamepad interaction
     */
    function _addListeners() {
        window.addEventListener("resize", _onResize);
        window.addEventListener("gamepadconnected", _onGamepadConnected);
        window.addEventListener("gamepaddisconnected", _onGamepadDisconnected);
    }

    /**
     * Adjusts the canvas height and width on window resize
     *
     * @param {Event} e
     */
    function _onResize(e) {
        _canvas.width = window.innerWidth;
        _canvas.height = window.innerHeight;
    }

    /**
     * Adds a controller when a gamepad is connected
     *
     * @param {Event} e
     */
    function _onGamepadConnected(e) {
        _addController(e.gamepad);
    }

    /**
     * Removes a controller when a gamepad is connected
     *
     * @param {Event} e
     */
    function _onGamepadDisconnected(e) {
        _removeController(e.gamepad);
    }

    /**
     * Enables keyboard interaction
     *
     * @return {Keyboard} keyboard;
     */
    function _addKeyboard() {
        var keyboard = new Keyboard(_canvas.width / 2, _canvas.height / 2);
        _players.push(keyboard);

        return keyboard;
    }

    /**
     * Enables controller interaction
     *
     * @param {Gamepad} gamepad;
     * @return {Controller} controller;
     */
    function _addController(gamepad) {
        var controller = new Controller(gamepad, _canvas.width / 2, _canvas.height / 2);
        _players.push(controller);

        return controller;
    }

    /**
     * Removes a controller
     *
     * @param {Gamepad} gamepad;
     * @return {Keyboard} keyboard;
     */
    function _removeController(gamepad) {
        var player = _findController(gamepad.index);

        if(player) {
            player.removePlayerDisplay();
            var index = _players.indexOf(player);
            
            _players.splice(index, 1);
        }
    }

    /**
     * Displays a warning if the browser does not support the Gamepad API
     *
     * @return {Boolean} supports;
     */
    function _checkGamepadSupport() {
        var supports = false;

        if(navigator.getGamepads) {
            supports = true;
        }

        if(!supports) {
            var heading = document.getElementById("heading");
            var warning = document.createElement("h4");
            warning.className = "warning";
            warning.innerText = "Your browser does not support the Gamepad API";

            heading.appendChild(warning);
        }

        console.log(supports);

        return supports;
    }

    /**
     * Renders a car on the canvas
     *
     * @param {Car} car;
     */
    function _drawCar(car) {
        //Saves the current canvas context to return to normal later
        _context.save();

        //Adjust the canvas to display the position/orientation of the car 
        _context.translate(car.getX(), car.getY());
        _context.rotate(car.getDirection());

        //Render the car itself if it has loaded
        if(car.getImage().complete) {
            var length = 150;
            var width = car.getImage().width / (car.getImage().height / length);
            _context.drawImage(car.getImage(), -(width / 2), -(length / 2), width, length);
        }
        
        //Restore the default position/orientation of the canvas context
        _context.restore();
    }

    /**
     * Finds a Controller object based on a Gamepad id
     *
     * @param {Integer} id;
     * @return {Controller} controller;
     */
    function _findController(id) {
        for(var i = 0; i < _players.length; i++) {
            if(_players[i].getId() === id) {
                return _players[i];
            }
        }

        return undefined;
    }

    /**
     * Cleans the canvas
     */
    function _clearCanvas() {
        _context.clearRect(0, 0, _canvas.width, _canvas.height);
    }

    /**
     * Computes each frame
     */
    function _loop() {
        //Compute the frame rate
        var delta = 0;
        if(_lastUpdate !== undefined) {
            delta = window.performance.now() - _lastUpdate;
        }
        _lastUpdate = window.performance.now();

        //Loop through each gamepad and update it's inputs
        if(navigator.getGamepads) {
            var gamepads = navigator.getGamepads();
            
            for(var i = 0; i < gamepads.length; i++) {
                if(gamepads[i] !== undefined) {
                    var player = _findController(gamepads[i].index);
                    if(!player) {
                        player = _addController(gamepads[i]);
                    }
                    if(player) {
                        //Update the Gamepad object for Edge
                        player.setGamepad(gamepads[i]);
                        
                        //Update player movements based on current state
                        player.updateMovement();
                    }
                }
            }
        }

        _clearCanvas();
        _update(delta);
        requestAnimationFrame(_loop);
    }

    /**
     * Updates each frame
     *
     * @param {Float} delta;
     */
    function _update(delta) {
        for(var i = 0; i < _players.length; i++) {
            _players[i].moveCar(delta);
            _players[i].getCar().checkBounds(_canvas.width, _canvas.height);
            _drawCar(_players[i].getCar());
        }
    }

    _init();
})(document.getElementById("game"));