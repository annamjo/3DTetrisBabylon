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
        _this._xStartPosition = -0.5 + _this._shift;
        _this._yStartPosition = 0.5;
        if (offsetH) {
            _this._yStartPosition -= _this._shift;
        }
        _this._zStartPosition = 0.5 - _this._shift;
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
    SmallCube.prototype.rotate = function (mesh) {
        //Code does nothing; just need to have because Piece movement() calls this function for ALL subclasses
    };
    SmallCube.prototype.flip = function (mesh) {
        //Code does nothing; just need to have because Piece movement() calls this function for ALL subclasses
    };
    return SmallCube;
}(Piece));
//# sourceMappingURL=SmallCube.js.map