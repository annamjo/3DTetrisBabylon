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
var BigCube = /** @class */ (function (_super) {
    __extends(BigCube, _super);
    function BigCube() {
        var _this = _super.call(this, 8) || this;
        _this.create();
        return _this;
    }
    BigCube.prototype.create = function () {
        var mat = new BABYLON.StandardMaterial("mat", scene);
        mat.diffuseColor = new BABYLON.Color3(0.2, 0.28, 1);
        mat.emissiveColor = new BABYLON.Color3(0.2, 0.28, 1); //dark blue
    };
    Object.defineProperty(BigCube.prototype, "positions", {
        get: function () {
            this.setPositions();
            return this.positions;
        },
        enumerable: true,
        configurable: true
    });
    BigCube.prototype.setPositions = function () {
    };
    return BigCube;
}(Block));
//# sourceMappingURL=BigCube.js.map