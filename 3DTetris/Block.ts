class Block {
    private _isActive: boolean;
    public positions: BABYLON.Vector3[];
    public parentCube: BABYLON.Mesh; //parent cube

    constructor(cubeNum: number) {
        this._isActive = true; //true when block is falling (1st contructed), false when locked in
        this.positions = new Array(cubeNum);
    }

    public createCube(): BABYLON.Mesh { //for use in subclasses - to use as clones
        var cube = BABYLON.MeshBuilder.CreateBox("box", {size: 1}, scene);
        cube.position.y = 5.5; //ypos

        cube.enableEdgesRendering();
        cube.edgesWidth = 5.0;
        cube.edgesColor = new BABYLON.Color4(0, 0, 0, 1); //black edges

        return cube;
    }

    public get position(): BABYLON.Vector3 { //position of block based on parent block
        return this.parentCube.position;
    }

    public rotate(axis: string, rotation: number): void  {
        switch(axis) {
            case "x": 
                this.parentCube.rotate(BABYLON.Axis.X, rotation, BABYLON.Space.WORLD);
                break;
            case "y":
                this.parentCube.rotate(BABYLON.Axis.Y, -rotation, BABYLON.Space.WORLD);
                break;
            case "z":
                this.parentCube.rotate(BABYLON.Axis.Z, -rotation, BABYLON.Space.WORLD);
                break;
        }
        
    }

    public split(position: BABYLON.Vector3): void { //break apart a single cube from block
        //each cube that makes up block will uncouple - setParent(null)
        //detatch part of block
        //use this.positions
    }

    public set isActive(state: boolean) {
        this.isActive = state; //used to turn off, set to false
    }
    
}