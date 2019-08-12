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
        _this._yStartPosition = 1;
        _this._zStartPosition = 0;
        if (offsetH) {
            _this._yStartPosition += _this._shift;
        }
        if (offsetW) {
            _this._xStartPosition += _this._shift;
            _this._zStartPosition += _this._shift;
        }
        //properties specific to LargeCube
        _this._size = 2;
        _this._color = "green";
        //creating physical box
        _this._largeCube = BABYLON.MeshBuilder.CreateBox("largeCube", { size: 2 });
        //setting start position
        _this._largeCube.position.x = _this._xStartPosition;
        _this._largeCube.position.y = _this._yStartPosition;
        _this._largeCube.position.z = _this._zStartPosition;
        console.log("setting position");
        //adding color
        _this._largeCubeMaterial = new BABYLON.StandardMaterial("largeCubeMat", scene);
        _this._largeCubeMaterial.diffuseColor = new BABYLON.Color3(0, 1, 0);
        _this._largeCube.material = _this._largeCubeMaterial;
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
    LargeCube.prototype.rotate = function (mesh) {
        //do nothing because symmetrical
    };
    LargeCube.prototype.flip = function (mesh) {
        //do nothing because symmetrical
    };
    return LargeCube;
}(Piece));
//# sourceMappingURL=LargeCube.js.map