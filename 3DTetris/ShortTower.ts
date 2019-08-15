/*
* 1 x 3 Short Block
* Starting position: upright, top to bottom
*/

class ShortTower extends Block {
    private _cube2: BABYLON.Mesh;
    private _cube3: BABYLON.InstancedMesh;
    
    constructor() {
        super(3);
        this.create();
    }

    private create(): void {
        this.parentCube = this.createCube();
        this._cube2 = this.createCube();

        var mat = new BABYLON.StandardMaterial("mat", scene);
        mat.diffuseColor = new BABYLON.Color3(0, 1, 1);
        mat.emissiveColor = new BABYLON.Color3(0, 1, 1); //light blue
        this.parentCube.material = mat;
        this.parentCube.material.backFaceCulling = false;
        this._cube3 = this._cube2.createInstance("cube3");
    }

    public get positions(): BABYLON.Vector3[] {
        this.setPositions();
        return this.positions;
    }

    private setPositions(): void {

    }
}