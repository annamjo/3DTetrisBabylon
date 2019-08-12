var GameBoard = /** @class */ (function () {
    //2d/3d array
    // cameraCalib: number; //dep on size
    function GameBoard(size) {
        this._size = size;
        this._positions = new Array(size);
        this.create();
    }
    GameBoard.prototype.create = function () {
        var groundGrid = this.createGrid();
        groundGrid.backFaceCulling = false;
        //size: must be odd number b/c of offset; use 5 or 7
        var ground = BABYLON.MeshBuilder.CreateGround("ground", { width: this._size, height: this._size }, scene);
        ground.material = groundGrid;
        ground.position.y = (this._size === 7) ? -6 : -5;
        this._ground = ground;
        //front & back planes
        var fplane = this.createPlane(0, 0, -this._size / 2, Math.PI);
        var bplane = this.createPlane(0, 0, this._size / 2, 0);
        //right & left planes
        var rplane = this.createPlane(this._size / 2, 0, 0, Math.PI / 2);
        var lplane = this.createPlane(-this._size / 2, 0, 0, -Math.PI / 2);
    };
    //doesblock fit in? (next block, current block)
    //collapse layer, is layer full?
    GameBoard.prototype.createGrid = function () {
        var grid = new BABYLON.GridMaterial("grid", scene);
        grid.lineColor = BABYLON.Color3.White();
        grid.majorUnitFrequency = 1;
        grid.opacity = 0.8;
        grid.gridOffset = new BABYLON.Vector3(0.5, 0, 0.5);
        return grid;
    };
    GameBoard.prototype.createPlane = function (x, y, z, rotation) {
        this._depth = (this._size === 7) ? 12 : 10; //12 if 7, 10 if 5 (default)
        var plane = BABYLON.MeshBuilder.CreatePlane("plane", { height: this._depth, width: this._size }, scene);
        plane.position.x = x;
        plane.position.y = y; //need??
        plane.position.z = z;
        plane.rotation.y = rotation;
        var planeGrid = this.createGrid();
        planeGrid.backFaceCulling = true;
        plane.material = planeGrid;
        plane.checkCollisions = true;
        return plane;
    };
    Object.defineProperty(GameBoard.prototype, "positions", {
        get: function () {
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
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GameBoard.prototype, "ground", {
        get: function () {
            return this._ground;
        },
        enumerable: true,
        configurable: true
    });
    return GameBoard;
}());
// var gameBoard = new GameBoard(7);
// var ground = gameBoard.ground;
//# sourceMappingURL=GameBoard.js.map