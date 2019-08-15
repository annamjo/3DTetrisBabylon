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
var Cube = /** @class */ (function (_super) {
    __extends(Cube, _super);
    function Cube() {
        var _this = _super.call(this, 1) || this;
        _this.create();
        return _this;
    }
    Cube.prototype.create = function () {
        this._cube1 = this.createCube(5.5);
        var mat = new BABYLON.StandardMaterial("mat", scene);
        mat.diffuseColor = new BABYLON.Color3(0.6, 0.6, 0);
        mat.emissiveColor = BABYLON.Color3.Yellow();
        this._cube1.material = mat;
        this._cube1.material.backFaceCulling = false;
    };
    Object.defineProperty(Cube.prototype, "position", {
        get: function () {
            return this._cube1.position; //for other blocks, return parent's pos
        },
        enumerable: true,
        configurable: true
    });
    Cube.prototype.getPositions = function () {
        this.setPositions();
        return this.positions;
    };
    Cube.prototype.setPositions = function () {
        this.positions[0] = this._cube1.position;
    };
    return Cube;
}(Block));
//# sourceMappingURL=Cube.js.map