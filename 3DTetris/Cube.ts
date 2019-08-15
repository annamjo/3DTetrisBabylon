/*
 * 1 x 1 Cube Block 
 */

class Cube extends Block {

    constructor() {
        super(1); // 1 -size of array
        this.create();
    }

    private create(): void {
        this.parentCube = this.createCube();

        var mat = new BABYLON.StandardMaterial("mat", scene);
        mat.diffuseColor = new BABYLON.Color3(0.6, 0.6, 0);
        mat.emissiveColor = BABYLON.Color3.Yellow();
        this.parentCube.material = mat;
        this.parentCube.material.backFaceCulling = false;
    }

    public getPositions(): BABYLON.Vector3[] {
        this.setPositions();
        return this.positions;
    }

    private setPositions(): void {
        this.positions[0] = this.parentCube.position;
    }
    
}