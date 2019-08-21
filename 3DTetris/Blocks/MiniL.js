/**
 * Small L-Block, 2 x 2,
 * Drawn with top right corner
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
    function MiniL() {
        var _this = _super.call(this, 3) || this;
        _this.type = "mini l";
        _this.create();
        _this.setCubes();
        return _this;
    }
    MiniL.prototype.create = function () {
        this.parentCube = this.createCube(6.5, -1); //left-most, top
        var mat = new BABYLON.StandardMaterial("mat", scene);
        mat.diffuseColor = new BABYLON.Color3(1, 0.2, 0.3);
        mat.emissiveColor = new BABYLON.Color3(1, 0.2, 0.3); //light red
        this.parentCube.material = mat;
        this.parentCube.material.backFaceCulling = false;
        this._cube2 = this.becomeChild(this._cube2);
        this._cube3 = this.becomeChild(this._cube3);
        this._cube2.parent = this.parentCube;
        this._cube2.position = new BABYLON.Vector3(0, -1, 0); //left-most, bottom
        this._cube3.parent = this.parentCube;
        this._cube3.position = new BABYLON.Vector3(1, 0, 0); //right, top
        // this._cube2 = this.becomeChild(this._cube2);
        // this._cube2.position = new BABYLON.Vector3(0, -1, 0); //left-most, bottom
        // this._cube3 = this.becomeChild(this._cube2);
        // this._cube3.position = new BABYLON.Vector3(1, 0, 0); //right, top
    };
    MiniL.prototype.getPositions = function () {
        this.setPositions();
        return this.positions;
    };
    MiniL.prototype.setPositions = function () {
        this.uncouple();
        this.positions = [this.parentCube.position, this._cube2.position, this._cube3.position];
    };
    MiniL.prototype.setCubes = function () {
        this.cubes = [this._cube2, this._cube3];
    };
    return MiniL;
}(Block));
//# sourceMappingURL=MiniL.js.map