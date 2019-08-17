var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var Gameboard = /** @class */ (function () {
    // cameraCalib: number; //dep on size
    function Gameboard(size) {
        this._size = size;
        this.create();
        this.fillSpaces();
        this.fillPositions();
        this.fillBorders();
    }
    Gameboard.prototype.create = function () {
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
        this._fplane = fplane;
        this._bplane = bplane;
        //right & left planes
        var rplane = this.createPlane(this._size / 2, 0, 0, Math.PI / 2);
        var lplane = this.createPlane(-this._size / 2, 0, 0, -Math.PI / 2);
        this._rplane = rplane;
        this._lplane = lplane;
    };
    Gameboard.prototype.createGrid = function () {
        var grid = new BABYLON.GridMaterial("grid", scene);
        grid.lineColor = BABYLON.Color3.White();
        grid.majorUnitFrequency = 1;
        grid.opacity = 0.85;
        grid.gridOffset = new BABYLON.Vector3(0.5, 0, 0.5);
        return grid;
    };
    Gameboard.prototype.createPlane = function (x, y, z, rotation) {
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
    Object.defineProperty(Gameboard.prototype, "size", {
        get: function () {
            return this._size;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Gameboard.prototype, "height", {
        get: function () {
            return this._height;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Gameboard.prototype, "ground", {
        get: function () {
            return this._ground;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Gameboard.prototype, "fplane", {
        get: function () {
            return this._fplane;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Gameboard.prototype, "bplane", {
        get: function () {
            return this._bplane;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Gameboard.prototype, "rplane", {
        get: function () {
            return this._rplane;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Gameboard.prototype, "lplane", {
        get: function () {
            return this._lplane;
        },
        enumerable: true,
        configurable: true
    });
    Gameboard.prototype.fillSpaces = function () {
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
    Object.defineProperty(Gameboard.prototype, "spaces", {
        get: function () {
            return this._spaces;
        },
        enumerable: true,
        configurable: true
    });
    Gameboard.prototype.fillPositions = function () {
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
    Object.defineProperty(Gameboard.prototype, "positions", {
        get: function () {
            return this._positions;
        },
        enumerable: true,
        configurable: true
    });
    Gameboard.prototype.fillBorders = function () {
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
    Object.defineProperty(Gameboard.prototype, "borders", {
        get: function () {
            return this._borders;
        },
        enumerable: true,
        configurable: true
    });
    //do I even need borders?
    Gameboard.prototype.inGrid = function (blockpos) {
        var inBounds;
        var tracker = 0; //tracks if inBounds was ever false
        for (var x = 0; x < this._size; x++) {
            for (var y = 0; y < this._height; y++) {
                for (var z = 0; z < this._size; z++) {
                    for (var i = 0; i < blockpos.length; i++) {
                        inBounds = this.compare(blockpos[i], x, y, z);
                        if (inBounds) { //WRONG must only be false if blockpos doesnt match ANY els in POS ARRAY
                            tracker++;
                        }
                        //if found one match, but others dont match any of positions
                    }
                }
            }
        }
        //if tracker (tracks when true) == blockpos.length (found matches for each element) -return true
        if (tracker === blockpos.length) {
            return true;
        }
        return false;
    };
    //to track position of a block 
    //in game: call updateSpaces whenever active block moves, when block collided/landed, or after layer cleared/shifted (landed arr)
    //cant move with collisions - changes positions, stops working if goes outside grid(no pos els/undef in compare, so all set to false)
    Gameboard.prototype.updateSpaces = function (position, active, landed) {
        //for each active block - set a parent: get positions of each child block/cube (centers)
        // check positions array, dep on mesh
        for (var x = 0; x < this._size; x++) {
            for (var y = 0; y < this._height; y++) {
                for (var z = 0; z < this._size; z++) {
                    //iterate through array of positions (active/landed cubes)
                    for (var i = 0; i < position.length; i++) {
                        //IF ACTIVE BLOCK -> SET POSITIONS TO NULL
                        if (active && this.compare(position[i], x, y, z) === true) {
                            this._spaces[x][y][z] = null; //null used so that whenever active block moves, doesnt reset landed trues
                            console.log(x, y, z);
                        }
                        //IF LANDED -> SET POSITIONS TO TRUE
                        if (landed && this.compare(position[i], x, y, z) === true) {
                            this._spaces[x][y][z] = true; //even if space was null before (block active then landed)
                        }
                    }
                    //compareMultiple checks if each position (param[]) is same as xyz element in this._positions
                    //if not, each position isnt occupied, so space can be reset to false
                    //if not equal to any positions of a block
                    if (active && this._spaces[x][y][z] === null && this.compareMultiple(position, x, y, z) === false) {
                        this._spaces[x][y][z] = false; //reset space that was previously null - occupied by active block
                    }
                    if (landed && this._spaces[x][y][z] === true && this.compareMultiple(position, x, y, z) === false) {
                        this._spaces[x][y][z] = false;
                    }
                    //do nothing if  block's position doesn't exist in positions array (out of grid, so ingrid=false)
                }
            }
        }
    };
    //is position of block same as in positions array?
    Gameboard.prototype.compare = function (position, x, y, z) {
        var match = this._positions[x][y][z].x === position.x && this._positions[x][y][z].y === position.y
            && this._positions[x][y][z].z === position.z;
        return match;
    };
    Gameboard.prototype.compareMultiple = function (position, x, y, z) {
        var match;
        var tracker = 0;
        //if match ever equal true, return true (at least once=true)
        for (var i = 0; i < position.length; i++) {
            match = this.compare(position[i], x, y, z);
            if (match) {
                tracker++;
            }
        }
        if (tracker > 0) {
            return true;
        }
        return false;
    };
    return Gameboard;
}());
var Blockx = /** @class */ (function () {
    function Blockx(cubeNum) {
        this._isActive = true; //true when block is falling (1st contructed), false when locked in
        //false if block not in grid (when first being spawned), true if in grid and falling
        this.positions = new Array(cubeNum);
        this.cubes = new Array(cubeNum - 1); //excluding parent cube
    }
    Blockx.prototype.createCube = function (ypos, xpos) {
        var cube = BABYLON.MeshBuilder.CreateBox("box", { size: 1 }, scene);
        cube.position.y = ypos; //5.5 or 6.5?, or higher?
        cube.position.x = xpos;
        cube = this.createEdges(cube);
        return cube;
    };
    Blockx.prototype.createEdges = function (cube) {
        cube.enableEdgesRendering();
        cube.edgesWidth = 5.0;
        cube.edgesColor = new BABYLON.Color4(0, 0, 0, 1); //black edges
        return cube;
    };
    Object.defineProperty(Blockx.prototype, "position", {
        get: function () {
            return this.parentCube.position; //may not be accurate for pivoted blocks - specific to each class?
        },
        enumerable: true,
        configurable: true
    });
    Blockx.prototype.rotate = function (rotation, axis) {
        if (this.type !== "big cube") {
            switch (axis) {
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
    };
    Blockx.prototype.becomeChild = function (cube) {
        cube = this.parentCube.createInstance("cube");
        cube = this.createEdges(cube);
        cube.parent = this.parentCube;
        return cube;
    };
    Blockx.prototype.uncouple = function () {
        //remove link between child and parent
        for (var i = 0; i < this.cubes.length; i++) {
            this.cubes[i].setParent(null); // example: this._cube2.setParent(null);
        }
    };
    Blockx.prototype.recouple = function () {
        //restore link between child and parent
        for (var i = 0; i < this.cubes.length; i++) {
            this.cubes[i].setParent(this.parentCube); //parent back
        }
    };
    Object.defineProperty(Blockx.prototype, "isActive", {
        get: function () {
            return this._isActive;
        },
        // public split(position: BABYLON.Vector3): void { //break apart a single cube from block
        //     //each cube that makes up block will uncouple - setParent(null)
        //     //detatch part of block
        //     //use this.positions
        // }
        // public removePosition() {} //for cascade method?^
        //public removeCube() {}
        set: function (state) {
            this._isActive = state; //used to turn off, set to false
        },
        enumerable: true,
        configurable: true
    });
    return Blockx;
}());
var BigTowerx = /** @class */ (function (_super) {
    __extends(BigTowerx, _super);
    function BigTowerx() {
        var _this = _super.call(this, 4) || this;
        _this.create();
        _this.setCubes();
        return _this;
    }
    BigTowerx.prototype.create = function () {
        this.parentCube = this.createCube(3.5, 0);
        var mat = new BABYLON.StandardMaterial("mat", scene);
        mat.diffuseColor = new BABYLON.Color3(0, 0.5, 0.5);
        mat.emissiveColor = new BABYLON.Color3(0.5, 1, 0.2); //green
        this.parentCube.material = mat;
        this.parentCube.material.backFaceCulling = false;
        // this._cube2 = this.parentCube.createInstance("cube2");
        // this._cube2 = this.createEdges(this._cube2);
        this._cube2 = this.becomeChild(this._cube2);
        this._cube2.position.y = 2;
        this._cube3 = this.becomeChild(this._cube3);
        this._cube3.position.y = 1;
        this._cube4 = this.becomeChild(this._cube4);
        this._cube4.position.y = -1;
    };
    BigTowerx.prototype.getPositions = function () {
        this.setPositions();
        return this.positions;
    };
    BigTowerx.prototype.setPositions = function () {
        this.uncouple();
        this.positions = [this.parentCube.position, this._cube2.position, this._cube3.position, this._cube4.position];
        //before uncoupling: instanced meshes give positions relative to parent! CHANGED
    };
    BigTowerx.prototype.setCubes = function () {
        this.cubes = [this._cube2, this._cube3, this._cube4];
    };
    return BigTowerx;
}(Blockx));
var BigCubex = /** @class */ (function (_super) {
    __extends(BigCubex, _super);
    function BigCubex() {
        var _this = _super.call(this, 8) || this;
        _this.type = "big cube";
        _this.create();
        _this.setCubes();
        return _this;
    }
    BigCubex.prototype.create = function () {
        this.parentCube = this.createCube(4.5, -1); //offset position - parent: bottom,left,front cube
        var mat = new BABYLON.StandardMaterial("mat", scene);
        mat.diffuseColor = new BABYLON.Color3(0.2, 0.28, 1);
        mat.emissiveColor = new BABYLON.Color3(0.2, 0.28, 1); //dark blue
        this.parentCube.material = mat;
        this.parentCube.material.backFaceCulling = false;
        this._cube2 = this.becomeChild(this._cube2);
        this._cube2.position = new BABYLON.Vector3(0, 0, 1); //bottom,left,back
        this._cube3 = this.becomeChild(this._cube3);
        this._cube3.position = new BABYLON.Vector3(1, 0, 1); //bottom,right,back
        this._cube4 = this.becomeChild(this._cube4);
        this._cube4.position = new BABYLON.Vector3(1, 0, 0); //bottom,right,front
        this._cube5 = this.becomeChild(this._cube5);
        this._cube5.position = new BABYLON.Vector3(0, 1, 0); //top,left,front
        this._cube6 = this.becomeChild(this._cube6);
        this._cube6.position = new BABYLON.Vector3(0, 1, 1); //top,left,back
        this._cube7 = this.becomeChild(this._cube7);
        this._cube7.position = new BABYLON.Vector3(1, 1, 1); //top,right,back
        this._cube8 = this.becomeChild(this._cube8);
        this._cube8.position = new BABYLON.Vector3(1, 1, 0); //top,rightfront
    };
    BigCubex.prototype.getPositions = function () {
        this.setPositions();
        return this.positions;
    };
    BigCubex.prototype.setPositions = function () {
        this.uncouple();
        this.positions = [this.parentCube.position, this._cube2.position, this._cube3.position, this._cube4.position,
            this._cube5.position, this._cube6.position, this._cube7.position, this._cube8.position];
        // this.recouple();
    };
    BigCubex.prototype.setCubes = function () {
        this.cubes = [this._cube2, this._cube3, this._cube4, this._cube5, this._cube6, this._cube7, this._cube8];
    };
    return BigCubex;
}(Blockx));
var ZBlockx = /** @class */ (function (_super) {
    __extends(ZBlockx, _super);
    function ZBlockx() {
        var _this = _super.call(this, 4) || this;
        _this.type = "z block";
        _this.create();
        _this.setCubes();
        return _this;
    }
    ZBlockx.prototype.create = function () {
        this.parentCube = this.createCube(3.5, 0); //bottom middle
        var mat = new BABYLON.StandardMaterial("mat", scene);
        mat.diffuseColor = BABYLON.Color3.Purple();
        mat.emissiveColor = new BABYLON.Color3(0.4, 0.28, 0.8); //purple
        this.parentCube.material = mat;
        this.parentCube.material.backFaceCulling = false;
        this._cube2 = this.becomeChild(this._cube2);
        this._cube2.position = new BABYLON.Vector3(1, 0, 0); //right, bottom
        this._cube3 = this.becomeChild(this._cube3);
        this._cube3.position = new BABYLON.Vector3(0, 1, 0); //middle, top
        this._cube4 = this.becomeChild(this._cube4);
        this._cube4.position = new BABYLON.Vector3(-1, 1, 0); //left, top
    };
    ZBlockx.prototype.getPositions = function () {
        this.setPositions();
        return this.positions;
    };
    ZBlockx.prototype.setPositions = function () {
        this.uncouple();
        this.positions = [this.parentCube.position, this._cube2.position, this._cube3.position, this._cube4.position];
    };
    ZBlockx.prototype.setCubes = function () {
        this.cubes = [this._cube2, this._cube3, this._cube4];
    };
    return ZBlockx;
}(Blockx));
var BigLx = /** @class */ (function (_super) {
    __extends(BigLx, _super);
    function BigLx() {
        var _this = _super.call(this, 4) || this;
        _this.type = "big l";
        _this.create();
        _this.setCubes();
        return _this;
    }
    BigLx.prototype.create = function () {
        this.parentCube = this.createCube(4.5, 0); //middle, bottom cube
        var mat = new BABYLON.StandardMaterial("mat", scene);
        mat.diffuseColor = new BABYLON.Color3(0.4, 0.28, 1);
        mat.emissiveColor = new BABYLON.Color3(1, 0.28, 1); //pink
        this.parentCube.material = mat;
        this.parentCube.material.backFaceCulling = false;
        this._cube2 = this.becomeChild(this._cube2);
        this._cube2.position = new BABYLON.Vector3(-1, 0, 0); //left, bottom
        this._cube3 = this.becomeChild(this._cube3);
        this._cube3.position = new BABYLON.Vector3(-1, 1, 0); //left, top
        this._cube4 = this.becomeChild(this._cube4);
        this._cube4.position = new BABYLON.Vector3(1, 0, 0); //right, bottom
    };
    BigLx.prototype.getPositions = function () {
        this.setPositions();
        return this.positions;
    };
    BigLx.prototype.setPositions = function () {
        this.uncouple();
        this.positions = [this.parentCube.position, this._cube2.position, this._cube3.position, this._cube4.position];
    };
    BigLx.prototype.setCubes = function () {
        this.cubes = [this._cube2, this._cube3, this._cube4];
    };
    return BigLx;
}(Blockx));
var Cubex = /** @class */ (function (_super) {
    __extends(Cubex, _super);
    function Cubex() {
        var _this = _super.call(this, 1) || this;
        _this.type = "cube";
        _this.create();
        return _this;
    }
    Cubex.prototype.create = function () {
        this.parentCube = this.createCube(5.5, 0);
        var mat = new BABYLON.StandardMaterial("mat", scene);
        mat.diffuseColor = new BABYLON.Color3(0.6, 0.6, 0);
        mat.emissiveColor = BABYLON.Color3.Yellow();
        this.parentCube.material = mat;
        this.parentCube.material.backFaceCulling = false;
    };
    //retrieve positions at a given time - whenever updateSpaces in Game is called
    Cubex.prototype.getPositions = function () {
        this.setPositions();
        return this.positions;
    };
    Cubex.prototype.setPositions = function () {
        this.positions[0] = this.parentCube.position;
        //this.positions = [this.parentCube.position];
    };
    return Cubex;
}(Blockx));
var MiniLx = /** @class */ (function (_super) {
    __extends(MiniLx, _super);
    function MiniLx() {
        var _this = _super.call(this, 3) || this;
        _this.type = "mini l";
        _this.create();
        _this.setCubes();
        return _this;
    }
    MiniLx.prototype.create = function () {
        this.parentCube = this.createCube(4.5, -1); //left-most, top
        var mat = new BABYLON.StandardMaterial("mat", scene);
        mat.diffuseColor = new BABYLON.Color3(1, 0.2, 0.3);
        mat.emissiveColor = new BABYLON.Color3(1, 0.2, 0.3); //light red
        this.parentCube.material = mat;
        this.parentCube.material.backFaceCulling = false;
        this._cube2 = this.becomeChild(this._cube2);
        this._cube2.position = new BABYLON.Vector3(0, -1, 0); //left-most, bottom
        this._cube3 = this.becomeChild(this._cube2);
        this._cube3.position = new BABYLON.Vector3(1, 0, 0); //right, top
    };
    MiniLx.prototype.getPositions = function () {
        this.setPositions();
        return this.positions;
    };
    MiniLx.prototype.setPositions = function () {
        this.uncouple();
        this.positions = [this.parentCube.position, this._cube2.position, this._cube3.position];
    };
    MiniLx.prototype.setCubes = function () {
        this.cubes = [this._cube2, this._cube3];
    };
    return MiniLx;
}(Blockx));
var ShortTowerx = /** @class */ (function (_super) {
    __extends(ShortTowerx, _super);
    // private _dummypos: BABYLON.Vector3[]; 
    function ShortTowerx() {
        var _this = _super.call(this, 3) || this;
        _this.type = "short tower";
        _this.create();
        _this.setCubes();
        return _this;
    }
    ShortTowerx.prototype.create = function () {
        this.parentCube = this.createCube(4.5, 0);
        var mat = new BABYLON.StandardMaterial("mat", scene);
        mat.diffuseColor = new BABYLON.Color3(0, 1, 1);
        mat.emissiveColor = new BABYLON.Color3(0, 1, 1); //light blue
        this.parentCube.material = mat;
        this.parentCube.material.backFaceCulling = false;
        this._cube2 = this.becomeChild(this._cube2);
        this._cube2.position.y = 1; //position relative to parent
        this._cube3 = this.becomeChild(this._cube3);
        this._cube3.position.y = -1;
    };
    ShortTowerx.prototype.getPositions = function () {
        this.setPositions();
        return this.positions;
    };
    ShortTowerx.prototype.setPositions = function () {
        //1st element stores parent block's pos:
        this.uncouple();
        this.positions = [this.parentCube.position, this._cube2.position, this._cube3.position];
        // this.recouple(); //MUST RECOUPLE OUTSIDE OF BLOCK CLASSES, WHENEVER GETPOSITIONS IS CALLED AND PASSED INTO UPDATE SPACES
    };
    ShortTowerx.prototype.setCubes = function () {
        this.cubes = [this._cube2, this._cube3];
    };
    return ShortTowerx;
}(Blockx));
var TBlockx = /** @class */ (function (_super) {
    __extends(TBlockx, _super);
    function TBlockx() {
        var _this = _super.call(this, 4) || this;
        _this.type = "t block";
        _this.create();
        _this.setCubes();
        return _this;
    }
    TBlockx.prototype.create = function () {
        this.parentCube = this.createCube(4.5, 0); //middle, bottom
        var mat = new BABYLON.StandardMaterial("mat", scene);
        mat.diffuseColor = new BABYLON.Color3(0.7, 0.5, 0);
        mat.emissiveColor = new BABYLON.Color3(0.7, 0.3, 0); //orange
        this.parentCube.material = mat;
        this.parentCube.material.backFaceCulling = false;
        this._cube2 = this.becomeChild(this._cube2);
        this._cube2.position = new BABYLON.Vector3(-1, 0, 0); //left, bottom
        this._cube3 = this.becomeChild(this._cube3);
        this._cube3.position = new BABYLON.Vector3(1, 0, 0); //right, bottom
        this._cube4 = this.becomeChild(this._cube4);
        this._cube4.position = new BABYLON.Vector3(0, 1, 0); //middle, top
    };
    TBlockx.prototype.getPositions = function () {
        this.setPositions();
        return this.positions;
    };
    TBlockx.prototype.setPositions = function () {
        this.uncouple();
        this.positions = [this.parentCube.position, this._cube2.position, this._cube3.position, this._cube4.position];
    };
    TBlockx.prototype.setCubes = function () {
        this.cubes = [this._cube2, this._cube3, this._cube4];
    };
    return TBlockx;
}(Blockx));
var createScene = function () {
    var scene = new BABYLON.Scene(engine);
    scene.clearColor = new BABYLON.Color4(0, 0, 0, 0);
    var camera = new BABYLON.ArcRotateCamera("Camera", -Math.PI / 2, Math.PI / 3.3, 18.4, new BABYLON.Vector3(0, 0, 0), scene);
    camera.attachControl(canvas, true);
    var light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);
    light.intensity = 1;
    var box = BABYLON.MeshBuilder.CreateBox("box", { size: 1 }, scene);
    box.position.y = 6.5;
    var mat = new BABYLON.StandardMaterial("mat", scene);
    mat.diffuseColor = new BABYLON.Color3(0.6, 0.6, 0);
    mat.emissiveColor = BABYLON.Color3.Yellow();
    // mat.emissiveColor = new BABYLON.Color3(0, 1, 0); //green
    box.material = mat;
    box.material.backFaceCulling = false; //need emissive color to see backface
    //use edges renderer to distinguish between boxes
    box.enableEdgesRendering();
    box.edgesWidth = 5.0;
    box.edgesColor = new BABYLON.Color4(0, 0, 0, 1);
    box.visibility = 0;
    // var box2 = BABYLON.MeshBuilder.CreateBox("box2", {size: 1}, scene);
    // box2.material = mat;
    // box2.material.backFaceCulling = false; //need emissive color to see backface
    // //use edges renderer to distinguish between boxes
    // box2.enableEdgesRendering();
    // box2.edgesWidth = 5.0;
    // box2.edgesColor = new BABYLON.Color4(0, 0, 0, 1);
    // var box3 = box.createInstance("box3");
    // // var box2 = box.createInstance("box2");
    // box3.enableEdgesRendering();
    // box3.edgesWidth = 5.0;
    // // box2.parent = box;
    // // box2.position.y = -1;
    // box3.parent = box;
    // box3.position.y = 1; //pos relative to parent
    var gameboard = new Gameboard(7);
    // var cube = new cubex();
    // var zb = new Shorttower();
    // var zb = new BigTowerx(); //set parent cube to top cube?? g
    // var zb = new BigCubex();
    // var bl = new BigLx();
    // var ml = new MiniLx();
    // var zb = new TBlockx();
    var zb = new ZBlockx(); //move up?
    console.log(zb.getPositions()); //doesnt print out actual pos of child cubes, only those relative to parent
    gameboard.updateSpaces(zb.getPositions(), true, false);
    zb.recouple();
    console.log(gameboard.inGrid(zb.getPositions())); //returned false for t-block with recouple instead of uncouple
    zb.recouple();
    var ground = gameboard.ground;
    var fplane = gameboard.fplane;
    var bplane = gameboard.bplane;
    var rplane = gameboard.rplane;
    var lplane = gameboard.lplane;
    var spaces = gameboard.spaces;
    console.log(box.position);
    console.log(spaces);
    console.log(gameboard.positions);
    console.log(gameboard.borders);
    var colpt;
    var collided = false;
    var onCollide = function () {
        console.log("onEntry");
        mat.emissiveColor = new BABYLON.Color3(0, 0, 0);
        colpt = box.position;
        collided = true;
    };
    var disableW = false;
    var disableS = false;
    var disableD = false;
    var disableA = false;
    var onPlane = function () {
        console.log('onPlane');
        mat.emissiveColor = new BABYLON.Color3(1, 1, 1);
        //compare pos of block to plane - if x or z = 3 or -3 -> Math.floor(size/2)
        //if x = 3 (hits rplane), disable right ; if x = -3 (hits lplane), disable left; 
        //can go front and back, but right still disabled (if at x=3)
        //if z = 3 (hits bplane), disable forward; if z = -3 (hits fplane), disable back
        // disableS = true; //forfplane
    };
    var offPlane = function () {
        console.log('offPlane');
        mat.emissiveColor = new BABYLON.Color3(1, 1, 1);
        // disableS = false; //reset //for fplane
    };
    var onBlock = function () {
        console.log('onBlock');
        // compare activeblock.position.y, z, and x with Block 
    };
    box.actionManager = new BABYLON.ActionManager(scene);
    //raised when box intersects with ground (raised once - checks for colpt once)
    box.actionManager.registerAction(new BABYLON.ExecuteCodeAction({ trigger: BABYLON.ActionManager.OnIntersectionEnterTrigger, parameter: ground }, onCollide));
    box.actionManager.registerAction(new BABYLON.ExecuteCodeAction({ trigger: BABYLON.ActionManager.OnIntersectionEnterTrigger, parameter: fplane }, onPlane //do for each plane?
    ));
    box.actionManager.registerAction(new BABYLON.ExecuteCodeAction({ trigger: BABYLON.ActionManager.OnIntersectionExitTrigger, parameter: fplane }, //turn off on entry enter action temp?
    offPlane));
    // box.actionManager.registerAction(new BABYLON.ExecuteCodeAction(
    // 	{trigger: BABYLON.ActionManager.OnIntersectionEnterTrigger, parameter: /*any Block*/}, //iterate through array
    // 	onCollide //??
    // ));
    //action manager for intersec w/any block?? or use spaces array....
    //motions
    var rotation = Math.PI / 2;
    scene.onKeyboardObservable.add(function (kbInfo) {
        if (collided) {
            box.position = colpt;
            //collided = false; //reset once block landed
        }
        else {
            switch (kbInfo.type) {
                case BABYLON.KeyboardEventTypes.KEYDOWN:
                    switch (kbInfo.event.key) {
                        case "a": //left
                            zb.position.x -= 1;
                            break;
                        case "d": //right
                            zb.position.x += 1;
                            break;
                        case "w": //forward
                            zb.position.z += 1;
                            break;
                        case "s": //backward
                            zb.position.z -= 1;
                            break;
                        case " ": //down
                            zb.position.y -= 1;
                            console.log(box.position);
                            break;
                        case "z":
                            // box.rotate(BABYLON.Axis.X, rotation, BABYLON.Space.WORLD); //rotate child 1st to se if it intersects?
                            zb.rotate(rotation, "x");
                            console.log("rotating");
                            break;
                        case "x":
                            // box.rotate(BABYLON.Axis.Y, -rotation, BABYLON.Space.WORLD);
                            zb.rotate(rotation, "y");
                            break;
                        case "c":
                            // box.rotate(BABYLON.Axis.Z, -rotation, BABYLON.Space.WORLD); 
                            zb.rotate(rotation, "z");
                            break;
                    }
                    // gameboard.updateSpaces([box.position], true, false);
                    // console.log(gameboard.positions[0][0][0]);
                    console.log(gameboard.spaces);
                    console.log(box.position);
                    break;
            }
        }
    });
    return scene;
};
//host:
var canvas = document.getElementById("renderCanvas");
var engine = new BABYLON.Engine(canvas, true);
window.addEventListener("resize", function () {
    engine.resize();
});
var scene = createScene();
engine.runRenderLoop(function () {
    scene.render();
});
//# sourceMappingURL=classtesting.js.map