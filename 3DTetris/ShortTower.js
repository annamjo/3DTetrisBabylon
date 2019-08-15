/*
* 1 x 3 Short Block
* Starting position: upright, top to bottom
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
    function ShortTower() {
        var _this = _super.call(this, 3) || this;
        _this.create();
        return _this;
    }
    ShortTower.prototype.create = function () {
        this.parentCube = this.createCube();
        this._cube2 = this.createCube();
        var mat = new BABYLON.StandardMaterial("mat", scene);
        mat.diffuseColor = new BABYLON.Color3(0, 1, 1);
        mat.emissiveColor = new BABYLON.Color3(0, 1, 1); //light blue
        this.parentCube.material = mat;
        this.parentCube.material.backFaceCulling = false;
        this._cube3 = this._cube2.createInstance("cube3");
    };
    Object.defineProperty(ShortTower.prototype, "positions", {
        get: function () {
            this.setPositions();
            return this.positions;
        },
        enumerable: true,
        configurable: true
    });
    ShortTower.prototype.setPositions = function () {
    };
    return ShortTower;
}(Block));
//# sourceMappingURL=ShortTower.js.map