/**
* 1 x 3 Short Block
* drawn upright, top to bottom, y = 6.5
*/

class ShortTower extends Block {
    private _cube2: BABYLON.Mesh; //InstancedMesh; //top cube
    private _cube3: BABYLON.Mesh; //bottom cube
    
    constructor() {
        super(3);
        this.type = "short tower";
        this.create();
        this.setCubes();
    }

    private create(): void {
        this.parentCube = this.createCube(6.5, 0);
        
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
    }

    public getPositions(): BABYLON.Vector3[] {
        return [this.parentCube.position, this._cube2.getAbsolutePosition(), this._cube3.getAbsolutePosition()];
    }

    public getRelPos(): BABYLON.Vector3[] {
        this.setPositions();
        return this.positions; 
    }

    private setPositions(): void { //order of pos doesn't matter?
        //1st element stores parent block's pos:
        this.positions = [this.parentCube.position, this._cube2.position, this._cube3.position];
    }

    private setCubes(): void {
        this.cubes = [this._cube2, this._cube3]
    }
}