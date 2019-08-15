class Cube extends Block {
    private _cube1: BABYLON.Mesh;

    constructor() {
        super(1);
        this.create();
    }

    private create(): void {
        this._cube1 = this.createCube(5.5);

        var mat = new BABYLON.StandardMaterial("mat", scene);
        mat.diffuseColor = new BABYLON.Color3(0.6, 0.6, 0);
        mat.emissiveColor = BABYLON.Color3.Yellow();
        this._cube1.material = mat;
        this._cube1.material.backFaceCulling = false;

    }

    public get position(): BABYLON.Vector3 {
        return this._cube1.position; //for other blocks, return parent's pos
    }

    public getPositions(): BABYLON.Vector3[] {
        this.setPositions();
        return this.positions;
    }

    private setPositions(): void {
        this.positions[0] = this._cube1.position;
    }
}