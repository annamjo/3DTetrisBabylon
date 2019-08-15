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
        this.pieceData = generateArrayCollisions(width, height);
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
        if (block.center) {
            var mesh = block.center;
        }
        else {
            var mesh = block.piece;
        }
        var potMeshX = mesh.position.x;
        var potMeshY = mesh.position.y;
        var potMeshZ = mesh.position.z;
        block.placeBlock();
        // block.placeObject(objectData);
        mergeArrays(gridData, this.pieceData);
        console.log("Grid at start: ");
        console.log(gridData);
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
                                //code in Piece class that I was referring too
                                potMeshZ += 1;
                                //if spot is free... (based on the potential mesh spot)
                                if (block.meshCollisionCheck(potMeshX, potMeshY, potMeshZ, gridData, "B")) {
                                    // block.removeObject(objectData);
                                    block.removeBlock();
                                    mesh.position.z += 1;
                                    // block.placeObject(objectData);
                                    block.placeBlock();
                                    mergeArrays(gridData, _this.pieceData);
                                }
                                else {
                                    potMeshZ -= 1;
                                }
                                console.log(gridData);
                                break;
                            case "s":
                            case "S":
                                //code in Piece class that I was referring too
                                potMeshZ -= 1;
                                //if spot is free... (based on the potential mesh spot)
                                if (block.meshCollisionCheck(potMeshX, potMeshY, potMeshZ, gridData, "F")) {
                                    // block.removeObject(objectData);
                                    block.removeBlock();
                                    mesh.position.z -= 1;
                                    // block.placeObject(objectData);
                                    block.placeBlock();
                                    mergeArrays(gridData, _this.pieceData);
                                }
                                else {
                                    potMeshZ += 1;
                                }
                                console.log(gridData);
                                break;
                            case "a":
                            case "A":
                                //code in Piece class that I was referring too
                                potMeshX -= 1;
                                //if spot is free... (based on the potential mesh spot)
                                if (block.meshCollisionCheck(potMeshX, potMeshY, potMeshZ, gridData, "L")) {
                                    // block.removeObject(objectData);
                                    block.removeBlock();
                                    mesh.position.x -= 1;
                                    // block.placeObject(objectData);
                                    block.placeBlock();
                                    mergeArrays(gridData, _this.pieceData);
                                }
                                else {
                                    potMeshX += 1;
                                }
                                console.log(gridData);
                                break;
                            case "d":
                            case "D":
                                //code in Piece class that I was referring to
                                potMeshX += 1;
                                //if spot is free... (based on the potential mesh spot)
                                if (block.meshCollisionCheck(potMeshX, potMeshY, potMeshZ, gridData, "R")) {
                                    // block.removeObject(objectData);
                                    block.removeBlock();
                                    mesh.position.x += 1;
                                    // block.placeObject(objectData);
                                    block.placeBlock();
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
                                if (block.meshCollisionCheck(potMeshX, potMeshY, potMeshZ, gridData, " ")) {
                                    // block.removeObject(objectData);
                                    block.removeBlock();
                                    mesh.position.y -= 1;
                                    // block.placeObject(objectData);
                                    block.placeBlock();
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
                                block.rotate(mesh);
                                if (block.rotFlipCollisionCheck(potMeshX, potMeshY, potMeshZ, gridData)) {
                                    block.unrotate(mesh);
                                    // block.removeObject(objectData);
                                    block.removeBlock();
                                    block.rotate(mesh);
                                    // block.placeObject(objectData);
                                    block.placeBlock();
                                    mergeArrays(gridData, _this.pieceData);
                                }
                                else {
                                    block.unrotate(mesh);
                                    // block.placeObject(objectData);
                                    block.placeBlock();
                                }
                                console.log(gridData);
                                break;
                            case "f":
                            case "F":
                                //implemented in each subclass
                                block.flip(mesh);
                                if (block.rotFlipCollisionCheck(potMeshX, potMeshY, potMeshZ, gridData)) {
                                    block.unflip(mesh);
                                    // block.removeObject(objectData);
                                    block.removeBlock();
                                    block.flip(mesh);
                                    // block.placeObject(objectData);
                                    block.placeBlock();
                                    mergeArrays(gridData, _this.pieceData);
                                }
                                else {
                                    block.unflip(mesh);
                                    // block.placeObject(objectData);
                                    block.placeBlock();
                                }
                                console.log(gridData);
                                break;
                            case "g":
                            case "G":
                                block.unflip(mesh);
                                if (block.rotFlipCollisionCheck(potMeshX, potMeshY, potMeshZ, gridData)) {
                                    block.flip(mesh);
                                    // block.removeObject(objectData);
                                    block.removeBlock();
                                    block.unflip(mesh);
                                    // block.placeObject(objectData);
                                    block.placeBlock();
                                    mergeArrays(gridData, _this.pieceData);
                                }
                                else {
                                    block.flip(mesh);
                                }
                                console.log(gridData);
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