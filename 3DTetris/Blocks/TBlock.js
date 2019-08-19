/**
 * T-Block, 3 x 2,
 * Drawn on major horizontal axis, top cube up
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
var TBlock = /** @class */ (function (_super) {
    __extends(TBlock, _super);
    function TBlock() {
        var _this = _super.call(this, 4) || this;
        _this.type = "t block";
        _this.create();
        _this.setCubes();
        return _this;
    }
    TBlock.prototype.create = function () {
        this.parentCube = this.createCube(5.5, 0); //middle, bottom
        var mat = new BABYLON.StandardMaterial("mat", scene);
        mat.diffuseColor = new BABYLON.Color3(0.7, 0.5, 0);
        mat.emissiveColor = new BABYLON.Color3(0.7, 0.3, 0); //orange
        this.parentCube.material = mat;
        this.parentCube.material.backFaceCulling = false;
        this._cube2 = this.becomeChild(this._cube2);
        this._cube3 = this.becomeChild(this._cube3);
        this._cube4 = this.becomeChild(this._cube4);
        this._cube2.parent = this.parentCube;
        this._cube2.position = new BABYLON.Vector3(-1, 0, 0); //left, bottom
        this._cube3.parent = this.parentCube;
        this._cube3.position = new BABYLON.Vector3(1, 0, 0); //right, bottom
        this._cube4.parent = this.parentCube;
        this._cube4.position = new BABYLON.Vector3(0, 1, 0); //middle, top
        // this._cube2 = this.becomeChild(this._cube2);
        // this._cube2.position = new BABYLON.Vector3(-1, 0, 0); //left, bottom
        // this._cube3 = this.becomeChild(this._cube3);
        // this._cube3.position = new BABYLON.Vector3(1, 0, 0); //right, bottom
        // this._cube4 = this.becomeChild(this._cube4);
        // this._cube4.position = new BABYLON.Vector3(0, 1, 0); //middle, top
    };
    TBlock.prototype.getPositions = function () {
        this.setPositions();
        return this.positions;
    };
    TBlock.prototype.setPositions = function () {
        this.uncouple();
        this.positions = [this.parentCube.position, this._cube2.position, this._cube3.position, this._cube4.position];
    };
    TBlock.prototype.setCubes = function () {
        this.cubes = [this._cube2, this._cube3, this._cube4];
    };
    return TBlock;
}(Block));
//# sourceMappingURL=TBlock.js.map