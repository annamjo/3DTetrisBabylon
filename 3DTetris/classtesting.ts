class Gameboard {
    private _size: number;
    private _height: number;
    private _ground: BABYLON.Mesh;
    private _spaces: any[];
    private _positions: any[];
    private _borders: any[];
    // cameraCalib: number; //dep on size

    constructor(size: number) {
        this._size = size;
        this.create();
        this.fillSpaces();
        this.fillPositions();
        this.fillBorders();
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
    
    private fillSpaces(): void { 
        
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

    public updateSpaces(): void { //if block moved/rotated/while falling

    }

    public get spaces(): any[] {
        return this._spaces;
    }

    private fillPositions(): void {
        // define an origin vector: //x, y, z at [0][0][0]
        // for odd size and even height, shifted 0.5 up y

        var origin = new BABYLON.Vector3(-Math.floor(this._size/2), (this._height/2)-0.5, Math.floor(this._size/2));

        //y +=1 -> down y coord; z+=1 -> down z coord; x+=1 -> up 1 x coord
        var positions = new Array(this._size);
        var xpos = origin.x;

        for (var x = 0; x < this._size; x++) {
            positions[x] = new Array(this._height);
            var ypos = origin.y;

            for (var y = 0; y < this._height; y++) {
                positions[x][y] = new Array(this._size)
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
    }

    public updatePositions(): void {

    }

    public get positions(): any[] {
        return this._positions;
    }

    private fillBorders() { //1 grid square longer all around x & z axis
        var borderSize = this._size + 2;
        var borders = new Array(borderSize);
        
        for (var x = 0; x < borderSize; x++) {
            borders[x] = new Array(this._height);

            for (var y = 0; y < this._height; y++) {
                borders[x][y] = new Array(borderSize);

                for (var z = 0; z < borderSize; z++) {
                    if (x === 0 || x === borderSize-1 || z===0 || z === borderSize-1) {
                        borders[x][y][z] = true; //border space is occupied
                        //unoccuppied space in grid - empty
                    }
                }
            }
        }

        this._borders = borders;
    }

    public get borders(): any[] {
        return this._borders;
    }

    //find position of each space - calculate once (to compare to block's position): space->position
    public isSpaceOccupied(): boolean { //loop through positions of board+block, then loop through and change spaces
        //check positions array, each filled position matched w/corresponding space, check space boolean value, return true if space=true
        //positions -> spaces: 
        return true;
    } 

    isLayerFull(): boolean { //isActiveBlock? - check layer after a block locks into place
        //is bottom-most layer full of blocks?
        //check if each array space = true
        //collapse layer
        return true;
    }

    collapseLayer(): void {
        var layerFull = this.isLayerFull();
        //
    }

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
    console.log(gameboard.positions);
    console.log(gameboard.borders);
     
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