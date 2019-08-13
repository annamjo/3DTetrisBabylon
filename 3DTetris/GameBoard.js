/*export*/ var GameBoard = /** @class */ (function () {
    //2d/3d array
    // cameraCalib: number; //dep on size
    //private _borders: any[];
    function GameBoard(size) {
        this._size = size;
        // this._spaces = new Array(size);
        this.create();
        this.fillSpaces();
        this.fillPositions();
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
    GameBoard.prototype.createGrid = function () {
        var grid = new BABYLON.GridMaterial("grid", scene);
        grid.lineColor = BABYLON.Color3.White();
        grid.majorUnitFrequency = 1;
        grid.opacity = 0.8;
        grid.gridOffset = new BABYLON.Vector3(0.5, 0, 0.5);
        return grid;
    };
    GameBoard.prototype.createPlane = function (x, y, z, rotation) {
        this._height = (this._size === 7) ? 12 : 10; //12 if 7, 10 if 5 (default)
        var plane = BABYLON.MeshBuilder.CreatePlane("plane", { height: this._height, width: this._size }, scene);
        plane.position.x = x;
        plane.position.y = y;
        plane.position.z = z;
        plane.rotation.y = rotation;
        var planeGrid = this.createGrid();
        planeGrid.backFaceCulling = true;
        plane.material = planeGrid;
        plane.checkCollisions = true;
        return plane;
    };
    Object.defineProperty(GameBoard.prototype, "ground", {
        get: function () {
            return this._ground;
        },
        enumerable: true,
        configurable: true
    });
    GameBoard.prototype.fillSpaces = function () {
        var spaces = new Array(this._size); //x - length
        for (var x = 0; x < this._size; x++) { //fill x empty arrays w/ y-arrays
            spaces[x] = new Array(this._height); //y - height
            for (var y = 0; y < this._height; y++) { //fill y arrs w/ z-arrs
                spaces[x][y] = new Array(this._size); //z - width
                for (var z = 0; z < this._size; z++) { //fill z-arrs w/z # of elements
                    spaces[x][y][z] = false; //false - space/position not occupied
                }
            }
        }
        this._spaces = spaces;
    };
    Object.defineProperty(GameBoard.prototype, "spaces", {
        get: function () {
            return this._spaces;
        },
        enumerable: true,
        configurable: true
    });
    // positionToSpace(position: BABYLON.Vector3) { //to set space = true (occupied) //in block class - manipulate pos in game (func calls in game?)
    //     var x = position.x;
    //     var y = position.y;
    //     var z = position.z;
    //vector subtraction
    //     return 
    // }
    //find position of each space - calculate once (to compare to block's position): space->position
    GameBoard.prototype.fillPositions = function () {
        //define an origin vector:
        //for odd size and even height, shifted 0.5 up y
        var origin = new BABYLON.Vector3(-Math.floor(this._size / 2), (this._height / 2) - 0.5, Math.floor(this._size / 2)); //x, y, z at [0][0][0]
        var xpos = origin.x;
        var ypos = origin.y;
        var zpos = origin.z;
        //y +=1 ->down y coord; z+=1 -> down z coord; x+=1->up 1 x coord
        var positions = new Array(this._size); //array of babylon vectors?
        for (var x = 0; x < this._size; x++) {
            positions[x] = new Array(this._height);
            for (var y = 0; y < this._height; y++) {
                positions[x][y] = new Array(this._size);
                for (var z = 0; z < this._size; z++) {
                    positions[x][y][z] = new BABYLON.Vector3(xpos, ypos, zpos);
                    zpos--;
                }
                ypos--;
            }
            xpos++;
        }
        //vector subtraction
        //position fr origin? - translate to 
        this._positions = positions;
    };
    Object.defineProperty(GameBoard.prototype, "positions", {
        get: function () {
            return this._positions;
        },
        enumerable: true,
        configurable: true
    });
    GameBoard.prototype.updateSpaces = function () {
    };
    GameBoard.prototype.isSpaceOccupied = function () {
    };
    GameBoard.prototype.isLayerFull = function () {
        //is bottom-most layer full of blocks?
        //check if each array space = true
    };
    return GameBoard;
}());
//# sourceMappingURL=GameBoard.js.map