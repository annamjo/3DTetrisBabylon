/**
 * Z-Block, 3 x 2
 * Drawn in the shape of z
 */

class ZBlock extends Block {
    private _cube2: BABYLON.Mesh; //BABYLON.InstancedMesh;
    private _cube3: BABYLON.Mesh;
    private _cube4: BABYLON.Mesh;

    constructor() {
        super(4);
        this.type = "z block";
        this.create();
        this.setCubes();
    }

    private create(): void {
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
    }

    public getPositions(): BABYLON.Vector3[] {
        this.setPositions();
        return this.positions;
    }

    private setPositions(): void {
        this.uncouple();
        this.positions = [this.parentCube.position, this._cube2.position, this._cube3.position, this._cube4.position];
    }

    private setCubes(): void {
        this.cubes = [this._cube2, this._cube3, this._cube4];
    }
}