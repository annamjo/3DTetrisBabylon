var GameBoard = /** @class */ (function () {
    //number[]??
    //2d array
    function GameBoard(size) {
        this.size = size;
        this.create();
        var arr = new Array();
    }
    GameBoard.prototype.create = function () {
        var groundGrid = createGrid();
        groundGrid.backFaceCulling = false;
        //size: must be odd number b/c of offset; use 5 or 7
        var ground = BABYLON.MeshBuilder.CreateGround("ground", { width: this.size, height: this.size }, scene);
        ground.material = groundGrid;
        ground.position.y = (this.size === 7) ? -6 : -5;
        this.ground = ground;
        //front & back planes
        var fplane = createPlane(0, 0, -this.size / 2, Math.PI);
        var bplane = createPlane(0, 0, this.size / 2, 0);
        //right & left planes
        var rplane = createPlane(this.size / 2, 0, 0, Math.PI / 2);
        var lplane = createPlane(-this.size / 2, 0, 0, -Math.PI / 2);
        function createGrid() {
            var grid = new BABYLON.GridMaterial("grid", scene);
            grid.lineColor = BABYLON.Color3.White();
            grid.majorUnitFrequency = 1;
            grid.opacity = 0.8;
            grid.gridOffset = new BABYLON.Vector3(0.5, 0, 0.5);
            return grid;
        }
        function createPlane(x, y, z, rotation) {
            var height = (this.size === 7) ? 12 : 10; //12 if 7, 10 if 5 (default)
            var plane = BABYLON.MeshBuilder.CreatePlane("plane", { height: height, width: this.size }, scene);
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
    };
    GameBoard.prototype.getGround = function () {
        return this.ground; //part of gameboard
    };
    return GameBoard;
}());
// var gameBoard = new GameBoard(7);
// var ground = gameBoard.getGround();
//# sourceMappingURL=GameBoard.js.map