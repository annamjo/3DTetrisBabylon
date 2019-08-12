class GameBoard {
    private _size: number;
    private _depth: number;
    private _ground: BABYLON.Mesh;
    // cameraCalib: number; //dep on size
    private _positions: boolean[]; //number[] //or BABYLON.Vector3, each square of grid - pos in gameboard
    //2d/3d array
    
    constructor(size: number) {
        this._size = size;
        this.create();
    }

    private create(): void { //only used within this class
        var groundGrid = this.createGrid();
        groundGrid.backFaceCulling = false;
    
        //size: must be odd number b/c of offset; use 5 or 7
        var ground = BABYLON.MeshBuilder.CreateGround("ground", {width: this._size, height: this._size}, scene);
        ground.material = groundGrid;
        ground.position.y = (this._size === 7) ? -6 : -5;
        this._ground = ground;

        //front & back planes
        var fplane = this.createPlane(0, 0, -this._size/2, Math.PI);
        var bplane = this.createPlane(0, 0, this._size/2, 0);

        //right & left planes
        var rplane = this.createPlane(this._size/2, 0, 0, Math.PI / 2);
        var lplane = this.createPlane(-this._size/2, 0, 0, -Math.PI/2);
    }

    get positions(): boolean[] { //1 square longer each dim (always set to true - occupied)
        var width = this._size;
        var length = this._size;
        var depth = this._depth;
        return this._positions;
    }

    //doesblock fit in? (next block, current block)
    //collapse layer, is layer full?

    private createGrid(): BABYLON.GridMaterial {
        var grid = new BABYLON.GridMaterial("grid", scene);
        grid.lineColor = BABYLON.Color3.White();
        grid.majorUnitFrequency = 1;
        grid.opacity = 0.8; 
        grid.gridOffset = new BABYLON.Vector3(0.5, 0, 0.5);
        return grid;
    }

    private createPlane(x: number, y: number, z: number, rotation: number): BABYLON.Mesh {
        this._depth = (this._size === 7) ? 12 : 10; //12 if 7, 10 if 5 (default)
        var plane = BABYLON.MeshBuilder.CreatePlane("plane", {height: this._depth, width: this._size}, scene);
        plane.position.x = x;
        plane.position.y = y; //need??
        plane.position.z = z;
        plane.rotation.y = rotation;

        var planeGrid = this.createGrid();
        planeGrid.backFaceCulling = true;
        plane.material = planeGrid;
        plane.checkCollisions = true;

        return plane;
    }

    public get ground(): BABYLON.Mesh {
        return this._ground;
    }
}

// var gameBoard = new GameBoard(7);
// var ground = gameBoard.ground;