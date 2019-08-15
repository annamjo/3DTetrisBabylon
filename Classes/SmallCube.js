/*
 *  Subclass for 1 by 1 cube
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
var SmallCube = /** @class */ (function (_super) {
    __extends(SmallCube, _super);
    //constructor calls parent class Piece
    function SmallCube(name, isActive, offsetW, offsetH, ground) {
        var _this = _super.call(this, name, isActive, offsetW, offsetH, ground) || this;
        //setting starting positions
        _this._xStartPosition = -0.5;
        _this._yStartPosition = 0.5;
        _this._zStartPosition = 0.5;
        if (offsetW) {
            _this._xStartPosition += _this._shift;
            _this._zStartPosition -= _this._shift;
        }
        if (offsetH) {
            _this._yStartPosition -= _this._shift;
        }
        //properties specific to SmallCube
        _this._size = 1;
        _this._color = "red";
        //creating physical box
        _this._smallCube = BABYLON.MeshBuilder.CreateBox("smallCube", { size: _this._size }, scene);
        //setting starting position based on Piece starting position
        _this._smallCube.position.x = _this._xStartPosition;
        _this._smallCube.position.y = _this._yStartPosition;
        _this._smallCube.position.z = _this._zStartPosition;
        //adding color to box
        _this._smallCubeMaterial = new BABYLON.StandardMaterial('smallCubeMat', scene);
        _this._smallCubeMaterial.diffuseColor = new BABYLON.Color3(1, 0, 0); //r: 1, g: 0, b: 0
        _this._smallCube.material = _this._smallCubeMaterial;
        //accesses global variables of size of grid
        _this.pieceGrid = generateArray(width, height);
        return _this;
    }
    Object.defineProperty(SmallCube.prototype, "piece", {
        //accessor for getting physical box; needed for getting properties
        get: function () {
            return this._smallCube;
        },
        enumerable: true,
        configurable: true
    });
    //changeState function will change the block to active or unactive depending on the state when initiailly called
    SmallCube.prototype.changeState = function () {
        this._isActive = !this._isActive;
        //for debugging and keeping track
        if (this._isActive) {
            console.log("Block is active");
        }
        else {
            console.log("Block is unactive");
        }
    };
    SmallCube.prototype.rotate = function () {
        //Code does nothing; just need to have because Piece movement() calls this function for ALL subclasses
    };
    SmallCube.prototype.unrotate = function () {
        //do nothing
    };
    SmallCube.prototype.flip = function () {
        //Code does nothing; just need to have because Piece movement() calls this function for ALL subclasses
    };
    SmallCube.prototype.rotFlipCollisionCheck = function (xPos, yPos, zPos, grid) {
        //do nothing
    };
    /*** Backend of SmallCube **/
    SmallCube.prototype.placeBlock = function () {
        var xPos = this._smallCube.position.x;
        var yPos = this._smallCube.position.y;
        var zPos = this._smallCube.position.z;
        var xArr = gridToArray("X", xPos);
        var yArr = gridToArray("Y", yPos);
        var zArr = gridToArray("Z", zPos);
        this.pieceData[xArr][yArr][zArr] = true;
    };
    SmallCube.prototype.removeBlock = function () {
        //coordinates of piece on grid (x, y, z)
        var xPos = this._smallCube.position.x;
        var yPos = this._smallCube.position.y;
        var zPos = this._smallCube.position.z;
        //coodinates of piece in array [x][y][z]
        var xArr = gridToArray("X", xPos);
        var yArr = gridToArray("Y", yPos);
        var zArr = gridToArray("Z", zPos);
        gridData[xArr][yArr][zArr] = false;
        this.pieceData[xArr][yArr][zArr] = false;
    };
    SmallCube.prototype.meshCollisionCheck = function (xPos, yPos, zPos, grid, direction) {
        //coodinates of piece in array [x][y][z]
        var xArr = gridToArray("X", xPos);
        var yArr = gridToArray("Y", yPos);
        var zArr = gridToArray("Z", zPos);
        if (grid[xArr][yArr][zArr] === false) { //if spot on grid is empty, return true (mesh can move there)
            return true;
        }
        return false;
    };
    return SmallCube;
}(Piece));
//# sourceMappingURL=SmallCube.js.map