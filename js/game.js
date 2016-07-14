var Game = (function(canvas) {
    var _canvas = canvas;
    var _context = _canvas.getContext("2d");
    var _lastUpdate;
    var _players = [];

    function _init() {
        _addListeners();
        _onResize();
    }

    function _addListeners() {
        window.addEventListener("resize", _onResize);
        window.addEventListener("gamepadconnected", _onGamepadConnected);
        window.addEventListener("gamepaddisconnected", _onGamepadDisconnected);
    }

    function _onResize() {
        _canvas.width = window.innerWidth;
        _canvas.height = window.innerHeight;
    }

    function _onGamepadConnected(e) {
        console.log("connected", e);
        _addGamepad(e.gamepad);
    }

    function _onGamepadDisconnected(e) {
        console.log("disconnected", e);
        _removeGamepad(e.gamepad);
    }

    function _addKeyboard() {
        console.log("Keyboard added");
        _players.push(new Keyboard(_canvas.width / 2, _canvas.height / 2));
    }

    function _addGamepad(gamepad) {
        console.log("Gamepad added");
        var controller = new Gamepad(gamepad, _canvas.width / 2, _canvas.height / 2);
        _players.push(controller);

        return controller;
    }

    function _removeGamepad(gamepad) {
        var player = _findGamepad(gamepad.id);

        if(player) {
            var index = _players.indexOf(player);

            _players.splice(index, 1);
        }
    }

    _addKeyboard();

    function _drawCar(car) {
        _context.save();
        _context.translate(car.getX(), car.getY());
        _context.rotate(-car.getDirection());
        if(car.getImage().complete) {
            var length = 150;
            var width = car.getImage().width / (car.getImage().height / length);
            _context.drawImage(car.getImage(), -(width / 2), -(length / 2), width, length);
        }
        _context.restore();
    }

    function _findGamepad(id) {
        for(var i = 0; i < _players.length; i++) {
            if(_players[i].getId() === id) {
                return _players[i];
            }
        }

        return undefined;
    }

    function _clearCanvas() {
        _context.clearRect(0, 0, _canvas.width, _canvas.height);
    }

    function _loop() {
        var delta = 0;
        if(_lastUpdate !== undefined) {
            delta = window.performance.now() - _lastUpdate;
        }
        _lastUpdate = window.performance.now();

        var gamepads = navigator.getGamepads();
        for(var i = 0; i < gamepads.length; i++) {
            if(gamepads[i] !== undefined) {
                var player = _findGamepad(gamepads[i].id);
                if(!player) {
                    player = _addGamepad(gamepads[i]);
                }
                player.updateMovement();
            }
        }

        _clearCanvas();
        _update(delta);
        requestAnimationFrame(_loop);
    }

    function _update(delta) {
        for(var i = 0; i < _players.length; i++) {
            _players[i].moveCar();
            // _players[i].getCar().turn(Math.random() * (Math.PI * 2));
            // _players[i].getCar().go(Math.random() * 10);
            _players[i].getCar().checkBounds(_canvas.width, _canvas.height);
            _drawCar(_players[i].getCar());
        }
    }

    _init();
    _loop();
})(document.getElementById("game"));