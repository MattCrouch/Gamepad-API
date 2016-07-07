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
        _players.push(new Keyboard());
    }

    _addKeyboard();

    function _drawCar(car) {
        var size = 100;
        _context.fillRect(car.getX() - (size / 2), car.getY() - (size / 2), size, size);
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