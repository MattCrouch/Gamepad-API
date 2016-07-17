/**
 * Initialises values for keyboard input
 */
Keyboard.prototype.init = function() {
    this.addListeners();

    //Set default button inputs for movement
    this.setDefaultMappings();
    
    //Create a display to show the player is enabled
    this._playerDisplay = this.addPlayerDisplay("Keyboard");
}

/**
 * Initialises values for controller input
 *
 * @param {Gamepad} gamepad;
 */
Controller.prototype.init = function(gamepad) {
    this._gamepad = gamepad;

    //Set default button inputs for movement
    this.setDefaultMappings();

    //Create a display to show the player is enabled
    this._playerDisplay = this.addPlayerDisplay("Controller");
}

/**
 * Update player movement based on current gamepad values
 */
Controller.prototype.updateMovement = function() {
    var gamepad = this.getGamepad();

    //See if the "left" or "right" values have been set according to mapping
    if(this.getValue("left", true)) {
        this.setLeft(this.getValue("left"));
        this.setRight(0);
    } else if(this.getValue("right", true)) {
        this.setLeft(0);
        this.setRight(this.getValue("right"));
    } else {
        this.setLeft(0);
        this.setRight(0);
    }

    //See if the "forward" or "backward" values have been set according to mapping
    if(this.getValue("forward", true)) {
        this.setForward(this.getValue("forward"));
        this.setBackward(0);
    } else if(this.getValue("backward", true)) {
        this.setForward(0);
        this.setBackward(this.getValue("backward"));
    } else {
        this.setForward(0);
        this.setBackward(0);
    }

    //See if the "boost" button is being pressed
    if(this.getValue("boost", true)) {
        this.enableBoost();
    } else {
        this.disableBoost();
    }
}