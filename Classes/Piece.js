/*
 *  Superclass for all game pieces; has movement and rotate functions
 */
var Piece = /** @class */ (function () {
    //When intance of piece is created, requires name and isActive boolean
    function Piece(name, isActive, offset) {
        this._name = name;
        this._isActive = isActive;
        this._offset = offset;
        if (this._offset) {
            this._shift = 0.5;
        }
        else {
            this._shift = 0;
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
    Piece.prototype.movement = function (mesh) {
        var movement = 1;
        var rotation = Math.PI / 2;
        scene.onKeyboardObservable.add(function (kbInfo) {
            switch (kbInfo.type) { //keyboard info
                case BABYLON.KeyboardEventTypes.KEYDOWN: //if key is down
                    switch (kbInfo.event.key) { //is key = to...
                        case "w":
                        case "W":
                            mesh.position.z += movement;
                            break;
                        case "s":
                        case "S":
                            mesh.position.z -= movement;
                            break;
                        case "a":
                        case "A":
                            mesh.position.x -= movement;
                            break;
                        case "d":
                        case "D":
                            mesh.position.x += movement;
                            break;
                        case " ":
                            mesh.position.y -= movement;
                            break;
                        /** Rotations are about world axes as opposed to local axes; will always rotate the same way **/
                        //TO-DO: Rotations make it so that blocks aren't in squares anymore
                        case "r":
                        case "R":
                            //mesh.rotation.z += rotation;    //rotation on z-axis, add Math.PI/2 each time   
                            mesh.rotate(BABYLON.Axis.Z, Math.PI / 2, BABYLON.Space.WORLD);
                            break;
                        case "e":
                        case "E":
                            //mesh.rotation.x += rotation;
                            mesh.rotate(BABYLON.Axis.X, Math.PI / 2, BABYLON.Space.WORLD);
                            break;
                        case "y":
                        case "Y":
                            //mesh.rotation.y += rotation;
                            mesh.rotate(BABYLON.Axis.Y, Math.PI / 2, BABYLON.Space.WORLD);
                            break;
                    }
                    break;
            }
        });
    };
    return Piece;
}());
//# sourceMappingURL=Piece.js.map