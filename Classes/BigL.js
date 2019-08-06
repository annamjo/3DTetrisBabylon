/*
 *  Subclass of Piece for BigL
 *  Taller versions of MiniL
 *  BigLs are purple
 *  TO-DO: When rotated and odd grid, block is not locked. The y-position is up by +0.5
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
var BigL = /** @class */ (function (_super) {
    __extends(BigL, _super);
    function BigL(name, isActive, offset, ground) {
        var _this = _super.call(this, name, isActive, offset, ground) || this;
        //setting starting position
        //coordinates are set as so: (x, 0, y) --> must set Z later
        _this._startingPosition = [
            new BABYLON.Vector3(0 - _this._shift, 0, 0),
            new BABYLON.Vector3(0 - _this._shift, 0, 3),
            new BABYLON.Vector3(1 - _this._shift, 0, 3),
            new BABYLON.Vector3(1 - _this._shift, 0, 1),
            new BABYLON.Vector3(2 - _this._shift, 0, 1),
            new BABYLON.Vector3(2 - _this._shift, 0, 0) //bottom right corner
        ];
        //properties specific to BigL
        _this._color = "purple";
        _this._depth = 1;
        //creating physical block; note, need sideOridentation for "solid" block
        _this._bigL = BABYLON.MeshBuilder.CreatePolygon("bigL", { shape: _this._startingPosition, depth: _this._depth, updatable: true, sideOrientation: BABYLON.Mesh.DOUBLESIDE }, scene);
        _this._bigL.position.z -= _this._shift;
        //sets L upright
        _this._startingRotation = (3 * Math.PI) / 2;
        _this._bigL.rotation.x = _this._startingRotation;
        //adding color purple to block material
        _this._bigLMaterial = new BABYLON.StandardMaterial("bigLMat", scene);
        _this._bigLMaterial.diffuseColor = new BABYLON.Color3(0.5, 0, 0.5); //r: 0.5, g: 0, b: 0.5
        _this._bigL.material = _this._bigLMaterial;
        return _this;
    }
    Object.defineProperty(BigL.prototype, "piece", {
        //accessor
        get: function () {
            return this._bigL;
        },
        enumerable: true,
        configurable: true
    });
    return BigL;
}(Piece));
//# sourceMappingURL=BigL.js.map