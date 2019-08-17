/**
 * 1 x 4 Long Block
 * Drawn upright, y = 3.5
 */

class BigTower extends Block {
    private _cube2: BABYLON.InstancedMesh;
    private _cube3: BABYLON.InstancedMesh;
    private _cube4: BABYLON.InstancedMesh;

    constructor() {
        super(4);
        this.type = "big tower";
        this.create();
        this.setCubes();
    }

    private create(): void {
        this.parentCube = this.createCube(3.5, 0);

        var mat = new BABYLON.StandardMaterial("mat", scene);
        mat.diffuseColor = new BABYLON.Color3(0, 0.5, 0.5);
        mat.emissiveColor = new BABYLON.Color3(0.5, 1, 0.2); //green
        this.parentCube.material = mat;
        this.parentCube.material.backFaceCulling = false;

        // this._cube2 = this.parentCube.createInstance("cube2");
        // this._cube2 = this.createEdges(this._cube2);
        this._cube2 = this.becomeChild(this._cube2);
        this._cube2.position.y = 2;

        this._cube3 = this.becomeChild(this._cube3);
        this._cube3.position.y = 1;

        this._cube4 = this.becomeChild(this._cube4);
        this._cube4.position.y = -1;
    }

    public getPositions(): BABYLON.Vector3[] { //after using this method while active block, must recouple!!!
        this.setPositions();
        return this.positions;
    }

    private setPositions(): void {
        this.uncouple();
        this.positions = [this.parentCube.position, this._cube2.position, this._cube3.position, this._cube4.position];
        //before uncoupling: instanced meshes give positions relative to parent! CHANGED
    }

    private setCubes(): void {
        this.cubes = [this._cube2, this._cube3, this._cube4];
    }
}