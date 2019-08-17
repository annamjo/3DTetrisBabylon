/*
 * Big L-Block, 2 x 3
 * Drawn on horizontal major axis, cube up
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
var BigL = /** @class */ (function (_super) {
    __extends(BigL, _super);
    function BigL() {
        var _this = _super.call(this, 4) || this;
        _this.type = "big l";
        _this.create();
        _this.setCubes();
        return _this;
    }
    BigL.prototype.create = function () {
        this.parentCube = this.createCube(4.5, 0); //middle, bottom cube
        var mat = new BABYLON.StandardMaterial("mat", scene);
        mat.diffuseColor = new BABYLON.Color3(0.4, 0.28, 1);
        mat.emissiveColor = new BABYLON.Color3(1, 0.28, 1); //pink
        this.parentCube.material = mat;
        this.parentCube.material.backFaceCulling = false;
        this._cube2 = this.becomeChild(this._cube2);
        this._cube2.position = new BABYLON.Vector3(-1, 0, 0); //left, bottom
        this._cube3 = this.becomeChild(this._cube3);
        this._cube3.position = new BABYLON.Vector3(-1, 1, 0); //left, top
        this._cube4 = this.becomeChild(this._cube4);
        this._cube4.position = new BABYLON.Vector3(1, 0, 0); //right, bottom
    };
    BigL.prototype.getPositions = function () {
        this.setPositions();
        return this.positions;
    };
    BigL.prototype.setPositions = function () {
        this.uncouple();
        this.positions = [this.parentCube.position, this._cube2.position, this._cube3.position, this._cube4.position];
    };
    BigL.prototype.setCubes = function () {
        this.cubes = [this._cube2, this._cube3, this._cube4];
    };
    return BigL;
}(Block));
//# sourceMappingURL=BigL.js.map