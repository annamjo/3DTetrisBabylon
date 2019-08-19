class Gameboard {
    private _size: number;
    private _height: number;
    private _ground: BABYLON.Mesh;
    private _fplane: BABYLON.Mesh;
    private _bplane: BABYLON.Mesh;
    private _rplane: BABYLON.Mesh;
    private _lplane: BABYLON.Mesh;
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
        this._fplane = fplane;
        this._bplane = bplane;

        //right & left planes
        var rplane = this.createPlane(this._size/2, 0, 0, Math.PI / 2);
        var lplane = this.createPlane(-this._size/2, 0, 0, -Math.PI/2);
        this._rplane = rplane;
        this._lplane = lplane;
    }

    private createGrid(): BABYLON.GridMaterial {
        var grid = new BABYLON.GridMaterial("grid", scene);
        grid.lineColor = BABYLON.Color3.White();
        grid.majorUnitFrequency = 1;
        grid.opacity = 0.85; 
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

    public get size(): number {
        return this._size;
    }

    public get height(): number {
        return this._height;
    }

    public get ground(): BABYLON.Mesh {
        return this._ground;
    }

    public get fplane(): BABYLON.Mesh {
        return this._fplane;
    }

    public get bplane(): BABYLON.Mesh {
        return this._bplane;
    }

    public get rplane(): BABYLON.Mesh {
        return this._rplane;
    }
    
    public get lplane(): BABYLON.Mesh {
        return this._lplane;
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

    public get spaces(): any[] {
        return this._spaces;
    }

    private fillPositions(): void { //called only once (in constructor)
        // define an origin vector: //x, y, z at [0][0][0]
        // for odd size and even height, shifted 0.5 up y

        var origin = new BABYLON.Vector3(-Math.floor(this._size/2), (this._height/2)-0.5, Math.floor(this._size/2));

        // y+=1 -> down y coord; z+=1 -> down z coord; x+=1 -> up 1 x coord
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
                    if (x === 0 || x === borderSize-1 || z === 0 || z === borderSize-1) {
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

    //do I even need borders?
    public inGrid(blockpos: BABYLON.Vector3[]): boolean { //pass in block's position array, use for dummy
        var inBounds: boolean;
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
    }

    //to track position of a block 
    //in game: call updateSpaces whenever active block moves, when block collided/landed, or after layer cleared/shifted (landed arr)
    //cant move with collisions - changes positions, stops working if goes outside grid(no pos els/undef in compare, so all set to false)
    public updateSpaces(position: BABYLON.Vector3[], active: boolean, landed: boolean): void { 
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
    }

    //is position of block same as in positions array?
    private compare(position: BABYLON.Vector3, x: number, y: number, z: number): boolean {
        var match = this._positions[x][y][z].x === position.x && this._positions[x][y][z].y === position.y 
                    && this._positions[x][y][z].z === position.z;
        return match;
    }

    private compareMultiple(position: BABYLON.Vector3[], x: number, y: number, z: number): boolean {
        var match: boolean;
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
    }

    //doesblock fit in? (next block, current block) - just use collisions? - would need potential positions
}
class Blockx {
    private _isActive: boolean;
    public positions: BABYLON.Vector3[];
    public parentCube: BABYLON.Mesh; //parent cube
    public cubes: BABYLON.Mesh[]; //child cubes - for uncoupling/recoupling
    public type: string; //type or name of block

    constructor(cubeNum: number) {
        this._isActive = true; //true when block is falling (1st contructed), false when locked in
        //false if block not in grid (when first being spawned), true if in grid and falling
        this.positions = new Array(cubeNum);
        this.cubes = new Array(cubeNum - 1); //excluding parent cube
    }

    public createCube(ypos: number, xpos:number): BABYLON.Mesh { //for use in subclasses - to use as clones
        var cube = BABYLON.MeshBuilder.CreateBox("box", {size: 1}, scene);
        cube.position.y = ypos; //5.5 or 6.5?, or higher?
        cube.position.x = xpos;
        cube = this.createEdges(cube);

        return cube;
    }

    private createEdges(cube: any): any { //for meshes && instanced meshes
        cube.enableEdgesRendering();
        cube.edgesWidth = 5.0;
        cube.edgesColor = new BABYLON.Color4(0, 0, 0, 1); //black edges
        return cube;
    }

    public get position(): BABYLON.Vector3 { //position of block based on parent block, used for moving
        return this.parentCube.position; //may not be accurate for pivoted blocks - specific to each class?
    }

    public rotate(axis: string): void  { //if hasPivot - rotate around pivot instead (parent sphere)
        var rotation = Math.PI / 2;
        if (this.type !== "big cube") {
            switch(axis) {
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
    }

    public becomeChild(cube: BABYLON.Mesh): BABYLON.Mesh {
        // cube = this.parentCube.createInstance("cube");
        cube = this.parentCube.clone();
        cube = this.createEdges(cube);
        // cube.parent = this.parentCube;
        return cube;
    }

    public uncouple(): void { //use for loop? in block class? based on pos.length? use for getpositions
        //remove link between child and parent
        for (var i = 0; i < this.cubes.length; i++) {
            this.cubes[i].setParent(null); // example: this._cube2.setParent(null);
        }
    }

    public recouple(): void { //only use to track positions and active (if inactive doesnt need to recouple)
        //restore link between child and parent
        for (var i = 0; i < this.cubes.length; i++) {
            this.cubes[i].setParent(this.parentCube); //parent back
        }
    }

    // public split(position: BABYLON.Vector3): void { //break apart a single cube from block
    //     //each cube that makes up block will uncouple - setParent(null)
    //     //detatch part of block
    //     //use this.positions
    // }

    // public removePosition() {} //for cascade method?^

    //public removeCube() {}

    public set isActive(state: boolean) {
        this._isActive = state; //used to turn off, set to false
    }
    
    public get isActive(): boolean { //to access and set
        return this._isActive;
    }
}

class BigTowerx extends Blockx {
    private _cube2: BABYLON.Mesh;
    private _cube3: BABYLON.Mesh;
    private _cube4: BABYLON.Mesh;
    // private _pivot: BABYLON.Mesh;

    constructor() {
        super(4);
        this.create();
        this.setCubes();
    }

    private create(): void {
        this.parentCube = this.createCube(5.5, 0); //2nd cube from bottom

        var mat = new BABYLON.StandardMaterial("mat", scene);
        mat.diffuseColor = new BABYLON.Color3(0, 0.5, 0.5);
        mat.emissiveColor = new BABYLON.Color3(0.5, 1, 0.2); //green
        this.parentCube.material = mat;
        this.parentCube.material.backFaceCulling = false;

        // this._cube2 = this.parentCube.createInstance("cube2");
        // this._cube2 = this.createEdges(this._cube2);
        this._cube2 = this.becomeChild(this._cube2);
        this._cube3 = this.becomeChild(this._cube3);
        this._cube4 = this.becomeChild(this._cube4);

        this._cube2.parent = this.parentCube;
        this._cube2.position.y = 2;
        
        this._cube3.parent = this.parentCube;
        this._cube3.position.y = 1;

        this._cube4.parent = this.parentCube;
        this._cube4.position.y = -1;
    }

    // private setPivot() {
    //     this._pivot = BABYLON.MeshBuilder.CreateBox("box", {size: 0.05}, scene);
    //     this._pivot.visibility = 0;
    //     this._pivot.position.y = this.parentCube.position.y + 0.5;
    //     this._pivot.position.z = this.parentCube.position.z + 0.5;
    //     this.parentCube.setParent(this._pivot);
    // }

    // public rotate(axis: string): void {
    //     this.setPivot();
    //     var rotation = Math.PI / 2;
    //     switch(axis) {
    //         case "x":
    //             this._pivot.rotate(BABYLON.Axis.X, rotation, BABYLON.Space.WORLD);
    //             break;
    //         case "y":
    //             this._pivot.rotate(BABYLON.Axis.Y, -rotation, BABYLON.Space.WORLD);
    //             break;
    //         case "z":
    //             this._pivot.rotate(BABYLON.Axis.Z, -rotation, BABYLON.Space.WORLD);
    //             break;
    //     }
    //     // this.parentCube.etParent(null);
    // }

    public getPositions(): BABYLON.Vector3[] { //after using this method while active block, must recouple!!!
        this.setPositions();
        return this.positions;
    }

    private setPositions(): void {
        this.uncouple();
        this.positions = [this.parentCube.position, this._cube2.position, this._cube3.position, this._cube4.position];

        // let pos = [this.parentCube.position, this._cube2.position, this._cube3.position, this._cube4.position];
        // let cloned = JSON.parse(JSON.stringify(pos)); //deep copy, not just reference to array
        // this.positions = cloned;

        // this.recouple();

        //before uncoupling: instanced meshes give positions relative to parent! CHANGE
    }

    private setCubes(): void {
        this.cubes = [this._cube2, this._cube3, this._cube4];
    }
}

class BigCubex extends Blockx {
    private _cube2: BABYLON.Mesh;
    private _cube3: BABYLON.Mesh;
    private _cube4: BABYLON.Mesh;
    private _cube5: BABYLON.Mesh;
    private _cube6: BABYLON.Mesh;
    private _cube7: BABYLON.Mesh;
    private _cube8: BABYLON.Mesh;

    constructor() {
        super(8);
        this.type = "big cube";
        this.create();
        this.setCubes();
    }

    private create(): void {

        this.parentCube = this.createCube(5.5, -1); //offset position - parent: bottom,left,front cube
        var mat = new BABYLON.StandardMaterial("mat", scene);
        mat.diffuseColor = new BABYLON.Color3(0.2, 0.28, 1);
        mat.emissiveColor = new BABYLON.Color3(0.2, 0.28, 1); //dark blue
        this.parentCube.material = mat;
        this.parentCube.material.backFaceCulling = false;

        this._cube2 = this.becomeChild(this._cube2);
        this._cube3 = this.becomeChild(this._cube3);
        this._cube4 = this.becomeChild(this._cube4);
        this._cube5 = this.becomeChild(this._cube5);
        this._cube6 = this.becomeChild(this._cube6);
        this._cube7 = this.becomeChild(this._cube7);
        this._cube8 = this.becomeChild(this._cube8);

        this._cube2.parent = this.parentCube;
        this._cube2.position = new BABYLON.Vector3(0, 0, 1); //bottom,left,back

        this._cube3.parent = this.parentCube;
        this._cube3.position = new BABYLON.Vector3(1, 0, 1); //bottom,right,back

        this._cube4.parent = this.parentCube;
        this._cube4.position = new BABYLON.Vector3(1, 0, 0); //bottom,right,front

        this._cube5.parent = this.parentCube;
        this._cube5.position = new BABYLON.Vector3(0, 1, 0); //top,left,front
        
        this._cube6.parent = this.parentCube;
        this._cube6.position = new BABYLON.Vector3(0, 1, 1); //top,left,back

        this._cube7.parent = this.parentCube;
        this._cube7.position = new BABYLON.Vector3(1, 1, 1); //top,right,back
        
        this._cube8.parent = this.parentCube;
        this._cube8.position = new BABYLON.Vector3(1, 1, 0); //top,rightfront
    }

    public getPositions(): BABYLON.Vector3[] {
        this.setPositions();
        return this.positions;
    }

    private setPositions(): void {
        this.uncouple();
        this.positions = [this.parentCube.position, this._cube2.position, this._cube3.position, this._cube4.position,
                            this._cube5.position, this._cube6.position, this._cube7.position, this._cube8.position];
        // this.recouple();
    }

    private setCubes(): void {
        this.cubes = [this._cube2, this._cube3, this._cube4, this._cube5, this._cube6, this._cube7, this._cube8];
    }
}

class ZBlockx extends Blockx {
    private _cube2: BABYLON.Mesh;
    private _cube3: BABYLON.Mesh;
    private _cube4: BABYLON.Mesh;

    constructor() {
        super(4);
        this.type = "z block";
        this.create();
        this.setCubes();
    }

    private create(): void {
        this.parentCube = this.createCube(5.5, 0); //bottom middle

        var mat = new BABYLON.StandardMaterial("mat", scene);
        mat.diffuseColor = BABYLON.Color3.Purple();
        mat.emissiveColor = new BABYLON.Color3(0.4, 0.28, 0.8); //purple
        this.parentCube.material = mat;
        this.parentCube.material.backFaceCulling = false;

        this._cube2 = this.becomeChild(this._cube2);
        this._cube3 = this.becomeChild(this._cube3);
        this._cube4 = this.becomeChild(this._cube4);

        this._cube2.parent = this.parentCube;
        this._cube2.position = new BABYLON.Vector3(1, 0, 0); //right, bottom
        
        this._cube3.parent = this.parentCube;
        this._cube3.position = new BABYLON.Vector3(0, 1, 0); //middle, top
    
        this._cube4.parent = this.parentCube;
        this._cube4.position = new BABYLON.Vector3(-1, 1, 0); //left, top
    }

    public getPositions(): BABYLON.Vector3[] {
        this.setPositions();
        return this.positions;
    }

    private setPositions(): void {
        this.uncouple();
        this.positions = [this.parentCube.position, this._cube2.position, this._cube3.position, this._cube4.position];
    }

    private setCubes(): void {
        this.cubes = [this._cube2, this._cube3, this._cube4];
    }
}

class BigLx extends Blockx { 
    private _cube2: BABYLON.Mesh;
    private _cube3: BABYLON.Mesh;
    private _cube4: BABYLON.Mesh;

    constructor() {
        super(4);
        this.type = "big l";
        this.create();
        this.setCubes();
    }

    private create(): void {
        this.parentCube = this.createCube(5.5, 0); //middle, bottom cube

        var mat = new BABYLON.StandardMaterial("mat", scene);
        mat.diffuseColor = new BABYLON.Color3(0.4, 0.28, 1);
        mat.emissiveColor = new BABYLON.Color3(1, 0.28, 1); //pink
        this.parentCube.material = mat;
        this.parentCube.material.backFaceCulling = false;

        this._cube2 = this.becomeChild(this._cube2);
        this._cube3 = this.becomeChild(this._cube3);
        this._cube4 = this.becomeChild(this._cube4);

        this._cube2.parent = this.parentCube;
        this._cube2.position = new BABYLON.Vector3(-1, 0, 0); //left, bottom
        
        this._cube3.parent = this.parentCube;
        this._cube3.position = new BABYLON.Vector3(-1, 1, 0); //left, top

        this._cube4.parent = this.parentCube;
        this._cube4.position = new BABYLON.Vector3(1, 0, 0); //right, bottom
    }

    public getPositions(): BABYLON.Vector3[] {
        this.setPositions();
        return this.positions;
    }

    private setPositions(): void {
        this.uncouple();
        this.positions = [this.parentCube.position, this._cube2.position, this._cube3.position, this._cube4.position];
    }

    private setCubes(): void {
        this.cubes = [this._cube2, this._cube3, this._cube4];
    }
}

class Cubex extends Blockx {

    constructor() {
        super(1); // 1 -size of array
        this.type = "cube";
        this.create();
    }

    private create(): void {
        this.parentCube = this.createCube(6.5, 0);

        var mat = new BABYLON.StandardMaterial("mat", scene);
        mat.diffuseColor = new BABYLON.Color3(0.6, 0.6, 0);
        mat.emissiveColor = BABYLON.Color3.Yellow();
        this.parentCube.material = mat;
        this.parentCube.material.backFaceCulling = false;
    }

    //retrieve positions at a given time - whenever updateSpaces in Game is called
    public getPositions(): BABYLON.Vector3[] {
        this.setPositions();
        return this.positions;
    }

    private setPositions(): void {
        this.positions[0] = this.parentCube.position;
        //this.positions = [this.parentCube.position];
    }
    
}

class MiniLx extends Blockx {
    private _cube2: BABYLON.Mesh;
    private _cube3: BABYLON.Mesh;

    constructor() {
        super(3);
        this.type = "mini l";
        this.create();
        this.setCubes();
    }

    private create(): void {
        this.parentCube = this.createCube(6.5, -1); //left-most, top

        var mat = new BABYLON.StandardMaterial("mat", scene);
        mat.diffuseColor = new BABYLON.Color3(1, 0.2, 0.3);
        mat.emissiveColor = new BABYLON.Color3(1, 0.2, 0.3); //light red
        this.parentCube.material = mat;
        this.parentCube.material.backFaceCulling = false;

        this._cube2 = this.becomeChild(this._cube2);
        this._cube3 = this.becomeChild(this._cube2);

        this._cube2.parent = this.parentCube;
        this._cube2.position = new BABYLON.Vector3(0, -1, 0); //left-most, bottom

        this._cube3.parent = this.parentCube;
        this._cube3.position = new BABYLON.Vector3(1, 0, 0); //right, top

    }

    public getPositions(): BABYLON.Vector3[] {
        this.setPositions();
        return this.positions;
    }

    private setPositions(): void {
        this.uncouple();
        this.positions = [this.parentCube.position, this._cube2.position, this._cube3.position];
    }

    private setCubes(): void {
        this.cubes = [this._cube2, this._cube3];
    }
}

class ShortTowerx extends Blockx {
    private _cube2: BABYLON.Mesh; //top cube
    private _cube3: BABYLON.Mesh; //bottom cube
    // private _dummypos: BABYLON.Vector3[]; 
    
    constructor() {
        super(3);
        this.type = "short tower";
        this.create();
        this.setCubes();
    }

    private create(): void {
        this.parentCube = this.createCube(5.5, 0);
        
        var mat = new BABYLON.StandardMaterial("mat", scene);
        mat.diffuseColor = new BABYLON.Color3(0, 1, 1);
        mat.emissiveColor = new BABYLON.Color3(0, 1, 1); //light blue
        this.parentCube.material = mat;
        this.parentCube.material.backFaceCulling = false;

        this._cube2 = this.becomeChild(this._cube2);
        this._cube3 = this.becomeChild(this._cube3);

        this._cube2.parent = this.parentCube;
        this._cube2.position.y = 1; //position relative to parent
    
        this._cube3.parent = this.parentCube;
        this._cube3.position.y = -1;
    }

    public getPositions(): BABYLON.Vector3[] {
        this.setPositions();
        return this.positions;
    }

    private setPositions(): void { //order of pos doesn't matter?
        //1st element stores parent block's pos:
        this.uncouple();
        this.positions = [this.parentCube.position, this._cube2.position, this._cube3.position];
        // this.recouple(); //MUST RECOUPLE OUTSIDE OF BLOCK CLASSES, WHENEVER GETPOSITIONS IS CALLED AND PASSED INTO UPDATE SPACES
    }

    private setCubes(): void {
        this.cubes = [this._cube2, this._cube3]
    }

}

class TBlockx extends Blockx {
    private _cube2: BABYLON.Mesh;
    private _cube3: BABYLON.Mesh;
    private _cube4: BABYLON.Mesh;

    constructor() {
        super(4);
        this.type = "t block";
        this.create();
        this.setCubes();
    }

    private create(): void {
        this.parentCube = this.createCube(5.5, 0); //middle, bottom

        var mat = new BABYLON.StandardMaterial("mat", scene);
        mat.diffuseColor = new BABYLON.Color3(0.7, 0.5, 0);
        mat.emissiveColor = new BABYLON.Color3(0.7, 0.3, 0); //orange
        this.parentCube.material = mat;
        this.parentCube.material.backFaceCulling = false;
        
        this._cube2 = this.becomeChild(this._cube2);
        this._cube3 = this.becomeChild(this._cube3);
        this._cube4 = this.becomeChild(this._cube4);

        this._cube2.parent = this.parentCube;
        this._cube2.position = new BABYLON.Vector3(-1, 0, 0); //left, bottom

        this._cube3.parent = this.parentCube;
        this._cube3.position = new BABYLON.Vector3(1, 0, 0); //right, bottom

        this._cube4.parent = this.parentCube;
        this._cube4.position = new BABYLON.Vector3(0, 1, 0); //middle, top
    }

    public getPositions(): BABYLON.Vector3[] {
        this.setPositions();
        return this.positions;
    }

    private setPositions(): void {
        this.uncouple();
        this.positions = [this.parentCube.position, this._cube2.position, this._cube3.position, this._cube4.position];
    }

    private setCubes(): void {
        this.cubes = [this._cube2, this._cube3, this._cube4];
    }
}

var createScene = function () {

    var scene = new BABYLON.Scene(engine);
    scene.clearColor = new BABYLON.Color4(0, 0, 0, 0);

    var camera = new BABYLON.ArcRotateCamera("Camera", -Math.PI/2, Math.PI/3.3, 18.4, new BABYLON.Vector3(0, 0, 0), scene);
    camera.attachControl(canvas, true);

    var light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);
    light.intensity = 1;

    var box = BABYLON.MeshBuilder.CreateBox("box", {size: 1}, scene);
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

    // box.visibility = 0;

    // var box2 = BABYLON.MeshBuilder.CreateBox("box2", {size: 1}, scene);
    // box2.material = mat;
    // box2.material.backFaceCulling = false; //need emissive color to see backface
    // //use edges renderer to distinguish between boxes
    // box2.enableEdgesRendering();
    // box2.edgesWidth = 5.0;
    // box2.edgesColor = new BABYLON.Color4(0, 0, 0, 1);
    
    var box2 = box.createInstance("box2");
    // var box2 = box.clone();
    box2.position.y = 2;
    // box.dispose(true);
    box.visibility = 0;

    // // box2.parent = box;
    // // box2.position.y = -1;
    // box3.parent = box;
    // box3.position.y = 1; //pos relative to parent

    var gameboard = new Gameboard(7);
    // var zb = new Cubex();
    // cube.position.z = -3;
    // var zb = new ShortTowerx();
    // zb.position.y = -5;
    // zb.position.x = -1;
    // var zb = new BigTowerx(); //set parent cube to top cube?? 
    // zb.position.x = -3;
    // var zb = new BigCubex();
    // // var dummy = tb.parentCube.clone();
    // zb.position.z = 3;
    // var zb = new BigLx();
    // var zb = new MiniLx();
    // zb.position.x = 3;
    var zb = new TBlockx();
    // zb.position.y = -3;
    // zb.position.x = 1;
    // var zb = new ZBlockx(); //move up?
    // zb.position.y = -0.5;

    zb.uncouple();
    // zb.parentCube.dispose();
    // zb.parentCube = null;
    // zb.parentCube.setEnabled(false);

    // zb.cubes[0].dispose();

//    zb.parentCube.setParent(lb.parentCube); //can move zb (child) without moving parent (lb)
    
    // var pos = zb.getPositions();
    // // let arr = [pos[0].y-1];
    // console.log(pos);
    // // console.log(arr);

    // console.log(zb.getPositions()); //doesnt print out actual pos of child cubes, only those relative to parent
    // gameboard.updateSpaces(zb.getPositions(), true, false);
    // zb.recouple();
    // console.log(gameboard.inGrid(zb.getPositions())); //returned false for t-block with recouple instead of uncouple
    // zb.recouple();
    

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
    var onCollide = () => {
        console.log("onEntry");
        mat.emissiveColor = new BABYLON.Color3(0, 0, 0);
        colpt = box.position;
        collided = true;
    }
    
    var disableW = false;
    var disableS = false;
    var disableD = false;
    var disableA = false;
    var onPlane = () => {
        console.log('onPlane');
        mat.emissiveColor = new BABYLON.Color3(1, 1, 1);
        //compare pos of block to plane - if x or z = 3 or -3 -> Math.floor(size/2)
        //if x = 3 (hits rplane), disable right ; if x = -3 (hits lplane), disable left; 
            //can go front and back, but right still disabled (if at x=3)
        //if z = 3 (hits bplane), disable forward; if z = -3 (hits fplane), disable back
        // disableS = true; //forfplane

    }
    var offPlane = () => {
        console.log('offPlane');
        mat.emissiveColor = new BABYLON.Color3(1, 1, 1);
        // disableS = false; //reset //for fplane

    }

    var onBlock = () => {
        console.log('onBlock');
        // compare activeblock.position.y, z, and x with Block 
    }

    box.actionManager = new BABYLON.ActionManager(scene); 

    //raised when box intersects with ground (raised once - checks for colpt once)
    box.actionManager.registerAction(new BABYLON.ExecuteCodeAction(
		{trigger: BABYLON.ActionManager.OnIntersectionEnterTrigger, parameter: ground}, 
		onCollide
    ));

    box.actionManager.registerAction(new BABYLON.ExecuteCodeAction(
		{trigger: BABYLON.ActionManager.OnIntersectionEnterTrigger, parameter: fplane},
		onPlane //do for each plane?
    ));

    box.actionManager.registerAction(new BABYLON.ExecuteCodeAction(
        {trigger: BABYLON.ActionManager.OnIntersectionExitTrigger, parameter: fplane}, //turn off on entry enter action temp?
        offPlane
    ));

    // box.actionManager.registerAction(new BABYLON.ExecuteCodeAction(
	// 	{trigger: BABYLON.ActionManager.OnIntersectionEnterTrigger, parameter: /*any Block*/}, //iterate through array
	// 	onCollide //??
    // ));
    
    //action manager for intersec w/any block?? or use spaces array....

    //motions
    var rotation = Math.PI / 2;
    scene.onKeyboardObservable.add((kbInfo) => { 
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
                            zb.rotate("x");
                            console.log("rotating");
                            break;

                        case "x":
                            // box.rotate(BABYLON.Axis.Y, -rotation, BABYLON.Space.WORLD);
                            zb.rotate("y");
                            break;

                        case "c":
                            // box.rotate(BABYLON.Axis.Z, -rotation, BABYLON.Space.WORLD); 
                            zb.rotate("z");
                            break;
                    }
                    // gameboard.updateSpaces([box.position], true, false);
                    // console.log(gameboard.positions[0][0][0]);
                //     gameboard.updateSpaces(zb.getPositions(), true, false);
                //     zb.recouple();
                //     console.log(gameboard.spaces);
                //     console.log(zb.getPositions());
                //     zb.recouple();
                // break;
            }
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