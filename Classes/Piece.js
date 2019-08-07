/*
 *  Superclass for all game pieces; has movement and rotate functions
 *  TO-DO: Figure out how to import and export
 */
var Piece = /** @class */ (function () {
    //When intance of piece is created, requires name and isActive boolean
    function Piece(name, isActive, offsetW, offsetH, ground) {
        this._shift = 0; //will store shift needed for differences in odd/even board
        this._rotation = Math.PI / 2; //constant rotation
        this._name = name;
        this._isActive = isActive;
        this._offsetW = offsetW;
        this._offsetH = offsetH;
        this._ground = ground;
        if (this._offsetW || this._offsetH) {
            this._shift = 0.5;
        }
    }
    Object.defineProperty(Piece.prototype, "name", {
        //accessor for name
        get: function () {
            return this._name;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Piece.prototype, "isActive", {
        //accessor for state
        get: function () {
            return this._isActive;
        },
        enumerable: true,
        configurable: true
    });
    //changeState function will change the block to active or unactive depending on the state when initiailly called
    Piece.prototype.changeState = function () {
        this._isActive = !this._isActive;
        //for debugging and keeping track
        if (this._isActive) {
            console.log("Block is active");
        }
        else {
            console.log("Block is unactive");
        }
    };
    Piece.prototype.movement = function (block) {
        //TO-DO: Log spot of piece in 3D array
        var _this = this;
        var movement = 1;
        var collided = false;
        var colpt;
        var mesh = block.piece;
        mesh.checkCollisions = true;
        mesh.computeWorldMatrix(true); //update world matrix before every frame; must have for registerBeforeRender
        /***** Anna's Code for Collisions with Ground and Sides of Gameboard *****/
        scene.registerAfterRender(function () {
            if (mesh.intersectsMesh(_this._ground, true)) { //if box collides with ground, then...
                if (!collided) { //set collided to true AND set colpt to where the piece currently is
                    colpt = mesh.position;
                    collided = true;
                }
            }
        });
        scene.onKeyboardObservable.add(function (kbInfo) {
            if (collided) { //if collided is true (from above code), then...
                mesh.position = colpt; //set position of block to colpt
            }
            else { //allows for block to keep moving when hitting side planes
                switch (kbInfo.type) { //keyboard info
                    case BABYLON.KeyboardEventTypes.KEYDOWN: //if key is down, then...
                        switch (kbInfo.event.key) { //is key = to...
                            case "w":
                            case "W":
                                mesh.moveWithCollisions(new BABYLON.Vector3(0, 0, 1)); //resets moveWithCollisions
                                break;
                            case "s":
                            case "S":
                                mesh.moveWithCollisions(new BABYLON.Vector3(0, 0, -1));
                                break;
                            case "a":
                            case "A":
                                mesh.moveWithCollisions(new BABYLON.Vector3(-1, 0, 0));
                                break;
                            case "d":
                            case "D":
                                mesh.moveWithCollisions(new BABYLON.Vector3(1, 0, 0));
                                break;
                            case " ":
                                mesh.position.y -= movement;
                                break;
                            /** Set rotations for each unique piece **/
                            case "r":
                            case "R":
                                //implemented in each subclass
                                block.rotate(mesh); //note: does nothing in SmallCube since symmetrical
                                break;
                        }
                        break;
                }
            }
        });
    };
    return Piece;
}());
//# sourceMappingURL=Piece.js.map