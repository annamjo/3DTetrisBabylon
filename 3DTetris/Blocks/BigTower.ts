/**
 * 1 x 4 Long Block
 * drawn upright, y = 6.5
 */

class BigTower extends Block {
    private _cube2: BABYLON.Mesh; //BABYLON.InstancedMesh;
    private _cube3: BABYLON.Mesh;
    private _cube4: BABYLON.Mesh;
    // private _pivot: BABYLON.Mesh;

    constructor(scene: BABYLON.Scene) {
        super(4, scene);
        this.type = "big tower";
        this.create();
        this.setCubes();
    }

    private create(): void {
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
    }

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

    public getPositions(): BABYLON.Vector3[] { //after using this method while active block, must recouple!!!
        return [this.parentCube.position, this._cube2.getAbsolutePosition(), this._cube3.getAbsolutePosition(), this._cube4.getAbsolutePosition()];
    }

    public getRelPos(): BABYLON.Vector3[] {
        this.setPositions();
        return this.positions; //gives relative positions (because cubes still parented), except cant get rel pos of parent cube...
    }

    private setPositions(): void {
        // this.uncouple();
        this.positions = [this.parentCube.position, this._cube2.position, this._cube3.position, this._cube4.position];

        // let pos = [this.parentCube.position, this._cube2.position, this._cube3.position, this._cube4.position];
        // let cloned = JSON.parse(JSON.stringify(pos)); //deep copy, not just reference to array
        // this.positions = cloned;

        // this.recouple();

        //before uncoupling: instanced meshes give positions relative to parent! CHANGE
    }

    private setCubes(): void {
        this.cubes = [this._cube2, this._cube3, this._cube4];
    }
}