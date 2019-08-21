/**
 * 1 x 1 Cube Block 
 * Starts at height y = 6.5
 */

class Cube extends Block {

    constructor() {
        super(1); // 1 -size of array
        this.type = "cube";
        this.create();
    }

    private create(): void {
        this.parentCube = this.createCube(6.5, 0);

        var mat = new BABYLON.StandardMaterial("mat", scene);
        mat.diffuseColor = new BABYLON.Color3(0.6, 0.6, 0);
        mat.emissiveColor = BABYLON.Color3.Yellow();
        this.parentCube.material = mat;
        this.parentCube.material.backFaceCulling = false;
    }

    //retrieve positions at a given time - whenever updateSpaces in Game is called
    public getPositions(): BABYLON.Vector3[] {
        this.setPositions();
        return this.positions;
    }

    private setPositions(): void {
        this.positions[0] = this.parentCube.position;
        //this.positions = [this.parentCube.position];
    }
}