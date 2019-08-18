/**
 * Z-Block, 3 x 2
 * Drawn in the shape of z
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
var ZBlock = /** @class */ (function (_super) {
    __extends(ZBlock, _super);
    function ZBlock() {
        var _this = _super.call(this, 4) || this;
        _this.type = "z block";
        _this.create();
        _this.setCubes();
        return _this;
    }
    ZBlock.prototype.create = function () {
        this.parentCube = this.createCube(3.5, 0); //bottom middle
        var mat = new BABYLON.StandardMaterial("mat", scene);
        mat.diffuseColor = BABYLON.Color3.Purple();
        mat.emissiveColor = new BABYLON.Color3(0.4, 0.28, 0.8); //purple
        this.parentCube.material = mat;
        this.parentCube.material.backFaceCulling = false;
        this._cube2 = this.becomeChild(this._cube2);
        this._cube3 = this.becomeChild(this._cube3);
        this._cube4 = this.becomeChild(this._cube4);
        this._cube2.parent = this.parentCube;
        this._cube2.position = new BABYLON.Vector3(1, 0, 0); //right, bottom
        this._cube3.parent = this.parentCube;
        this._cube3.position = new BABYLON.Vector3(0, 1, 0); //middle, top
        this._cube4.parent = this.parentCube;
        this._cube4.position = new BABYLON.Vector3(-1, 1, 0); //left, top
        // this._cube2 = this.becomeChild(this._cube2);
        // this._cube2.position = new BABYLON.Vector3(1, 0, 0); //right, bottom
        // this._cube3 = this.becomeChild(this._cube3);
        // this._cube3.position = new BABYLON.Vector3(0, 1, 0); //middle, top
        // this._cube4 = this.becomeChild(this._cube4);
        // this._cube4.position = new BABYLON.Vector3(-1, 1, 0); //left, top
    };
    ZBlock.prototype.getPositions = function () {
        this.setPositions();
        return this.positions;
    };
    ZBlock.prototype.setPositions = function () {
        this.uncouple();
        this.positions = [this.parentCube.position, this._cube2.position, this._cube3.position, this._cube4.position];
    };
    ZBlock.prototype.setCubes = function () {
        this.cubes = [this._cube2, this._cube3, this._cube4];
    };
    return ZBlock;
}(Block));
//# sourceMappingURL=ZBlock.js.map