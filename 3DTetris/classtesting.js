var Gameboard = /** @class */ (function () {
    // cameraCalib: number; //dep on size
    function Gameboard(size) {
        this._size = size;
        this.create();
        this.fillSpaces();
        this.fillPositions();
        this.fillBorders();
    }
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
        grid.opacity = 0.8;
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
    Object.defineProperty(Gameboard.prototype, "ground", {
        get: function () {
            return this._ground;
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
    //to track position of a block
    //in game: call updateSpaces whenever active block moves, when block collided/landed, or after layer cleared/shifted (landed arr)
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
                            console.log(x, y, z, i);
                        }
                        //IF LANDED -> SET POSITIONS TO TRUE
                        if (landed && this.compare(position[i], x, y, z) === true) {
                            this._spaces[x][y][z] = true; //even if space was null before (block active then landed)
                        }
                    }
                    //compareMultiple checks if each position (param[]) is same as xyz element in this._positions
                    //if not, each position isnt occupied, so space can be reset to false
                    if (active && this._spaces[x][y][z] === null && this.compareMultiple(position, x, y, z) === false) {
                        this._spaces[x][y][z] = false; //reset space that was previously null - occupied by active block
                    }
                    if (landed && this._spaces[x][y][z] === true && this.compareMultiple(position, x, y, z) === false) {
                        this._spaces[x][y][z] = false;
                    }
                }
            }
        }
    };
    //is position of block same as in positions array?
    Gameboard.prototype.compare = function (position, x, y, z) {
        var match = this._positions[x][y][z].x === position.x &&
            this._positions[x][y][z].y === position.y && this._positions[x][y][z].z === position.z;
        return match;
    };
    Gameboard.prototype.compareMultiple = function (position, x, y, z) {
        var match;
        for (var i = 0; i < position.length; i++) {
            match = this.compare(position[i], x, y, z);
        }
        return match;
    };
    return Gameboard;
}());
var createScene = function () {
    var scene = new BABYLON.Scene(engine);
    scene.clearColor = new BABYLON.Color4(0, 0, 0, 0);
    var camera = new BABYLON.ArcRotateCamera("Camera", -Math.PI / 2, Math.PI / 3.3, 18.4, new BABYLON.Vector3(0, 0, 0), scene);
    camera.attachControl(canvas, true);
    var light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);
    light.intensity = 1;
    var box = BABYLON.MeshBuilder.CreateBox("box", { size: 1 }, scene);
    box.position.y = 5.5;
    var mat = new BABYLON.StandardMaterial("mat", scene);
    mat.emissiveColor = new BABYLON.Color3(0, 1, 1);
    box.material = mat;
    box.material.backFaceCulling = false; //need emissive color to see backface
    //use edges renderer to distinguish between boxes
    box.enableEdgesRendering();
    box.edgesWidth = 5.0;
    box.edgesColor = new BABYLON.Color4(0, 0, 0, 1);
    var gameboard = new Gameboard(7);
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
    // 	onBlock
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
                            box.position.x -= 1;
                            break;
                        case "d": //right
                            box.position.x += 1;
                            break;
                        case "w": //forward
                            box.position.z += 1;
                            break;
                        case "s": //backward
                            box.position.z -= 1;
                            break;
                        case " ": //down
                            box.position.y -= 1;
                            console.log(box.position);
                            break;
                        case "z":
                            box.rotate(BABYLON.Axis.X, rotation, BABYLON.Space.WORLD);
                            break;
                        case "x":
                            box.rotate(BABYLON.Axis.Y, -rotation, BABYLON.Space.WORLD);
                            break;
                        case "c":
                            box.rotate(BABYLON.Axis.Z, -rotation, BABYLON.Space.WORLD);
                            break;
                    }
                    gameboard.updateSpaces([box.position], true, false);
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