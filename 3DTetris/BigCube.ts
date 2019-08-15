class BigCube extends Block {
    private _cube2: BABYLON.Mesh;
    private _cube3: BABYLON.Mesh;
    private _cube4: BABYLON.Mesh;
    private _cube5: BABYLON.Mesh;
    private _cube6: BABYLON.Mesh;
    private _cube7: BABYLON.Mesh;
    private _cube8: BABYLON.Mesh;

    constructor() {
        super(8);
        this.create();
    }

    private create(): void {
        var mat = new BABYLON.StandardMaterial("mat", scene);
        mat.diffuseColor = new BABYLON.Color3(0.2, 0.28, 1);
        mat.emissiveColor = new BABYLON.Color3(0.2, 0.28, 1); //dark blue
    }

    public get positions(): BABYLON.Vector3[] {
        this.setPositions();
        return this.positions;
    }

    private setPositions(): void {

    }
}