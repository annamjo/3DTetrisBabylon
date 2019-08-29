/**
 * 1 x 1 Cube Block
 * drawn at height y = 5.5
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
var Cube = /** @class */ (function (_super) {
    __extends(Cube, _super);
    function Cube(scene) {
        var _this = _super.call(this, 1, scene) || this;
        _this.type = "cube";
        _this.create();
        return _this;
    }
    Cube.prototype.create = function () {
        this.parentCube = this.createCube(5.5, 0);
        var mat = new BABYLON.StandardMaterial("mat", this.scene);
        mat.diffuseColor = new BABYLON.Color3(0.6, 0.6, 0);
        mat.emissiveColor = BABYLON.Color3.Yellow();
        this.parentCube.material = mat;
        this.parentCube.material.backFaceCulling = false;
    };
    //retrieve positions at a given time - whenever updateSpaces in Game is called
    Cube.prototype.getPositions = function () {
        this.setPositions();
        return this.positions;
    };
    Cube.prototype.setPositions = function () {
        this.positions = [this.parentCube.position];
    };
    return Cube;
}(Block));
//# sourceMappingURL=Cube.js.map