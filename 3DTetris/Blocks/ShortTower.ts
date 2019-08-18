/**
* 1 x 3 Short Block
* Drawn upright, top to bottom, y = 4.5
*/

class ShortTower extends Block {
    private _cube2: BABYLON.Mesh; //InstancedMesh; //top cube
    private _cube3: BABYLON.Mesh; //bottom cube
    // private _dummypos: BABYLON.Vector3[]; 
    
    constructor() {
        super(3);
        this.type = "short tower";
        this.create();
        this.setCubes();
    }

    private create(): void {
        this.parentCube = this.createCube(4.5, 0);
        
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
    }

    public getPositions(): BABYLON.Vector3[] {
        this.setPositions();
        return this.positions;
    }

    private setPositions(): void { //order of pos doesn't matter?
        //1st element stores parent block's pos:
        this.uncouple();
        this.positions = [this.parentCube.position, this._cube2.position, this._cube3.position];
        // this.recouple(); //MUST RECOUPLE OUTSIDE OF BLOCK CLASSES, WHENEVER GETPOSITIONS IS CALLED AND PASSED INTO UPDATE SPACES
    }

    private setCubes(): void {
        this.cubes = [this._cube2, this._cube3]
    }

    // public dummy() { //just create same instance before checking ingrid when rotating??
    // }

}