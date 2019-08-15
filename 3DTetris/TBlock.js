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
var TBlock = /** @class */ (function (_super) {
    __extends(TBlock, _super);
    function TBlock() {
        var _this = _super.call(this, 4) || this;
        _this.create();
        return _this;
    }
    TBlock.prototype.create = function () {
        var mat = new BABYLON.StandardMaterial("mat", scene);
        mat.diffuseColor = new BABYLON.Color3(0.7, 0.5, 0);
        mat.emissiveColor = new BABYLON.Color3(0.7, 0.3, 0); //orange
    };
    TBlock.prototype.getPositions = function () {
        this.setPositions();
        return this.positions;
    };
    TBlock.prototype.setPositions = function () {
    };
    return TBlock;
}(Block));
//# sourceMappingURL=TBlock.js.map