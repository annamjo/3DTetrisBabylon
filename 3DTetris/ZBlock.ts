class ZBlock extends Block {
    private _cube2: BABYLON.Mesh;
    private _cube3: BABYLON.Mesh;
    private _cube4: BABYLON.Mesh;

    constructor() {
        super(4);
        this.create();
    }

    private create(): void {
        var mat = new BABYLON.StandardMaterial("mat", scene);
        mat.diffuseColor = BABYLON.Color3.Purple();
        mat.emissiveColor = new BABYLON.Color3(0.4, 0.28, 0.8); //purple
    }

    public get positions(): BABYLON.Vector3[] {
        this.setPositions();
        return this.positions;
    }

    private setPositions(): void {

    }
}