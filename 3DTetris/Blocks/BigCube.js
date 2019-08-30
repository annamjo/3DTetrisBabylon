/**
 * 2 x 2 Big Cube
 * drawn offset to the left, y = 5.5
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
var bigcube = /** @class */ (function (_super) {
    __extends(bigcube, _super);
    function bigcube(scene) {
        var _this = _super.call(this, 8, scene) || this;
        _this.type = "big cube";
        _this.create();
        _this.setCubes();
        return _this;
    }
    bigcube.prototype.create = function () {
        this.parentCube = this.createCube(5.5, -1); //offset position - parent: bottom,left,front cube
        var mat = new BABYLON.StandardMaterial("mat", this.scene);
        mat.diffuseColor = new BABYLON.Color3(0.2, 0.28, 1);
        mat.emissiveColor = new BABYLON.Color3(0.2, 0.28, 1); //dark blue
        this.parentCube.material = mat;
        this.parentCube.material.backFaceCulling = false;
        this._cube2 = this.becomeChild(this._cube2);
        this._cube3 = this.becomeChild(this._cube3);
        this._cube4 = this.becomeChild(this._cube4);
        this._cube5 = this.becomeChild(this._cube5);
        this._cube6 = this.becomeChild(this._cube6);
        this._cube7 = this.becomeChild(this._cube7);
        this._cube8 = this.becomeChild(this._cube8);
        this._cube2.parent = this.parentCube;
        this._cube2.position = new BABYLON.Vector3(0, 0, 1); //bottom,left,back
        this._cube3.parent = this.parentCube;
        this._cube3.position = new BABYLON.Vector3(1, 0, 1); //bottom,right,back
        this._cube4.parent = this.parentCube;
        this._cube4.position = new BABYLON.Vector3(1, 0, 0); //bottom,right,front
        this._cube5.parent = this.parentCube;
        this._cube5.position = new BABYLON.Vector3(0, 1, 0); //top,left,front
        this._cube6.parent = this.parentCube;
        this._cube6.position = new BABYLON.Vector3(0, 1, 1); //top,left,back
        this._cube7.parent = this.parentCube;
        this._cube7.position = new BABYLON.Vector3(1, 1, 1); //top,right,back
        this._cube8.parent = this.parentCube;
        this._cube8.position = new BABYLON.Vector3(1, 1, 0); //top,right,front
    };
    bigcube.prototype.getPositions = function () {
        return [this.parentCube.position, this._cube2.getAbsolutePosition(), this._cube3.getAbsolutePosition(), this._cube4.getAbsolutePosition(),
            this._cube5.getAbsolutePosition(), this._cube6.getAbsolutePosition(), this._cube7.getAbsolutePosition(), this._cube8.getAbsolutePosition()];
    };
    bigcube.prototype.getRelPos = function () {
        this.setPositions();
        return this.positions;
    };
    bigcube.prototype.setPositions = function () {
        this.positions = [this.parentCube.position, this._cube2.position, this._cube3.position, this._cube4.position,
            this._cube5.position, this._cube6.position, this._cube7.position, this._cube8.position];
    };
    bigcube.prototype.setCubes = function () {
        this.cubes = [this._cube2, this._cube3, this._cube4, this._cube5, this._cube6, this._cube7, this._cube8];
    };
    return bigcube;
}(Block));
//# sourceMappingURL=BigCube.js.map