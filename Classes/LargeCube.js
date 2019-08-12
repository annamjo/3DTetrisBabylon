/*
 *  Subclass for large, 2 by 2 cube
 *  Block can move halfway into the wall
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
var LargeCube = /** @class */ (function (_super) {
    __extends(LargeCube, _super);
    //constructor calls Parent class Piece
    function LargeCube(name, isActive, offsetW, offsetH, ground) {
        var _this = _super.call(this, name, isActive, offsetW, offsetH, ground) || this;
        _this._xStartPosition = 0;
        _this._yStartPosition = 2;
        _this._zStartPosition = 0;
        if (offsetH) {
            _this._yStartPosition -= _this._shift;
        }
        if (offsetW) {
            _this._xStartPosition -= _this._shift;
            _this._zStartPosition -= _this._shift;
        }
        //properties specific to LargeCube
        _this._size = 2;
        _this._color = "green";
        //X0Y
        _this._startingPosition = [
            new BABYLON.Vector3(0, 0, 0),
            new BABYLON.Vector3(0, 0, 2),
            new BABYLON.Vector3(2, 0, 2),
            new BABYLON.Vector3(2, 0, 0) //bottom right corner
        ];
        _this._depth = 2;
        //creating physical box
        _this._largeCube = BABYLON.MeshBuilder.CreatePolygon("largeCube", {
            shape: _this._startingPosition,
            depth: _this._depth,
            updatable: true,
            sideOrientation: BABYLON.Mesh.DOUBLESIDE
        }, scene);
        //setting start position
        _this._largeCube.position.x = _this._xStartPosition;
        _this._largeCube.position.y = _this._yStartPosition;
        _this._largeCube.position.z = _this._zStartPosition;
        //adding color
        _this._largeCubeMaterial = new BABYLON.StandardMaterial("largeCubeMat", scene);
        _this._largeCubeMaterial.diffuseColor = new BABYLON.Color3(0, 1, 0);
        _this._largeCube.material = _this._largeCubeMaterial;
        _this._largeCubeData = generateArray(width, height);
        return _this;
    }
    Object.defineProperty(LargeCube.prototype, "piece", {
        //accessor for getting physical box; needed for getting properties
        get: function () {
            return this._largeCube;
        },
        enumerable: true,
        configurable: true
    });
    LargeCube.prototype.placeBlock = function () {
        //coordinates of piece on grid (x, y, z)
        var xPos = this._largeCube.position.x;
        var yPos = this._largeCube.position.y;
        var zPos = this._largeCube.position.z;
        ;
        if (offsetW) {
            xPos += 0.5;
            zPos += 0.5;
        }
        if (offsetH) {
            yPos -= 0.5;
        }
        console.log("Original coordinates = x: " + xPos + " y: " + yPos + " z: " + zPos);
        var xArr = gridToArray("X", xPos);
        var yArr = gridToArray("Y", yPos);
        var zArr = gridToArray("Z", zPos);
        console.log("Index of Array = x: " + xArr + " y: " + yArr + " z: " + zArr);
        //sets spot in array (top right corner of block) to true
        this._largeCubeData[xArr][yArr][zArr] = true; //front top left
        this._largeCubeData[xArr + 1][yArr][zArr] = true; //front top right
        this._largeCubeData[xArr][yArr + 1][zArr] = true; //front bottom left
        this._largeCubeData[xArr + 1][yArr + 1][zArr] = true; //front bottom right
        this._largeCubeData[xArr][yArr][zArr + 1] = true; //back top left
        this._largeCubeData[xArr + 1][yArr][zArr + 1] = true; //back top right
        this._largeCubeData[xArr][yArr + 1][zArr + 1] = true; //back bottom left
        this._largeCubeData[xArr + 1][yArr + 1][zArr + 1] = true; //back bottom right
        console.log(this._largeCubeData);
    };
    LargeCube.prototype.mergeArrays = function () {
        for (var i = 0; i < gridData.length; i++) { //loop for x
            for (var j = 0; j < gridData[i].length; j++) { //loop for y
                for (var k = 0; k < gridData[i][j].length; k++) { //loop for z
                    //if spot on grid is empty but spot on piece is occupied (block is there)...
                    if (gridData[i][j][k] === false && this._largeCubeData[i][j][k] === true) {
                        gridData[i][j][k] = true; //set grid spot to true
                    }
                }
            }
        }
    };
    LargeCube.prototype.meshCollisionCheck = function (xPos, yPos, zPos, grid) {
        //coodinates of piece in array [x][y][z]
        var xArr = gridToArray("X", xPos);
        var yArr = gridToArray("Y", yPos);
        var zArr = gridToArray("Z", zPos);
        if (grid[xArr][yArr][zArr] === false) { //if spot on grid is empty, return true (mesh can move there)
            return true;
        }
        return false;
    };
    LargeCube.prototype.rotate = function (mesh) {
        //do nothing because symmetrical
    };
    LargeCube.prototype.flip = function (mesh) {
        //do nothing because symmetrical
    };
    return LargeCube;
}(Piece));
//# sourceMappingURL=LargeCube.js.map