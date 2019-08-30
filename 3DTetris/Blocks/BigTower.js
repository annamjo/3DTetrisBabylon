/**
 * 1 x 4 Long Block
 * drawn upright, y = 6.5
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
var BigTower = /** @class */ (function (_super) {
    __extends(BigTower, _super);
    // private _pivot: BABYLON.Mesh;
    function BigTower(scene) {
        var _this = _super.call(this, 4, scene) || this;
        _this.type = "big tower";
        _this.create();
        _this.setCubes();
        return _this;
    }
    BigTower.prototype.create = function () {
        this.parentCube = this.createCube(6.5, 0); //2nd cube from bottom
        var mat = new BABYLON.StandardMaterial("mat", this.scene);
        mat.diffuseColor = new BABYLON.Color3(0, 0.5, 0.5);
        mat.emissiveColor = new BABYLON.Color3(0.5, 1, 0.2); //green
        this.parentCube.material = mat;
        this.parentCube.material.backFaceCulling = false;
        // this._cube2 = this.parentCube.createInstance("cube2");
        // this._cube2 = this.createEdges(this._cube2);
        this._cube2 = this.becomeChild(this._cube2);
        this._cube3 = this.becomeChild(this._cube3);
        this._cube4 = this.becomeChild(this._cube4);
        this._cube2.parent = this.parentCube;
        this._cube2.position.y = 2;
        this._cube3.parent = this.parentCube;
        this._cube3.position.y = 1;
        this._cube4.parent = this.parentCube;
        this._cube4.position.y = -1;
        // this._cube2 = this.becomeChild(this._cube2);
        // this._cube2.position.y = 2;
        // this._cube3 = this.becomeChild(this._cube3);
        // this._cube3.position.y = 1;
        // this._cube4 = this.becomeChild(this._cube4);
        // this._cube4.position.y = -1;
    };
    // private setPivot() {
    //     this._pivot = BABYLON.MeshBuilder.CreateBox("box", {size: 0.05}, scene);
    //     this._pivot.visibility = 0;
    //     this._pivot.position.y = this.parentCube.position.y + 0.5;
    //     this._pivot.position.z = this.parentCube.position.z + 0.5;
    //     this.parentCube.setParent(this._pivot);
    // }
    // public rotate(axis: string): void {
    //     this.setPivot();
    //     var rotation = Math.PI / 2;
    //     switch(axis) {
    //         case "x":
    //             this._pivot.rotate(BABYLON.Axis.X, rotation, BABYLON.Space.WORLD);
    //             break;
    //         case "y":
    //             this._pivot.rotate(BABYLON.Axis.Y, -rotation, BABYLON.Space.WORLD);
    //             break;
    //         case "z":
    //             this._pivot.rotate(BABYLON.Axis.Z, -rotation, BABYLON.Space.WORLD);
    //             break;
    //     }
    //     // this.parentCube.etParent(null);
    // }
    BigTower.prototype.getPositions = function () {
        return [this.parentCube.position, this._cube2.getAbsolutePosition(), this._cube3.getAbsolutePosition(), this._cube4.getAbsolutePosition()];
    };
    BigTower.prototype.getRelPos = function () {
        this.setPositions();
        return this.positions; //gives relative positions (because cubes still parented), except cant get rel pos of parent cube...
    };
    BigTower.prototype.setPositions = function () {
        // this.uncouple();
        this.positions = [this.parentCube.position, this._cube2.position, this._cube3.position, this._cube4.position];
        // let pos = [this.parentCube.position, this._cube2.position, this._cube3.position, this._cube4.position];
        // let cloned = JSON.parse(JSON.stringify(pos)); //deep copy, not just reference to array
        // this.positions = cloned;
        // this.recouple();
        //before uncoupling: instanced meshes give positions relative to parent! CHANGE
    };
    BigTower.prototype.setCubes = function () {
        this.cubes = [this._cube2, this._cube3, this._cube4];
    };
    return BigTower;
}(Block));
//# sourceMappingURL=BigTower.js.map