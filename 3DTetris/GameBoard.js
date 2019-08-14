/*export*/ var GameBoard = /** @class */ (function () {
    // cameraCalib: number; //dep on size
    function GameBoard(size) {
        this._size = size;
        this.create();
        this.fillSpaces();
        this.fillPositions();
        this.fillBorders();
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
        // grid.lineColor = BABYLON.Color3.White();
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
    Object.defineProperty(GameBoard.prototype, "size", {
        get: function () {
            return this._size();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GameBoard.prototype, "height", {
        get: function () {
            return this._height;
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
    GameBoard.prototype.fillPositions = function () {
        // define an origin vector: //x, y, z at [0][0][0]
        // for odd size and even height, shifted 0.5 up y
        var origin = new BABYLON.Vector3(-Math.floor(this._size / 2), (this._height / 2) - 0.5, Math.floor(this._size / 2));
        // y+=1 -> down y coord; z+=1 -> down z coord; x+=1 -> up 1 x coord
        var positions = new Array(this._size);
        var xpos = origin.x;
        for (var x = 0; x < this._size; x++) {
            positions[x] = new Array(this._height);
            var ypos = origin.y;
            for (var y = 0; y < this._height; y++) {
                positions[x][y] = new Array(this._size);
                var zpos = origin.z;
                for (var z = 0; z < this._size; z++) {
                    positions[x][y][z] = new BABYLON.Vector3(xpos, ypos, zpos);
                    zpos--;
                }
                ypos--;
            }
            xpos++;
        }
        this._positions = positions;
    };
    Object.defineProperty(GameBoard.prototype, "positions", {
        get: function () {
            return this._positions;
        },
        enumerable: true,
        configurable: true
    });
    GameBoard.prototype.fillBorders = function () {
        var borderSize = this._size + 2;
        var borders = new Array(borderSize);
        for (var x = 0; x < borderSize; x++) {
            borders[x] = new Array(this._height);
            for (var y = 0; y < this._height; y++) {
                borders[x][y] = new Array(borderSize);
                for (var z = 0; z < borderSize; z++) {
                    if (x === 0 || x === borderSize - 1 || z === 0 || z === borderSize - 1) {
                        borders[x][y][z] = true; //border space is occupied
                        //unoccuppied space in grid - empty
                    }
                }
            }
        }
        this._borders = borders;
    };
    Object.defineProperty(GameBoard.prototype, "borders", {
        get: function () {
            return this._borders;
        },
        enumerable: true,
        configurable: true
    });
    //to track position of a block - in game, traverse through array of positions -call update each time
    GameBoard.prototype.updateSpaces = function (position) {
        // change param to an array of positions (bc of block types) -> loop thrpugh positions of block? (&& board), 
        //parent: get positions of each child block (centers)
        // check positions array, dep on mesh
        for (var x = 0; x < this._size; x++) {
            for (var y = 0; y < this._height; y++) {
                for (var z = 0; z < this._size; z++) {
                    //compare position to position array, make change to spaces array
                    //do another for loop for each pos in pos arr
                    if (this._positions[x][y][z].x === position.x && this._positions[x][y][z].y === position.y && this._positions[x][y][z].z === position.z) {
                        this._spaces[x][y][z] = true;
                    }
                    //for each pos...
                    else if (this._spaces[x][y][z] === true && this._positions[x][y][z] !== position /*iterate through rest of pos arr*/) { //to reset space that was previously true
                        //for loop to go through positions (var set to true then false if xyz has same pos)
                        this._spaces[x][y][z] = false; //for small cube; mesh.position tracks center of mesh
                    }
                }
            }
        }
    };
    return GameBoard;
}());
//# sourceMappingURL=GameBoard.js.map