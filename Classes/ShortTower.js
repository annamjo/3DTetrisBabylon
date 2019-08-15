/*
 *  Subclass for 1 by 3 shorter tower
 *  Starting position is sideways, left to right
 */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var ShortTower = /** @class */ (function (_super) {
    __extends(ShortTower, _super);
    function ShortTower(name, isActive, offsetW, offsetH, ground) {
        var _this = _super.call(this, name, isActive, offsetW, offsetH, ground) || this;
        //setting starting positions
        _this._xStartPosition = 0;
        _this._yStartPosition = 0;
        _this._zStartPosition = 0;
        _this.rotationCounter = 0;
        _this.flipCounter = 0;
        //properties specific to ShortTower
        _this._width = 1;
        _this._height = 3;
        _this._length = 1;
        _this._color = "blue";
        //creating physical short tower
        _this._shortTower = BABYLON.MeshBuilder.CreateBox("shortTower", { width: _this._width, height: _this._height, depth: _this._length }, scene);
        //creating sphere that is center of rotation
        _this._center = BABYLON.MeshBuilder.CreateSphere("sphere", { diameter: 0.1 }, scene);
        _this._center.position = new BABYLON.Vector3(0, 0, 0);
        //SUPER IMPORTANT: attaches block to center
        _this._shortTower.parent = _this._center;
        if (!offsetW) {
            _this._center.position.x += _this._shift;
            _this._center.position.z += _this._shift;
        }
        if (!offsetH) {
            _this._center.position.y += _this._shift;
        }
        _this.mesh = _this._center;
        //setting start position
        _this._shortTower.position.x = _this._xStartPosition;
        _this._shortTower.position.y = _this._yStartPosition;
        _this._shortTower.position.z = _this._zStartPosition;
        //setting color to blue
        _this._shortTowerMaterial = new BABYLON.StandardMaterial('smallCubeMat', scene);
        _this._shortTowerMaterial.diffuseColor = new BABYLON.Color3(0, 0, 1);
        // this._shortTowerMaterial.wireframe = true;   //wireframe for debugging
        _this.mesh.rotation.y = Math.PI / 2;
        _this.mesh.rotation.x = Math.PI / 2;
        _this._shortTower.material = _this._shortTowerMaterial;
        return _this;
    }
    Object.defineProperty(ShortTower.prototype, "piece", {
        get: function () {
            return this._shortTower;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ShortTower.prototype, "center", {
        get: function () {
            return this.mesh;
        },
        enumerable: true,
        configurable: true
    });
    //changeState function will change the block to active or unactive depending on the state when initiailly called
    ShortTower.prototype.changeState = function () {
        this._isActive = !this._isActive;
        //for debugging and keeping track
        if (this._isActive) {
            console.log("Block is active");
        }
        else {
            console.log("Block is unactive");
        }
    };
    ShortTower.prototype.rotate = function () {
        // console.log("Rotation: " + this.rotationCounter); 
        this.rotationCounter += 1; //increment at start because rotationCounter is initialized to 0 (case 0)
        if (this.rotationCounter === 2) { //either 0 or 1
            this.rotationCounter = 0;
        }
        if (this.flipCounter === 0) { //when upright, rotate doesn't change anything
            //only updates if sideways
            this.mesh.rotation.y -= this._rotation;
        }
        // console.log("Rotation amount: " + this.mesh.rotation.y);
    };
    ShortTower.prototype.unrotate = function () {
        this.rotationCounter -= 1; //increment at start because rotationCounter is initialized to 0 (case 0)
        if (this.rotationCounter === -1) { //either 0 or 1
            this.rotationCounter = 1;
        }
        if (this.flipCounter === 0) { //when upright, rotate doesn't change anything
            //only updates if sideways
            this.mesh.rotation.y += this._rotation;
        }
    };
    ShortTower.prototype.flip = function () {
        // console.log("Flip: " + this.flipCounter);
        this.flipCounter += 1;
        if (this.flipCounter === 2) { //either 0 or 1
            this.flipCounter = 0;
        }
        this.mesh.rotation.x -= this._rotation;
    };
    ShortTower.prototype.unflip = function () {
        this.flipCounter -= 1;
        if (this.flipCounter === -1) { //either 0 or 1
            this.flipCounter = 1;
        }
        this.mesh.rotation.x += this._rotation;
    };
    ShortTower.prototype.rotFlipCollisionCheck = function (xPos, yPos, zPos, grid) {
        // console.log("coordinates = x: " + xPos + " y: " + yPos + " z: " + zPos);
        var xArr = gridToArray("X", xPos);
        var yArr = gridToArray("Y", yPos);
        var zArr = gridToArray("Z", zPos);
        // console.log("Attempting to rotate/flip at...");
        // console.log("Indexes = x: " + xArr + " y: " + yArr + " z: " + zArr);
        // console.log("Rotation: " + this.rotationCounter + " Flip: " + this.flipCounter);
        if (this.rotationCounter === 0 && this.flipCounter === 0 &&
            grid[xArr - 1][yArr][zArr] === false &&
            grid[xArr + 1][yArr][zArr] === false) {
            return true;
        }
        if (this.rotationCounter === 1 && this.flipCounter === 0 &&
            grid[xArr][yArr][zArr + 1] === false &&
            grid[xArr][yArr][zArr - 1] === false) {
            return true;
        }
        if (this.flipCounter === 1 && //checking upright position
            grid[xArr][yArr - 1][zArr] === false &&
            grid[xArr][yArr + 1][zArr] === false) {
            return true;
        }
        return false;
    };
    ShortTower.prototype.placeBlock = function () {
        var xPos = this.mesh.position.x;
        var yPos = this.mesh.position.y;
        var zPos = this.mesh.position.z;
        // console.log("Coordinates = x: " + xPos + " y: " + yPos + " z: " + zPos);
        var xArr = gridToArray("X", xPos);
        var yArr = gridToArray("Y", yPos);
        var zArr = gridToArray("Z", zPos);
        // console.log("Placing block at indexes = x: " + xArr + " y: " + yArr + " z: " + zArr);
        // console.log("Rotation: " + this.rotationCounter + " Flip: " + this.flipCounter);
        if (this.rotationCounter === 0 && this.flipCounter === 0) { //block is sideways, left to right
            this.pieceData[xArr][yArr][zArr] = true;
            this.pieceData[xArr - 1][yArr][zArr] = true;
            this.pieceData[xArr + 1][yArr][zArr] = true;
        }
        if (this.rotationCounter === 1 && this.flipCounter === 0) { //block is sideways, forward to backward
            this.pieceData[xArr][yArr][zArr] = true;
            this.pieceData[xArr][yArr][zArr + 1] = true;
            this.pieceData[xArr][yArr][zArr - 1] = true;
        }
        if (this.flipCounter === 1) { //block is upright
            this.pieceData[xArr][yArr][zArr] = true;
            this.pieceData[xArr][yArr - 1][zArr] = true;
            this.pieceData[xArr][yArr + 1][zArr] = true;
        }
    };
    ShortTower.prototype.removeBlock = function () {
        var xPos = this.mesh.position.x;
        var yPos = this.mesh.position.y;
        var zPos = this.mesh.position.z;
        // console.log("Coordinates = x: " + xPos + " y: " + yPos + " z: " + zPos);
        var xArr = gridToArray("X", xPos);
        var yArr = gridToArray("Y", yPos);
        var zArr = gridToArray("Z", zPos);
        // console.log("Removing block at indexes = x: " + xArr + " y: " + yArr + " z: " + zArr);
        if (this.rotationCounter === 0 && this.flipCounter === 0) { //block is sideways, left to right
            this.pieceData[xArr][yArr][zArr] = false;
            this.pieceData[xArr - 1][yArr][zArr] = false;
            this.pieceData[xArr + 1][yArr][zArr] = false;
            gridData[xArr][yArr][zArr] = false;
            gridData[xArr - 1][yArr][zArr] = false;
            gridData[xArr + 1][yArr][zArr] = false;
        }
        if (this.rotationCounter === 1 && this.flipCounter === 0) { //block is sideways, forward to backward
            this.pieceData[xArr][yArr][zArr] = false;
            this.pieceData[xArr][yArr][zArr + 1] = false;
            this.pieceData[xArr][yArr][zArr - 1] = false;
            gridData[xArr][yArr][zArr] = false;
            gridData[xArr][yArr][zArr + 1] = false;
            gridData[xArr][yArr][zArr - 1] = false;
        }
        if (this.flipCounter === 1) { //block is upright
            this.pieceData[xArr][yArr][zArr] = false;
            this.pieceData[xArr][yArr - 1][zArr] = false;
            this.pieceData[xArr][yArr + 1][zArr] = false;
            gridData[xArr][yArr][zArr] = false;
            gridData[xArr][yArr - 1][zArr] = false;
            gridData[xArr][yArr + 1][zArr] = false;
        }
    };
    ShortTower.prototype.meshCollisionCheck = function (xPos, yPos, zPos, grid, direction) {
        var xArr = gridToArray("X", xPos);
        var yArr = gridToArray("Y", yPos);
        var zArr = gridToArray("Z", zPos);
        // console.log("Array Indexes = x: " + xArr + " y: " + yArr + " z: " + zArr);
        var dir = direction.toUpperCase();
        if (this.flipCounter === 0) {
            switch (dir) {
                case "L": //going left, key "A"
                    if (this.rotationCounter === 0) {
                        //xArr is -1 already
                        if (grid[xArr - 1][yArr][zArr] === false) {
                            return true;
                        }
                    }
                    else { //this.rotationCounter === 1
                        //xArr is -1 already
                        if (grid[xArr][yArr][zArr] === false &&
                            grid[xArr][yArr][zArr + 1] === false &&
                            grid[xArr][yArr][zArr - 1] === false) {
                            return true;
                        }
                    }
                    break;
                case "R": //going right, key "D"
                    if (this.rotationCounter === 0) {
                        //xArr is +1 already
                        if (grid[xArr + 1][yArr][zArr] === false) {
                            return true;
                        }
                    }
                    else { //this.rotationCounter === 1
                        //xArr is +1 already
                        if (grid[xArr][yArr][zArr] === false &&
                            grid[xArr][yArr][zArr + 1] === false &&
                            grid[xArr][yArr][zArr - 1] === false) {
                            return true;
                        }
                    }
                    break;
                case "B": //going backwards, key "W"
                    if (this.rotationCounter === 0) {
                        //zArr is +1 already
                        if (grid[xArr][yArr][zArr] === false &&
                            grid[xArr - 1][yArr][zArr] === false &&
                            grid[xArr + 1][yArr][zArr] === false) {
                            return true;
                        }
                    }
                    else { //this.rotationCounter === 1
                        //zArr is +1 already
                        if (grid[xArr][yArr][zArr + 1] === false) {
                            return true;
                        }
                    }
                    break;
                case "F": //going forward, key "S"
                    if (this.rotationCounter === 0) {
                        //zArr is -1 already
                        if (grid[xArr][yArr][zArr] === false &&
                            grid[xArr + 1][yArr][zArr] === false &&
                            grid[xArr - 1][yArr][zArr] === false) {
                            return true;
                        }
                    }
                    else { //this.rotationCounter === 1
                        //zArr is -1 already
                        if (grid[xArr][yArr][zArr - 1] === false) {
                            return true;
                        }
                    }
                    break;
                case " ": //going down, key " "
                    if (this.rotationCounter === 0) {
                        //yArr is +1 already
                        if (grid[xArr][yArr][zArr] === false &&
                            grid[xArr - 1][yArr][zArr] === false &&
                            grid[xArr + 1][yArr][zArr] === false) {
                            return true;
                        }
                    }
                    else { //this.rotationCounter === 1
                        //yArr is +1 already
                        if (grid[xArr][yArr][zArr] === false &&
                            grid[xArr][yArr][zArr + 1] === false &&
                            grid[xArr][yArr][zArr - 1] === false) {
                            return true;
                        }
                    }
                    break;
            } //switch
        }
        else { //this.flipCounter === 1
            switch (dir) {
                case "L": //going left, key "A"
                    //xArr is -1 already
                    if (grid[xArr][yArr][zArr] === false &&
                        grid[xArr][yArr + 1][zArr] === false &&
                        grid[xArr][yArr - 1][zArr] === false) {
                        return true;
                    }
                    break;
                case "R": //going right, key "D"
                    //xArr is +1 already
                    if (grid[xArr][yArr][zArr] === false &&
                        grid[xArr][yArr + 1][zArr] === false &&
                        grid[xArr][yArr - 1][zArr] === false) {
                        return true;
                    }
                    break;
                case "B": //going backwards, key "W"
                    //zArr is +1 already
                    if (grid[xArr][yArr][zArr] === false &&
                        grid[xArr][yArr + 1][zArr] === false &&
                        grid[xArr][yArr - 1][zArr] === false) {
                        return true;
                    }
                    break;
                case "F": //going forward, key "S"
                    //zArr is -1 already
                    if (grid[xArr][yArr][zArr] === false &&
                        grid[xArr][yArr + 1][zArr] === false &&
                        grid[xArr][yArr - 1][zArr] === false) {
                        return true;
                    }
                    break;
                case " ": //going down, key " "
                    //yArr is +1 already
                    if (grid[xArr][yArr + 1][zArr] === false) {
                        return true;
                    }
                    break;
            } //switch
        }
        return false;
    };
    return ShortTower;
}(Piece));
//# sourceMappingURL=ShortTower.js.map