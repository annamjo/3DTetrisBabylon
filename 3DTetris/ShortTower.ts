/*
* 1 x 3 Short Block
* Starting position: upright, top to bottom, y = 4.5
*/

class ShortTower extends Block {
    private _cube2: BABYLON.InstancedMesh; //top cube
    private _cube3: BABYLON.InstancedMesh; //bottom cube
    
    constructor() {
        super(3);
        this.create();
    }

    private create(): void {
        this.parentCube = this.createCube(4.5);
        
        var mat = new BABYLON.StandardMaterial("mat", scene);
        mat.diffuseColor = new BABYLON.Color3(0, 1, 1);
        mat.emissiveColor = new BABYLON.Color3(0, 1, 1); //light blue
        this.parentCube.material = mat;
        this.parentCube.material.backFaceCulling = false;

        this._cube2 = this.parentCube.createInstance("cube2");
        this._cube2 = this.createEdges(this._cube2);

        this._cube3 = this.parentCube.createInstance("cube3");
        this._cube3 = this.createEdges(this._cube3);

        this._cube2.parent = this.parentCube;
        this._cube2.position.y = 1; //position relative to parent 

        this._cube3.parent = this.parentCube;
        this._cube3.position.y = -1;
    }

    public getPositions(): BABYLON.Vector3[] {
        this.setPositions();
        return this.positions;
    }

    private setPositions(): void {
        //1st element stores parent block's pos:
        this.positions = [this.parentCube.position, this._cube2.position, this._cube3.position];
    }
}