class GameBoard {
    private _size: number;
    private _depth: number;
    private _ground: BABYLON.Mesh;
    private _positions: any[]; //number[] //or BABYLON.Vector3, each square of grid - pos in gameboard
    //2d/3d array
    // cameraCalib: number; //dep on size
    
    constructor(size: number) {
        this._size = size;
        this._positions = new Array(size);
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
    
    public get positions(): any[] { //1 square longer each dim (always set to true - occupied)

        for (var x = 0; x < this._size; x++) {
            this._positions[x] = new Array(this._size);

            for (var y = 0; y < this._depth; y++) {
                this._positions[x][y] = new Array(this._size);

                for (var z = 0; z < this._size; z++) {
                    this._positions[x][y][z] = false;
                }
            }
        }

        return this._positions;
    }

    public get ground(): BABYLON.Mesh {
        return this._ground;
    }
}

// var gameBoard = new GameBoard(7);
// var ground = gameBoard.ground;