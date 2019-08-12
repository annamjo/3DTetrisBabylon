/*
 *  Superclass for all game pieces; has movement and rotate functions
 *  TO-DO: Figure out how to import and export
 */
var Piece = /** @class */ (function () {
    //When intance of piece is created, requires name and isActive boolean
    function Piece(name, isActive, offsetW, offsetH, ground) {
        this._rotation = Math.PI / 2; //constant rotation
        this._name = name;
        this._isActive = isActive;
        this._offsetW = offsetW;
        this._offsetH = offsetH;
        this._ground = ground;
        this._shift = 0.5;
        this.pieceData = generateArray(width, height);
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
    //always checks to clear layer
    Piece.prototype.clear = function () {
        var observer = scene.onAfterRenderObservable.add(function () {
            for (var i = 0; i < height; i++) {
                if (checkLayer(i, gridData)) { //is layer full...?
                    console.log("Layer is full");
                    clearLayer(i); //actually clears layer
                    scene.onAfterRenderObservable.remove(observer);
                }
            }
        });
    };
    Piece.prototype.movement = function (block) {
        //TO-DO: Log spot of piece in 3D array
        var _this = this;
        var movement = 1;
        var collided = false;
        var colpt;
        var mesh = block.piece;
        var potMeshX = block.piece.position.x;
        var potMeshY = block.piece.position.y;
        var potMeshZ = block.piece.position.z;
        placeBlock(mesh, this.pieceData); //placing block in grid
        placeObject(mesh, objectData); //placing object in grid
        mergeArrays(gridData, this.pieceData);
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
            if (_this._isActive) {
                //allows for block to keep moving when hitting side planes
                switch (kbInfo.type) { //keyboard infos
                    case BABYLON.KeyboardEventTypes.KEYDOWN: //if key is down, then...
                        switch (kbInfo.event.key) { //is key = to...
                            case "w":
                            case "W":
                                potMeshZ += 1;
                                //if spot is free... (based on the potential mesh spot)
                                if (meshCollisionCheck(potMeshX, potMeshY, potMeshZ, gridData)) {
                                    removeObject(mesh, objectData);
                                    removeBlock(mesh, gridData, _this.pieceData);
                                    mesh.position.z += 1;
                                    placeObject(mesh, objectData);
                                    placeBlock(mesh, _this.pieceData);
                                    mergeArrays(gridData, _this.pieceData);
                                }
                                else {
                                    potMeshZ -= 1;
                                }
                                console.log(gridData);
                                break;
                            case "s":
                            case "S":
                                potMeshZ -= 1;
                                //if spot is free... (based on the potential mesh spot)
                                if (meshCollisionCheck(potMeshX, potMeshY, potMeshZ, gridData)) {
                                    removeObject(mesh, objectData);
                                    removeBlock(mesh, gridData, _this.pieceData);
                                    mesh.position.z -= 1;
                                    placeObject(mesh, objectData);
                                    placeBlock(mesh, _this.pieceData);
                                    mergeArrays(gridData, _this.pieceData);
                                }
                                else {
                                    potMeshZ += 1;
                                }
                                console.log(gridData);
                                break;
                            case "a":
                            case "A":
                                potMeshX -= 1;
                                //if spot is free... (based on the potential mesh spot)
                                if (meshCollisionCheck(potMeshX, potMeshY, potMeshZ, gridData)) {
                                    removeObject(mesh, objectData);
                                    removeBlock(mesh, gridData, _this.pieceData);
                                    mesh.position.x -= 1;
                                    placeObject(mesh, objectData);
                                    placeBlock(mesh, _this.pieceData);
                                    mergeArrays(gridData, _this.pieceData);
                                }
                                else {
                                    potMeshX += 1;
                                }
                                console.log(gridData);
                                break;
                            case "d":
                            case "D":
                                potMeshX += 1;
                                //if spot is free... (based on the potential mesh spot)
                                if (meshCollisionCheck(potMeshX, potMeshY, potMeshZ, gridData)) {
                                    removeObject(mesh, objectData);
                                    removeBlock(mesh, gridData, _this.pieceData);
                                    mesh.position.x += 1;
                                    placeObject(mesh, objectData);
                                    placeBlock(mesh, _this.pieceData);
                                    mergeArrays(gridData, _this.pieceData);
                                }
                                else {
                                    potMeshX -= 1;
                                }
                                console.log(gridData);
                                break;
                            case " ":
                                potMeshY -= 1;
                                //if spot is free... (based on the potential mesh spot)
                                if (meshCollisionCheck(potMeshX, potMeshY, potMeshZ, gridData)) {
                                    removeObject(mesh, objectData);
                                    removeBlock(mesh, gridData, _this.pieceData);
                                    mesh.position.y -= 1;
                                    placeObject(mesh, objectData);
                                    placeBlock(mesh, _this.pieceData);
                                    mergeArrays(gridData, _this.pieceData);
                                }
                                else {
                                    potMeshY += 1;
                                }
                                console.log(gridData);
                                break;
                            /** Set rotations for each unique piece **/
                            case "r":
                            case "R":
                                //implemented in each subclass
                                block.rotate(mesh); //note: does nothing in SmallCube and LargeCube since symmetrical
                                break;
                            case "f":
                            case "F":
                                //implemented in each subclass
                                block.flip(mesh); //note that some classes don't have code with it
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