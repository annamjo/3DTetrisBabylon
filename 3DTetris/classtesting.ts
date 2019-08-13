class Gameboard {
    private _size: number;
    private _height: number;
    private _ground: BABYLON.Mesh;
    private _spaces: any[]; //number[] //or BABYLON.Vector3, each square of grid - pos in gameboard
    private _positions: any[];
    //2d/3d array
    // cameraCalib: number; //dep on size
    //private _borders: any[];

    constructor(size: number) {
        this._size = size;
        // this._spaces = new Array(size);
        this.create();
        this.fillSpaces();
        this.fillPositions();
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

    private createGrid(): BABYLON.GridMaterial {
        var grid = new BABYLON.GridMaterial("grid", scene);
        grid.lineColor = BABYLON.Color3.White();
        grid.majorUnitFrequency = 1;
        grid.opacity = 0.8; 
        grid.gridOffset = new BABYLON.Vector3(0.5, 0, 0.5);
        return grid;
    }

    private createPlane(x: number, y: number, z: number, rotation: number): BABYLON.Mesh {
        this._height = (this._size === 7) ? 12 : 10; //12 if 7, 10 if 5 (default)
        var plane = BABYLON.MeshBuilder.CreatePlane("plane", {height: this._height, width: this._size}, scene);
        plane.position.x = x;
        plane.position.y = y;
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
    
    private fillSpaces(): void { //1 square longer each dim (always set to true - occupied)
        
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
    }

    public get spaces(): any[] {
        return this._spaces;
    }

    // positionToSpace(position: BABYLON.Vector3) { //to set space = true (occupied) //in block class - manipulate pos in game (func calls in game?)
    //     var x = position.x;
    //     var y = position.y;
    //     var z = position.z;
    //vector subtraction

    //     return 
    // }

    //find position of each space - calculate once (to compare to block's position): space->position
    private fillPositions(): void { //connect each grid space/square to a position
        //define an origin vector:
        //for odd size and even height, shifted 0.5 up y
        var origin = new BABYLON.Vector3(-Math.floor(this._size/2), (this._height/2)-0.5, Math.floor(this._size/2)); //x, y, z at [0][0][0]
        var xpos = origin.x;
        var ypos = origin.y;
        var zpos = origin.z;

        //y +=1 ->down y coord; z+=1 -> down z coord; x+=1->up 1 x coord
        var positions = new Array(this._size); //array of babylon vectors?
        for (var x = 0; x < this._size; x++) {
            positions[x] = new Array(this._height);
            for (var y = 0; y < this._height; y++) {
                positions[x][y] = new Array(this._size)
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
    }

    public get positions(): any[] {
        return this._positions;
    }

    updateSpaces() { //if block moved/rotated/while falling

    }

    isSpaceOccupied() {
        
    }

    isLayerFull() { //isActiveBlock? - check layer after a block locks into place
        //is bottom-most layer full of blocks?
        //check if each array space = true
    }

    // public get borders(): any[] {
    //     return this._borders;
    // }



    //doesblock fit in? (next block, current block)
    //collapse layer, is layer full?
}


var createScene = function () {

    var scene = new BABYLON.Scene(engine);
    scene.clearColor = new BABYLON.Color4(0, 0, 0, 0);

    var camera = new BABYLON.ArcRotateCamera("Camera", -Math.PI/2, Math.PI/3.3, 18.4, new BABYLON.Vector3(0, 0, 0), scene);
    camera.attachControl(canvas, true);

    var light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);
    light.intensity = 1;

    var box = BABYLON.MeshBuilder.CreateBox("box", {size: 1}, scene);
    box.position.y = 5.5;
    // box.position = new BABYLON.Vector3(0,0,0)

    var mat = new BABYLON.StandardMaterial("mat", scene);
    box.material = mat;

    var gameboard = new Gameboard(7);
    var ground = gameboard.ground;
    var spaces = gameboard.spaces;
    console.log(spaces);
     
    var pt = new BABYLON.Vector3();
    
    //motions
    var rotation = Math.PI / 2;
    scene.onKeyboardObservable.add((kbInfo) => { 
        switch (kbInfo.type) {
            case BABYLON.KeyboardEventTypes.KEYDOWN:
                switch (kbInfo.event.key) {
                    case "a":
                        box.position.x -= 1;
                    break;

                    case "d":
                        box.position.x += 1;
                    break;

                    case "w":
                        box.position.z += 1;
                    break;

                    case "s":
                        box.position.z -= 1;
                    break;

                    case " ":
                        box.position.y -= 1;
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
                console.log(box.position);
            break;
        }
    });
    return scene;
};

//host:
var canvas = document.getElementById("renderCanvas") as HTMLCanvasElement;
var engine = new BABYLON.Engine(canvas, true);

window.addEventListener("resize", () => {
    engine.resize();
});

var scene = createScene();

engine.runRenderLoop(() => { 
    scene.render();
});