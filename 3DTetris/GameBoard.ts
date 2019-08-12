class GameBoard {
    private _size: number;
    private _ground: BABYLON.Mesh; //a babylon mesh
    // cameraCalib: number;
    private _position: boolean[]; //array of nums //or BABYLON.Vector3, each square of grid - pos in gameboard
    //number[]??
    //2d/3d array
    
    constructor(size: number) {
        this._size = size;
        this.create();
        this._position = new Array();
    }

    private create(): void { //only used within this class
        var groundGrid = createGrid();
        groundGrid.backFaceCulling = false;
    
        //size: must be odd number b/c of offset; use 5 or 7
        var ground = BABYLON.MeshBuilder.CreateGround("ground", {width: this._size, height: this._size}, scene);
        ground.material = groundGrid;
        ground.position.y = (this._size === 7) ? -6 : -5;
        this._ground = ground;

        //front & back planes
        var fplane = createPlane(0, 0, -this._size/2, Math.PI);
        var bplane = createPlane(0, 0, this._size/2, 0);

        //right & left planes
        var rplane = createPlane(this._size/2, 0, 0, Math.PI / 2);
        var lplane = createPlane(-this._size/2, 0, 0, -Math.PI/2);

        function createGrid() { //take out and make private??
            var grid = new BABYLON.GridMaterial("grid", scene);
            grid.lineColor = BABYLON.Color3.White();
            grid.majorUnitFrequency = 1;
            grid.opacity = 0.8; 
            grid.gridOffset = new BABYLON.Vector3(0.5, 0, 0.5);
            return grid;
        }

        function createPlane(x: number, y: number, z: number, rotation: number) {
            var height = (this._size === 7) ? 12 : 10; //12 if 7, 10 if 5 (default)
            var plane = BABYLON.MeshBuilder.CreatePlane("plane", {height: height, width: this._size}, scene);
            plane.position.x = x;
            plane.position.y = y; //need??
            plane.position.z = z;
            plane.rotation.y = rotation;
    
            var planeGrid = createGrid();
            planeGrid.backFaceCulling = true;
            plane.material = planeGrid;
            plane.checkCollisions = true;
    
            return plane;
        }
    }

    get ground(): BABYLON.Mesh {
        return this._ground;
    }
}

// var gameBoard = new GameBoard(7);
// var ground = gameBoard.ground;