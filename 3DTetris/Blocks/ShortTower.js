/**
* 1 x 3 Short Block
* Drawn upright, top to bottom, y = 5.5
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
var ShortTower = /** @class */ (function (_super) {
    __extends(ShortTower, _super);
    // private _dummypos: BABYLON.Vector3[]; 
    function ShortTower() {
        var _this = _super.call(this, 3) || this;
        _this.type = "short tower";
        _this.create();
        _this.setCubes();
        return _this;
    }
    ShortTower.prototype.create = function () {
        this.parentCube = this.createCube(5.5, 0);
        var mat = new BABYLON.StandardMaterial("mat", scene);
        mat.diffuseColor = new BABYLON.Color3(0, 1, 1);
        mat.emissiveColor = new BABYLON.Color3(0, 1, 1); //light blue
        this.parentCube.material = mat;
        this.parentCube.material.backFaceCulling = false;
        this._cube2 = this.becomeChild(this._cube2);
        this._cube3 = this.becomeChild(this._cube3);
        this._cube2.parent = this.parentCube;
        this._cube2.position.y = 1; //position relative to parent
        this._cube3.parent = this.parentCube;
        this._cube3.position.y = -1;
        // this._cube2 = this.becomeChild(this._cube2);
        // this._cube2.position.y = 1; 
        // this._cube3 = this.becomeChild(this._cube3);
        // this._cube3.position.y = -1;
    };
    ShortTower.prototype.getPositions = function () {
        this.setPositions();
        return this.positions;
    };
    ShortTower.prototype.setPositions = function () {
        //1st element stores parent block's pos:
        this.uncouple();
        this.positions = [this.parentCube.position, this._cube2.position, this._cube3.position];
        // this.recouple(); //MUST RECOUPLE OUTSIDE OF BLOCK CLASSES, WHENEVER GETPOSITIONS IS CALLED AND PASSED INTO UPDATE SPACES
    };
    ShortTower.prototype.setCubes = function () {
        this.cubes = [this._cube2, this._cube3];
    };
    return ShortTower;
}(Block));
//# sourceMappingURL=ShortTower.js.map