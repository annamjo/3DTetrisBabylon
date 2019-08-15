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
    function BigL() {
        var _this = _super.call(this, 4) || this;
        _this.create();
        return _this;
    }
    BigL.prototype.create = function () {
        var mat = new BABYLON.StandardMaterial("mat", scene);
        mat.diffuseColor = new BABYLON.Color3(0.4, 0.28, 1);
        mat.emissiveColor = new BABYLON.Color3(1, 0.28, 1); //pink
    };
    Object.defineProperty(BigL.prototype, "positions", {
        get: function () {
            this.setPositions();
            return this.positions;
        },
        enumerable: true,
        configurable: true
    });
    BigL.prototype.setPositions = function () {
    };
    return BigL;
}(Block));
//# sourceMappingURL=BigL.js.map