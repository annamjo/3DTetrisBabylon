class BigL extends Block { 
    private _cube2: BABYLON.Mesh;
    private _cube3: BABYLON.Mesh;
    private _cube4: BABYLON.Mesh;

    constructor() {
        super(4);
        this.create();
    }

    private create(): void {
        var mat = new BABYLON.StandardMaterial("mat", scene);
        mat.diffuseColor = new BABYLON.Color3(0.4, 0.28, 1);
        mat.emissiveColor = new BABYLON.Color3(1, 0.28, 1); //pink
    }

    public get positions(): BABYLON.Vector3[] {
        this.setPositions();
        return this.positions;
    }

    private setPositions(): void {

    }
}