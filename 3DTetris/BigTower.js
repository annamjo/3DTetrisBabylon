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
var BigTower = /** @class */ (function (_super) {
    __extends(BigTower, _super);
    function BigTower() {
        var _this = _super.call(this, 4) || this;
        _this.create();
        return _this;
    }
    BigTower.prototype.create = function () {
        var mat = new BABYLON.StandardMaterial("mat", scene);
        mat.diffuseColor = new BABYLON.Color3(0, 0.5, 0.5);
        mat.emissiveColor = new BABYLON.Color3(0.5, 1, 0.2); //green
    };
    Object.defineProperty(BigTower.prototype, "positions", {
        get: function () {
            this.setPositions();
            return this.positions;
        },
        enumerable: true,
        configurable: true
    });
    BigTower.prototype.setPositions = function () {
    };
    return BigTower;
}(Block));
//# sourceMappingURL=BigTower.js.map