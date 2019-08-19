/**
 * 2 x 2 Big Cube
 * Drawn offset to the left
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
var BigCube = /** @class */ (function (_super) {
    __extends(BigCube, _super);
    function BigCube() {
        var _this = _super.call(this, 8) || this;
        _this.type = "big cube";
        _this.create();
        _this.setCubes();
        return _this;
    }
    BigCube.prototype.create = function () {
        this.parentCube = this.createCube(5.5, -1); //offset position - parent: bottom,left,front cube
        var mat = new BABYLON.StandardMaterial("mat", scene);
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
        // this._cube2 = this.becomeChild(this._cube2);
        // this._cube2.position = new BABYLON.Vector3(0, 0, 1); //bottom,left,back
        // this._cube3 = this.becomeChild(this._cube3);
        // this._cube3.position = new BABYLON.Vector3(1, 0, 1); //bottom,right,back
        // this._cube4 = this.becomeChild(this._cube4);
        // this._cube4.position = new BABYLON.Vector3(1, 0, 0); //bottom,right,front
        // this._cube5 = this.becomeChild(this._cube5);
        // this._cube5.position = new BABYLON.Vector3(0, 1, 0); //top,left,front
        // this._cube6 = this.becomeChild(this._cube6);
        // this._cube6.position = new BABYLON.Vector3(0, 1, 1); //top,left,back
        // this._cube7 = this.becomeChild(this._cube7);
        // this._cube7.position = new BABYLON.Vector3(1, 1, 1); //top,right,back
        // this._cube8 = this.becomeChild(this._cube8);
        // this._cube8.position = new BABYLON.Vector3(1, 1, 0); //top,rightfront
    };
    BigCube.prototype.getPositions = function () {
        this.setPositions();
        return this.positions;
    };
    BigCube.prototype.setPositions = function () {
        this.uncouple();
        this.positions = [this.parentCube.position, this._cube2.position, this._cube3.position, this._cube4.position,
            this._cube5.position, this._cube6.position, this._cube7.position, this._cube8.position];
        // this.recouple();
    };
    BigCube.prototype.setCubes = function () {
        this.cubes = [this._cube2, this._cube3, this._cube4, this._cube5, this._cube6, this._cube7, this._cube8];
    };
    return BigCube;
}(Block));
//# sourceMappingURL=BigCube.js.map