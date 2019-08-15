class MiniL extends Block {
    private _cube2: BABYLON.Mesh;
    private _cube3: BABYLON.Mesh;

    constructor() {
        super(3);
        this.create();
    }

    private create(): void {

        //var originalCube = this.cube;

        var mat = new BABYLON.StandardMaterial("mat", scene);
        mat.diffuseColor = new BABYLON.Color3(1, 0.2, 0.3);
        mat.emissiveColor = new BABYLON.Color3(1, 0.2, 0.3); //light red

    }

    public get positions(): BABYLON.Vector3[] {
        this.setPositions();
        return this.positions;
    }

    private setPositions(): void {

    }
}