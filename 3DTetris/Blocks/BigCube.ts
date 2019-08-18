/*
 * 2 x 2 Big Cube
 * Drawn offset to the left
 */

class BigCube extends Block {
    private _cube2: BABYLON.Mesh; //InstancedMesh;
    private _cube3: BABYLON.Mesh;
    private _cube4: BABYLON.Mesh;
    private _cube5: BABYLON.Mesh;
    private _cube6: BABYLON.Mesh;
    private _cube7: BABYLON.Mesh;
    private _cube8: BABYLON.Mesh;

    constructor() {
        super(8);
        this.type = "big cube";
        this.create();
        this.setCubes();
    }

    private create(): void {

        this.parentCube = this.createCube(4.5, -1); //offset position - parent: bottom,left,front cube
        var mat = new BABYLON.StandardMaterial("mat", scene);
        mat.diffuseColor = new BABYLON.Color3(0.2, 0.28, 1);
        mat.emissiveColor = new BABYLON.Color3(0.2, 0.28, 1); //dark blue
        this.parentCube.material = mat;
        this.parentCube.material.backFaceCulling = false;

        this._cube2 = this.becomeChild(this._cube2);
        this._cube3 = this.becomeChild(this._cube3);
        this._cube4 = this.becomeChild(this._cube4);
        this._cube5 = this.becomeChild(this._cube5);
        this._cube6 = this.becomeChild(this._cube6);
        this._cube7 = this.becomeChild(this._cube7);
        this._cube8 = this.becomeChild(this._cube8);

        this._cube2.parent = this.parentCube;
        this._cube2.position = new BABYLON.Vector3(0, 0, 1); //bottom,left,back

        this._cube3.parent = this.parentCube;
        this._cube3.position = new BABYLON.Vector3(1, 0, 1); //bottom,right,back

        this._cube4.parent = this.parentCube;
        this._cube4.position = new BABYLON.Vector3(1, 0, 0); //bottom,right,front

        this._cube5.parent = this.parentCube;
        this._cube5.position = new BABYLON.Vector3(0, 1, 0); //top,left,front
        
        this._cube6.parent = this.parentCube;
        this._cube6.position = new BABYLON.Vector3(0, 1, 1); //top,left,back

        this._cube7.parent = this.parentCube;
        this._cube7.position = new BABYLON.Vector3(1, 1, 1); //top,right,back
        
        this._cube8.parent = this.parentCube;
        this._cube8.position = new BABYLON.Vector3(1, 1, 0); //top,right,front

        // this._cube2 = this.becomeChild(this._cube2);
        // this._cube2.position = new BABYLON.Vector3(0, 0, 1); //bottom,left,back

        // this._cube3 = this.becomeChild(this._cube3);
        // this._cube3.position = new BABYLON.Vector3(1, 0, 1); //bottom,right,back

        // this._cube4 = this.becomeChild(this._cube4);
        // this._cube4.position = new BABYLON.Vector3(1, 0, 0); //bottom,right,front

        // this._cube5 = this.becomeChild(this._cube5);
        // this._cube5.position = new BABYLON.Vector3(0, 1, 0); //top,left,front
        
        // this._cube6 = this.becomeChild(this._cube6);
        // this._cube6.position = new BABYLON.Vector3(0, 1, 1); //top,left,back

        // this._cube7 = this.becomeChild(this._cube7);
        // this._cube7.position = new BABYLON.Vector3(1, 1, 1); //top,right,back
        
        // this._cube8 = this.becomeChild(this._cube8);
        // this._cube8.position = new BABYLON.Vector3(1, 1, 0); //top,rightfront
    }

    public getPositions(): BABYLON.Vector3[] {
        this.setPositions();
        return this.positions;
    }

    private setPositions(): void {
        this.uncouple();
        this.positions = [this.parentCube.position, this._cube2.position, this._cube3.position, this._cube4.position,
                            this._cube5.position, this._cube6.position, this._cube7.position, this._cube8.position];
        // this.recouple();
    }

    private setCubes(): void {
        this.cubes = [this._cube2, this._cube3, this._cube4, this._cube5, this._cube6, this._cube7, this._cube8];
    }
}