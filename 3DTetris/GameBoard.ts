class GameBoard {
    //plan: create a gameboard class, pass in params to construc to change size
    size: number;
    ground: BABYLON.Mesh; //a babylon mesh
    // cameraCalib: number;

    constructor(size: number) {
        this.size = size;
        this.create();
    }

    create() {
        var groundGrid = createGrid();
        groundGrid.backFaceCulling = false;
    
        //size: must be odd number b/c of offset; use 5 or 7
        var ground = BABYLON.MeshBuilder.CreateGround("ground", {width: this.size, height: this.size}, scene);
        ground.material = groundGrid;
        ground.position.y = (this.size === 7) ? -6 : -5;
        this.ground = ground;

        //front & back planes
        var fplane = createPlane(0, 0, -this.size/2, Math.PI);
        var bplane = createPlane(0, 0, this.size/2, 0);

        //right & left planes
        var rplane = createPlane(this.size/2, 0, 0, Math.PI / 2);
        var lplane = createPlane(-this.size/2, 0, 0, -Math.PI/2);

        function createGrid() {
            var grid = new BABYLON.GridMaterial("grid", scene);
            grid.lineColor = BABYLON.Color3.White();
            grid.majorUnitFrequency = 1;
            grid.opacity = 0.8; 
            grid.gridOffset = new BABYLON.Vector3(0.5, 0, 0.5);
            return grid;
        }

        function createPlane(x: number, y: number, z: number, rotation: number) {
            var height = (this.size === 7) ? 12 : 10; //12 if 7, 10 if 5 (default)
            var plane = BABYLON.MeshBuilder.CreatePlane("plane", {height: height, width: this.size}, scene);
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

    getGround() {
        return this.ground; //part of gameboard
    }
}

// var gameBoard = new GameBoard(7);
// var ground = gameBoard.getGround();
