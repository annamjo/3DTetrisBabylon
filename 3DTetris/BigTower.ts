class BigTower extends Block {
    private _cube2: BABYLON.Mesh;
    private _cube3: BABYLON.Mesh;
    private _cube4: BABYLON.Mesh;

    constructor() {
        super(4);
        this.create();
    }

    private create(): void {
        var mat = new BABYLON.StandardMaterial("mat", scene);
        mat.diffuseColor = new BABYLON.Color3(0, 0.5, 0.5);
        mat.emissiveColor = new BABYLON.Color3(0.5, 1, 0.2); //green
    }

    public get positions(): BABYLON.Vector3[] {
        this.setPositions();
        return this.positions;
    }

    private setPositions(): void {

    }
}