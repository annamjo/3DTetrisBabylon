/*
 *  Subclass for mini "L"
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
var MiniL = /** @class */ (function (_super) {
    __extends(MiniL, _super);
    function MiniL(name, isActive) {
        var _this = _super.call(this, name, isActive) || this;
        //setting starting positions
        _this._startingPosition = [
            new BABYLON.Vector3(0, 0, 0),
            new BABYLON.Vector3(0, 0, 2),
            new BABYLON.Vector3(1, 0, 2),
            new BABYLON.Vector3(1, 0, 1),
            new BABYLON.Vector3(2, 0, 1),
            new BABYLON.Vector3(2, 0, 0) //bottom right corner
        ];
        //properties specific to MiniL
        _this._color = "green";
        _this._depth = 1;
        //creating physical piece, MiniL
        //need BABYLON.Mesh.DOUBLESIDE to have solid block
        _this._miniL = BABYLON.MeshBuilder.CreatePolygon("miniL", { shape: _this._startingPosition, depth: _this._depth, updatable: true, sideOrientation: BABYLON.Mesh.DOUBLESIDE }, scene);
        //adding green to material of box
        _this._miniLMaterial = new BABYLON.StandardMaterial("miniLMat", scene);
        _this._miniLMaterial.diffuseColor = new BABYLON.Color3(0, 1, 0); //r: 0, g: 1, b: 0
        _this._miniL.material = _this._miniLMaterial;
        return _this;
    }
    Object.defineProperty(MiniL.prototype, "piece", {
        get: function () {
            return this._miniL;
        },
        enumerable: true,
        configurable: true
    });
    return MiniL;
}(Piece));
//# sourceMappingURL=MiniL.js.map