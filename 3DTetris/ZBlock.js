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
var ZBlock = /** @class */ (function (_super) {
    __extends(ZBlock, _super);
    function ZBlock() {
        var _this = _super.call(this, 4) || this;
        _this.create();
        return _this;
    }
    ZBlock.prototype.create = function () {
        var mat = new BABYLON.StandardMaterial("mat", scene);
        mat.diffuseColor = BABYLON.Color3.Purple();
        mat.emissiveColor = new BABYLON.Color3(0.4, 0.28, 0.8); //purple
    };
    Object.defineProperty(ZBlock.prototype, "positions", {
        get: function () {
            this.setPositions();
            return this.positions;
        },
        enumerable: true,
        configurable: true
    });
    ZBlock.prototype.setPositions = function () {
    };
    return ZBlock;
}(Block));
//# sourceMappingURL=ZBlock.js.map