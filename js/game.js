var Game = (function() {
    var _canvas = document.getElementById("game");
    var _context = _canvas.getContext("2d");
    var _lastUpdate;
    var _players = [];

    window.addEventListener("resize", _onResize);

    function _onResize() {
        _canvas.width = window.innerWidth;
        _canvas.height = window.innerHeight;
    }

    _onResize();

    function _addKeyboard() {
        console.log("Keyboard added");
        _players.push(new Keyboard(_canvas.width / 2, _canvas.height / 2));
    }

    function _addGamepad(id) {
        console.log("Gamepad added");
        var gamepad = new Gamepad(id, _canvas.width / 2, _canvas.height / 2);
        _players.push(gamepad);

        return gamepad;
    }

    _addKeyboard();

    function _drawCar(car) {
        _context.save();
        _context.translate(car.getX(), car.getY());
        _context.rotate(-car.getDirection());
        var length = 150;
        var width = car.getImage().width / (car.getImage().height / length);
        if(car.getImage().complete) {
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
                    player = _addGamepad(gamepads[i].id);
                }
                player.updateMovement(gamepads[i]);
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

    _loop();

    return {
        
    }
})();