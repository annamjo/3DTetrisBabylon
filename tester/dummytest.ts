class Gameboardd {
    private _size: number;
    private _height: number;
    private _ground: BABYLON.Mesh;
    private _spaces: any[];
    private _positions: BABYLON.Vector3[];
    private _groundlvl: number;
    // private _borders: any[];
    // private _fplane: BABYLON.Mesh;
    // private _bplane: BABYLON.Mesh;
    // private _rplane: BABYLON.Mesh;
    // private _lplane: BABYLON.Mesh;
    // cameraCalib: number; //dep on size

    constructor(size: number) {
        this._size = size;
        this.create();
        this.fillSpaces();
        this.fillPositions();
        // this.fillBorders();
    }

    private create(): void { //only used within this class
        var groundGrid = this.createGrid();
        groundGrid.backFaceCulling = false;
    
        //size: must be odd number b/c of offset; use 5 or 7
        var ground = BABYLON.MeshBuilder.CreateGround("ground", {width: this._size, height: this._size}, scene);
        ground.material = groundGrid;
        ground.position.y = (this._size === 7) ? -6 : -5;
        this._groundlvl = ground.position.y + 0.5;
        this._ground = ground;

        //front & back planes
        var fplane = this.createPlane(0, 0, -this._size/2, Math.PI);
        var bplane = this.createPlane(0, 0, this._size/2, 0);
        // this._fplane = fplane;
        // this._bplane = bplane;

        //right & left planes
        var rplane = this.createPlane(this._size/2, 0, 0, Math.PI / 2);
        var lplane = this.createPlane(-this._size/2, 0, 0, -Math.PI/2);
        // this._rplane = rplane;
        // this._lplane = lplane;
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

    public get groundlvl(): number {
        return this._groundlvl;
    }

    // public get fplane(): BABYLON.Mesh {
    //     return this._fplane;
    // }

    // public get bplane(): BABYLON.Mesh {
    //     return this._bplane;
    // }

    // public get rplane(): BABYLON.Mesh {
    //     return this._rplane;
    // }
    
    // public get lplane(): BABYLON.Mesh {
    //     return this._lplane;
    // }
    
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

        //top, right, deep corner
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

    // private fillBorders() { //1 grid square longer all around x & z axis
    //     var borderSize = this._size + 2;
    //     var borders = new Array(borderSize);
        
    //     for (var x = 0; x < borderSize; x++) {
    //         borders[x] = new Array(this._height);

    //         for (var y = 0; y < this._height; y++) {
    //             borders[x][y] = new Array(borderSize);

    //             for (var z = 0; z < borderSize; z++) {
    //                 if (x === 0 || x === borderSize-1 || z === 0 || z === borderSize-1) {
    //                     borders[x][y][z] = true; //border space is occupied
    //                     //unoccuppied space in grid - empty
    //                 }
    //             }
    //         }
    //     }

    //     this._borders = borders;
    // }

    // public get borders(): any[] {
    //     return this._borders;
    // }

    public inGrid(blockpos: BABYLON.Vector3[]): boolean { //pass in block's position array; use w/dummy
        var inBounds: boolean;
        var tracker = 0; //tracks if inBounds was ever true

        for (var x = 0; x < this._size; x++) {
            for (var y = 0; y < this._height; y++) {
                for (var z = 0; z < this._size; z++) {

                    for (var i = 0; i < blockpos.length; i++) {
                        inBounds = this.compare(blockpos[i], x, y, z);
                        if (inBounds) { //if there is a match
                            tracker++;
                        }
                        //if found one match, but others dont match any of positions, still out of grid
                    }
                }
            }
        }

        var inside = true;
        var tracker2 = 0;
        for (var i = 0; i < blockpos.length; i++) {
            if ( Math.abs(blockpos[i].x) > Math.floor(this._size/2) || 
                    Math.abs(blockpos[i].y) > ((this._height/2)-0.5) || Math.abs(blockpos[i].z) > Math.floor(this._size/2)) {
                inside = false;
                tracker2++;
            }
        }

        
        //if tracker (tracks when true) = blockpos.length (found matches for each element), return true
        if (tracker === blockpos.length || tracker2 === 0) { 
            console.log("true");
            return true;
        }
        // else if (inside) {
        //     return true;
        // }

        return false; //must only return false if blockpos doesnt match ANY els in POS ARRAY
    }

    public canMove(blockpos: BABYLON.Vector3[], dir: string): boolean { //to compare potential position of block
        //to see if block can move or not (in a certain direction) - can it move to potential space?
        //dir: left - x -= 1, right - x += 1, forward - z += 1, backward - z -= 1, down - y -= 1
        
        // var potential: BABYLON.Vector3[] = new Array(blockpos.length);
        var potential = JSON.parse(JSON.stringify(blockpos));

        var xstep = 0;
        var ystep = 0;
        var zstep = 0;

        switch (dir) {
            case "forward":
                zstep = 1;
                break;
            case "back":
                zstep = -1;
                break;
            case "right":
                xstep = 1;
                break;
            case "left":
                xstep = -1;
                break;
            case "down":
                ystep = -1;
                break;
        }

        for (var i = 0; i < potential.length; i++) {
            // potential[i] = blockpos[i];
            potential[i].x += xstep;
            potential[i].y += ystep;
            potential[i].z += zstep;
        }

        if (this.inGrid(potential)) {
            if (!this.isOccupied(blockpos, potential)) {
                return true; //call update spaces after block moves
            }
        }

        return false;
    }

    //if using this method, must check if potential's position inGrid first
    public isOccupied(current: BABYLON.Vector3[], potential: BABYLON.Vector3[]): boolean { //actual, dummy
        //checks if any of positions of dummy block in conflict with spaces (at given xyz)
        
        //find corresponding position (potential) of block in position array
        for (var x = 0; x < this._size; x++) {
            for (var y = 0; y < this._height; y++) {
                for (var z = 0; z < this._size; z++) {

                    //current and potential arrays have same length - they store positions of same block
                    for (var i = 0; i < potential.length; i++) {
                        //find position in potential non-overlapping w/current
                        //dont check spaces that block currently occupies, only check potential positions that block doesnt occupy
                        if (this.compareMultiple(current, x, y, z) === false && this.compare(potential[i], x, y, z) === true) {
                            //position array el dont match any of current's els AND pos arr's el = potential el
                            if (this.spaces[x][y][z] === true) {
                                return true;
                            }
                        }
                    }
                }
            }
        }
        //if any space to be occupied by block already true - return true
        //if space isn't already occupied, return false
        return false;
    } 

    //to track position of a block 
    //in game: call updateSpaces whenever active block moves, when block collided/landed, or after layer shifted/collapsed (landed arr)
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
                    
                    //if not equal to any positions of block
                    if (active && this._spaces[x][y][z] === null && this.compareMultiple(position, x, y, z) === false) {
                        this._spaces[x][y][z] = false; //reset space that was previously null - occupied by active block
                    }

                    if (landed && this._spaces[x][y][z] === true && this.compareMultiple(position, x, y, z) === false) {
                        this._spaces[x][y][z] = false;
                    }

                    //do nothing if block's position doesn't exist in positions array (out of grid, so ingrid=false)
                    //if block outside of grid, spaces set to false
                }
            }
        }
    }

    //is position of block same as in positions array?
    public compare(position: BABYLON.Vector3, x: number, y: number, z: number): boolean {
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
            if (match) { //if match=true
                tracker++;
                //can return true here?
            }
        }
        if (tracker > 0) {
            return true;
        }
        return false;
    }

    //doesblock fit in? (next block, current block) - just use collisions? - would need potential positions
}
class Blockd {
    private _isActive: boolean;
    public positions: BABYLON.Vector3[];
    public parentCube: BABYLON.Mesh;
    public cubes: BABYLON.Mesh[]; //BABYLON.InstancedMesh[]; //child cubes - for uncoupling/recoupling
    public type: string; //type or name of block

    constructor(cubeNum: number) {
        this._isActive = true; //true when block is falling (1st contructed), false when locked in
        //or false if block not in grid (when first being spawned), true if in grid and falling
        this.positions = new Array(cubeNum);
        this.cubes = new Array(cubeNum - 1); //excluding parent cube
    }

    public createCube(ypos: number, xpos:number): BABYLON.Mesh {
        var cube = BABYLON.MeshBuilder.CreateBox("box", {size: 1}, scene); //will scene need to be stored?
        cube.position.y = ypos; //5.5 or 6.5?, or higher, above grid?
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

    public rotate(axis: string, rotation: number): void  { //if hasPivot - rotate around pivot instead (parent sphere)
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

    public becomeChild(cube: BABYLON.Mesh /*BABYLON.InstancedMesh*/): BABYLON.Mesh /*BABYLON.InstancedMesh*/ {
        //cube = this.parentCube.createInstance("cube");
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

    public getPositions(): BABYLON.Vector3[] { //will be overrided in sub classes
        return this.positions;
    }

    public getRelPos(): BABYLON.Vector3[] {
        return this.positions;
    }
}
class BigTowerd extends Blockd {
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
        this.parentCube = this.createCube(6.5, 0); //2nd cube from bottom

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
        return [this.parentCube.position, this._cube2.getAbsolutePosition(), this._cube3.getAbsolutePosition(), this._cube4.getAbsolutePosition()];
    }

    public getRelPos(): BABYLON.Vector3[] {
        this.setPositions();
        return this.positions; //gives relative positions (because cubes still parented), except cant get rel pos of parent cube...
    }

    private setPositions(): void {
        // this.uncouple();
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
class BigCubed extends Blockd {
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

    // public getPositions(): BABYLON.Vector3[] {
    //     this.setPositions();
    //     return this.positions;
    // }

    public getPositions(): BABYLON.Vector3[] { //after using this method while active block, must recouple!!!
        return [this.parentCube.position, this._cube2.getAbsolutePosition(), this._cube3.getAbsolutePosition(), this._cube4.getAbsolutePosition(), 
                this._cube5.getAbsolutePosition(), this._cube6.getAbsolutePosition(), this._cube7.getAbsolutePosition(), this._cube8.getAbsolutePosition()];
    }

    public getRelPos(): BABYLON.Vector3[] {
        this.setPositions();
        return this.positions; //gives relative positions (because cubes still parented), except cant get rel pos of parent cube...
    }

    private setPositions(): void {
        // this.uncouple();
        this.positions = [this.parentCube.position, this._cube2.position, this._cube3.position, this._cube4.position,
                            this._cube5.position, this._cube6.position, this._cube7.position, this._cube8.position];
        // this.recouple();
    }

    private setCubes(): void {
        this.cubes = [this._cube2, this._cube3, this._cube4, this._cube5, this._cube6, this._cube7, this._cube8];
    }
}
class ZBlockd extends Blockd {
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
        return [this.parentCube.position, this._cube2.getAbsolutePosition(), this._cube3.getAbsolutePosition(), this._cube4.getAbsolutePosition()];
    }

    public getRelPos(): BABYLON.Vector3[] {
        this.setPositions();
        return this.positions; 
    }

    private setPositions(): void {
        // this.uncouple();
        this.positions = [this.parentCube.position, this._cube2.position, this._cube3.position, this._cube4.position];
    }

    private setCubes(): void {
        this.cubes = [this._cube2, this._cube3, this._cube4];
    }
}
class BigLd extends Blockd { 
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
        return [this.parentCube.position, this._cube2.getAbsolutePosition(), this._cube3.getAbsolutePosition(), this._cube4.getAbsolutePosition()];
    }

    public getRelPos(): BABYLON.Vector3[] {
        this.setPositions();
        return this.positions; 
    }

    private setPositions(): void {
        // this.uncouple();
        this.positions = [this.parentCube.position, this._cube2.position, this._cube3.position, this._cube4.position];
    }

    private setCubes(): void {
        this.cubes = [this._cube2, this._cube3, this._cube4];
    }
}
class Cubed extends Blockd {

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
        // this.positions[0] = this.parentCube.position;
        this.positions = [this.parentCube.position];
    }
}
class MiniLd extends Blockd {
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
        this._cube3 = this.becomeChild(this._cube3);

        this._cube2.parent = this.parentCube;
        this._cube2.position = new BABYLON.Vector3(0, -1, 0); //left-most, bottom

        this._cube3.parent = this.parentCube;
        this._cube3.position = new BABYLON.Vector3(1, 0, 0); //right, top

    }

    public getPositions(): BABYLON.Vector3[] {
        return [this.parentCube.position, this._cube2.getAbsolutePosition(), this._cube3.getAbsolutePosition()];
    }

    public getRelPos(): BABYLON.Vector3[] {
        this.setPositions();
        return this.positions; 
    }

    private setPositions(): void {
        // this.uncouple();
        this.positions = [this.parentCube.position, this._cube2.position, this._cube3.position];
    }

    private setCubes(): void {
        this.cubes = [this._cube2, this._cube3];
    }
}
class ShortTowerd extends Blockd {
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
        this.parentCube = this.createCube(6.5, 0);
        
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
        return [this.parentCube.position, this._cube2.getAbsolutePosition(), this._cube3.getAbsolutePosition()];
    }

    public getRelPos(): BABYLON.Vector3[] {
        this.setPositions();
        return this.positions; 
    }

    private setPositions(): void { //order of pos doesn't matter?
        //1st element stores parent block's pos:
        // this.uncouple();
        this.positions = [this.parentCube.position, this._cube2.position, this._cube3.position];
        // this.recouple(); //MUST RECOUPLE OUTSIDE OF BLOCK CLASSES, WHENEVER GETPOSITIONS IS CALLED AND PASSED INTO UPDATE SPACES
    }

    private setCubes(): void {
        this.cubes = [this._cube2, this._cube3]
    }

}
class TBlockd extends Blockd {
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
        return [this.parentCube.position, this._cube2.getAbsolutePosition(), this._cube3.getAbsolutePosition(), this._cube4.getAbsolutePosition()];
    }

    public getRelPos(): BABYLON.Vector3[] {
        this.setPositions();
        return this.positions; 
    }

    private setPositions(): void {
        // this.uncouple();
        this.positions = [this.parentCube.position, this._cube2.position, this._cube3.position, this._cube4.position];
    }

    private setCubes(): void {
        this.cubes = [this._cube2, this._cube3, this._cube4];
    }
}

class Gamed {
    public gameBoard: Gameboardd;
    public block: Blockd; //stores current active block
    private _dummy: Blockd;
    public collided: boolean;
    public colpt: BABYLON.Vector3;
    private _landed: BABYLON.Mesh[]; //any[] //landed (inactive) blocks stored as cubes (uncoupled);  active -> collided -> space = true
    //use for landed cubes' positions
    public score: number; //whenever a layer cleared = 49 pts (7x7)
    private _rotation: number;
    public fallingInterval: any;
    public scene: BABYLON.Scene;

    constructor(size: number, scene: BABYLON.Scene) {
        this.scene = scene;
        this.gameBoard = new Gameboardd(size); //7 or 5
        this.score = 0;
        this.collided = false;
        this.enableControls();
        this._landed = new Array(); //push landed elements/blocks
        this._rotation = Math.PI / 2;

        //loop for drawing block...
        this.drawBlock();
    
        scene.registerBeforeRender(() => {
            // scene.incrementRenderId();
            // this.block.parentCube.computeWorldMatrix();
            // var cubes = this.block.cubes;
            // for (var j = 0; j < cubes.length; j++) {
            //     cubes[j].computeWorldMatrix();
            // }
            if (this.collided === true) { //this.gameBoard.inGrid(this.block.getPositions()) && 
                // this.block.recouple();
                console.log("collided");
                clearInterval(this.fallingInterval); //compute world matrix?
                // this.collided = true; //to disable controls
                //isactive = false;
                // this._dummy.parentCube.dispose();
                // this.fixRotationOffset();
                this.setLanded();
                this.checkFullLayer(); //IF landed.length > 0
                if (!this.isGameOver()) { //call game over when first draw block? store as var/prop?
                    this.collided = false;
                    this.drawBlock();
                }
            } 
        });
    }

    public drawBlock() { //loop - draw another block based on time interval/when current block not active
        //randomize block - array of options (string or number); spawn a random block: switch case
        //can block be drawn without hitting anything? - start height outside of grid (!ingrid), only update spaces if inside grid/active
        //if inactive - -3 <= pos.x <= 3 and -3 <= pos.z <= 3
        // this.collided = false;

        var random = Math.floor(Math.random() * 8); //generates numbers from 0-7
        // random = 7;
        //change randomizer later

        //limitation: can only move block once fully in grid
        switch(random) {
            case 0:
                this.block = new Cubed();
                console.log("drew cube");
                break;
            case 1:
                this.block = new ShortTowerd(); //Collapsing X Rotation
                console.log("drew st");
                // this._dummy = new ShortTowerd();
                break;
            case 2:
                this.block = new BigTowerd(); //acts as if already collided when spawned?
                console.log("drew big tower");
                // this._dummy = new BigTowerd();
                break;
            case 3:
                this.block = new MiniLd(); //X collapse
                console.log("drew ml");
                // this._dummy = new MiniLd();
                break;
            case 4:
                this.block = new BigLd();
                console.log("drew bl");
                // this._dummy = new BigLd();
                break;
            case 5:
                this.block = new BigCubed();
                console.log("drew bc");
                break;
            case 6:
                this.block = new TBlockd();
                console.log("drew t");
                // this._dummy = new TBlockd();
                break;
            case 7:
                this.block = new ZBlockd();
                console.log("drew z");
                // this._dummy = new ZBlockd();
                break;
        }
        
        // this._dummy.parentCube.setParent(this.block.parentCube); //position??
        // this._dummy.parentCube.position = new BABYLON.Vector3(0, 0, 0);
        // this._dummy.parentCube.visibility = 0;
        
        console.log("1, called check col");
        this.checkCollision();
       
        this.fallingInterval = setInterval(() => { 
            //!this.collided
            if (this.gameBoard.inGrid(this.block.getPositions()) === false ) { //for when block first spawned
                this.collided = false;
                // this.block.recouple();
                this.fixRotationOffset();
                this.block.position.y -= 1;
            }
            else if (this.gameBoard.inGrid(this.block.getPositions()) && this.gameBoard.canMove(this.block.getPositions(), "down") === false) {
                // this.block.recouple(); //no need to recouple
                console.log("1, changed collided");
                this.collided = true;
            } 
            else if (this.gameBoard.inGrid(this.block.getPositions()) && this.checkCollision() === false && this.gameBoard.canMove(this.block.getPositions(), "down")) { //need check col?
                // this.block.recouple();
                console.log("2, called check col");
                this.block.position.y -= 1;
                this.fixRotationOffset();
                this.gameBoard.updateSpaces(this.block.getPositions(), true, false);
                // this.block.recouple();
            }
            console.log(this.gameBoard.spaces);
        }, 1250); //1500    

    }
    
    //draw drop preview
    // private getNextBlock() { //for preview of next block
    //     //randomize block here?
    // }

    // private canRotate(axis: string): boolean {
    //     //create dummy obj/instance of same block (has same properties?) before actually moving
    //     //compare dummy's positions (its array) with positions of gameboard
    //     //ingrid, isoccupied
    //     if (this.block.type === "big cube" || this.block.type === "cube") {
    //         return true;
    //     }
    //     var occupied: boolean;
    //     var inBounds: boolean;

    //     switch(axis) {
    //         case "x":
    //             this._dummy.rotate("x", this._rotation); //rotating dummy doesn't affect parent
    //             console.log("x", this._dummy.parentCube.visibility);
    //             occupied = this.gameBoard.isOccupied(this.block.getPositions(), this._dummy.getPositions()); 
    //             inBounds = this.gameBoard.inGrid(this._dummy.getPositions());
    //             this.block.recouple();
    //             this._dummy.recouple();
                
    //             this._dummy.rotate("x", -this._rotation); //reset rotation of dummy
    //             this._dummy.parentCube.visibility = 0;
    //             break;
    //         case "y":
    //             this._dummy.rotate("y", this._rotation);
    //             console.log("y", this._dummy.parentCube.visibility);
    //             occupied = this.gameBoard.isOccupied(this.block.getPositions(), this._dummy.getPositions());
    //             inBounds = this.gameBoard.inGrid(this._dummy.getPositions());
    //             this.block.recouple();
    //             this._dummy.recouple();
                
    //             this._dummy.rotate("y", -this._rotation);
    //             this._dummy.parentCube.visibility = 0;
    //             break;
    //         case "z":
    //             this._dummy.rotate("z", this._rotation);
    //             console.log("z", this._dummy.parentCube.visibility);
    //             occupied = this.gameBoard.isOccupied(this.block.getPositions(), this._dummy.getPositions());
    //             inBounds = this.gameBoard.inGrid(this._dummy.getPositions());
    //             this.block.recouple();
    //             this._dummy.recouple();
                
    //             this._dummy.rotate("x", -this._rotation);
    //             this._dummy.parentCube.visibility = 0;
    //             break;
    //     }   

    //     if (occupied === false && inBounds === true) { //occupied is false - can rotate
    //         return true;
    //     }
    //     return false;
    // }

    private fixRotationOffset(): void { //WARNING: COLLIDES PREMATURELY (checkcollisions method?)
        //WARNING: IF YOU ROTATE GREEN, DOESNT TRACK/CLEAR
        //something to do with parent cube
        //when you rotate, blocks other than parent block get shifted by really pos/negsmall decimal numbers

        // this.block.parentCube.computeWorldMatrix();
        // console.log(this.block.parentCube.getAbsolutePosition());

        console.log("in fix rot");
        var fixpos = this.block.getRelPos();
        // this.block.recouple(); //parent blocks back, need relative positions (not actual positions)
        //what about position of parentCube??? doesnt have a relative pos -  doesnt change weirdly
        for (var i = 0; i < fixpos.length; i++) {
            if (Math.abs(fixpos[i].x) > 0 && Math.abs(fixpos[i].x) < 0.1) { //math.floor
                //then pos should = 0 -> math.trunc b/c decimals are really small
                // fixpos[i].x = Math.trunc(fixpos[i].x); //trunc doesnt exist?

                // console.log(this.block.getPositions());
                // this.block.recouple();
                console.log("fixing rotation x", fixpos[i].x);
                // fixpos[i].x = 0;
                fixpos[i].x = Math.floor(Math.abs(fixpos[i].x));

                console.log("fixed", fixpos[i].x);
                // console.log(this.block.getPositions());
                // this.block.recouple();
            }
            if (Math.abs(fixpos[i].y) > 0 && Math.abs(fixpos[i].y) < 0.1) {
                // console.log(this.block.getPositions());
                // this.block.recouple();
                console.log("fixing rotation y", fixpos[i].y);
                // fixpos[i].y = 0;
                fixpos[i].y = Math.floor(Math.abs(fixpos[i].y));

                console.log("fixed", fixpos[i].y);
                // console.log(this.block.getPositions());
                // this.block.recouple();
            }
            if (Math.abs(fixpos[i].z) > 0 && Math.abs(fixpos[i].z) < 0.1) {
                // console.log(this.block.getPositions());
                // this.block.recouple();
                console.log("fixing rotation z", fixpos[i].z);
                // fixpos[i].z = 0;
                fixpos[i].z = Math.floor(Math.abs(fixpos[i].z));

                console.log("fixed", fixpos[i].z);
                // console.log(this.block.getPositions());
                // this.block.recouple();
            }
        }

    }

    private checkCollision(): boolean { //if block is landed/collided ON GROUND
        //either y = 11 (ground lvl)(height -1), or block right ontop of another mesh (y+1 -> space = true)
        console.log("in check collisions");
        
        var groundlvl = this.gameBoard.groundlvl;
        var groundtrack = 0;

        for (var i = 0; i < this.block.getPositions().length; i++) {
            if ( this.block.getPositions()[i].y === groundlvl) {
                groundtrack++;
            }
        }
        // this.block.recouple();

        if (groundtrack > 0) {
            this.collided = true;
            console.log("true");
            return true;
        }
        return false;
    }

    private setLanded(): void { //store cubes into landed
        //MUST HAVE - IMPORTANT (without it landed array contains unrounded off decimals fr rotations) 
        // this.fixRotationOffset();
        this.block.uncouple();
        this.block.parentCube.computeWorldMatrix();
        
        for (var c = 0; c < this.block.cubes.length; c++) {
            this.block.cubes[c].computeWorldMatrix();
        }
        this.fixRotationOffset(); 

        // var arr = this.block.cubes;
        if (this.block.type === "cube") {
            console.log("a cube");
            this._landed.push(this.block.parentCube);
        }
        else if (this.block.type !== "cube") {
            for (var i = 0; i < this.block.cubes.length; i++) {
                this._landed.push(this.block.cubes[i]);
            }
            this._landed.push(this.block.parentCube);
        }
        // this._landed.push(this.block.parentCube);
        console.log(this._landed.length);

        //store landed block's positions (for updateSpaces)
        console.log(this._landed);
        var arr = new Array();
        for (var el = 0; el < this._landed.length; el++) {
            arr.push(this._landed[el].position);  //abs pos?
        }
        
        console.log(arr); //!!
        console.log(this.block.getRelPos());
        this.gameBoard.updateSpaces(arr, false, true);
    }

    //not just for bottom layer, but for any layer
    private checkFullLayer(): void { //use as observable in game???

        var height = this.gameBoard.height;
        var size = this.gameBoard.size;

        var fullLayer: boolean;
        var layerNums: number[] = new Array(); //which layers are cleared? .length = 0 if no full layers
        var layerheight = null;

        //single layer - same y coordinate
        for (var y = 0; y < height; y++) { //for each layer of y height...
            fullLayer = true;
            for (var x = 0; x < size; x++) {
                for (var z = 0; z < size; z++) {
                    if (this.gameBoard.spaces[x][y][z] === false) { //if element in layer in false
                        fullLayer = false
                        //fullLayer stays true if element in layer never = false
                    }
                    else {
                        layerheight = this.gameBoard.positions[x][y][z].y;
                        console.log(layerheight);
                    }
                }
            }
            if (fullLayer) { //clear everytime you encounter full layer
                console.log("full layer");
                this.clearLayer(y, layerheight, size);
                if (y !== 0) {
                    layerNums.push(y); //stores which layers were cleared, used to collapse layer
                }
                this.score += size * size;
                fullLayer = false;
            } //when block is at y = 0, game over?
        }
        
        if (layerNums.length > 0) { //collpase only if full layers exist and were cleared - when layerNums has >0 elements
            this.collapseLayers(layerNums, size, height);
        }
        //if layerNums has no elements, no layers were full and cleared, so no need to collapse layers - base case
    }

    //in spaces array and remove meshes -> block.dispose() -> landed array
    private clearLayer(layer: number, layerheight: number, size: number): void { //remove a full layer/plane of blocks
        console.log("clearing layer");
        //clear layer in spaces array - in horizontal plane of same y
        for (var x = 0; x < size; x++) {
            for (var z = 0; z < size; z++) {
                this.gameBoard.spaces[x][layer][z] = false;
            }
        }
        console.log(this.gameBoard.spaces);
        
        //to remove blocks:
        //iterate through blocks on this layer, make 1st block a parent of subsequent blocks, delete parent block

        // landed - array of blocks/meshes, if block.position.y = layer -> delete
        scene.blockfreeActiveMeshesAndRenderingGroups = true; //for optimization
        for (var i = 0; i < this._landed.length; i++) {
            var position = this._landed[i].position;
            if (position.y === layerheight) {
                //delete mesh in 3d world, but doesn't delete element in landed array
                this._landed[i].dispose(); //deleting each block separately
                this._landed[i] = null;
                console.log("cleared block");
            }
        }
        scene.blockfreeActiveMeshesAndRenderingGroups = false;
        console.log(this._landed);
        // var parent: BABYLON.Mesh;
        // var first = true;

        // for (var i = 0; i < this._landed.length; i++) { 
        //     //cube that makes up block at y lvl/height should be cleared 
        //     if (this._landed[i].position.y === layerheight && first) {
        //         parent = this._landed[i]; //makes 1st block the parent
        //         first = false;
        //     }
        //     else if (this._landed[i].position.y === layerheight) {
        //         this._landed[i].parent = parent;
        //     }

        // }
        // // this.scene.blockfreeActiveMeshesAndRenderingGroups = true;

        // parent.dispose(); //removes cube parts of block (as stored in landed arr - blocks uncoupled onced landed- dont recouple)
        // parent = null;

        // this.scene.blockfreeActiveMeshesAndRenderingGroups = false;

        for (var j = this._landed.length - 1; j >= 0; j--) { //delete landed elements that have been disposed
            if (this._landed[j] === null) {
                this._landed.splice(j, 1); //remove cube mesh fr landed array
            }
        }
        console.log(this._landed);
    }

    private collapseLayers(layerNums: number[], size: number, height: number): void { //layers (above) will all move down 1 after full layer disappears
        
        //move down each element in landed array at specific y layer
        //cases: double layers cleared; if layerNums not right after another but multiple - start with lowest layer (y) - last element

        //cleared layer(s) 1st -> shift down layers above cleared layers: collapse function
        //use landed array -> change positions.y of any block above y to positions.y-1, IF space = false
            //actually pos.y shifted down as far as it can if it none of it collides with other blocks
            //move blocks 1st and THEN update pos
        
        //move each cube down 1 at a time and update spaces each layer at a time: start from bottom
        //cascade method (implement later): same type of block shifts down together, cube remembers which part of block it was
        //this method: each cube in landed goes down if space below empty/false, does this until space below is true

        //start 1 from the lowest layer cleared:
        var y = layerNums[layerNums.length - 1] - 1; //ground lvl: y = 11 (height-1); assuming layer isn't y = 0 (top)
        console.log(y, "y");
        var layer = y + 1;
        console.log(layer, "layer");

        var landedPos = new Array();
        for (var el = 0; el < this._landed.length; el++) {
            landedPos.push(this._landed[el].position); 
        }
        console.log(landedPos);

        for (y; y >= 0; y--) {
            for (var x = 0; x < size; x++) {
                for (var z = 0; z < size; z++) {

                    for (var i = 0; i < landedPos.length; i++) {
                        //see if position in landed same as in position arr in gameboard - should only find 1 match at this xyz
                        if (this.gameBoard.compare(landedPos[i], x, y, z) === true) {  //if yes, mesh at that pos to be shifted down
                            console.log(landedPos);
                            //each block above layer goes down 1 y until reach lowest y   
                            //and shift blocks down if space below = true  
                            layer = y + 1;        
                            console.log(this.gameBoard.spaces);
                            console.log(this.gameBoard.spaces[x][layer][z]  === false && layer < height);
                            console.log(x, y, z, i);
                            console.log(x, layer, z);   
                            while (layer < height && this.gameBoard.spaces[x][layer][z] === false) {
                                console.log("entered");
                                // this._landed[i].position.y -= 1; //shift down cube in 3d world
                                console.log(landedPos[i].y);
                                landedPos[i].y--;
                                console.log(landedPos[i].y);
                                layer++;
                            }

                            // this.gameBoard.updateSpaces(landedPos, false, true);
                        }
                    }

                    //or use can move method
                }
            }
            this.gameBoard.updateSpaces(landedPos, false, true); //update after entire y plane of cubes shifted down
        }
        //use can move method, pass in one el in landed as one el array

        // this.checkFullLayer(); //once collapsed, check for new full layers - runtime error?
        //check layer again once you collapsed - break out of this once checkLayer -> false
    }

    //keyboard controls for active block
    private enableControls() {
        //everytime block moves, this._gameBoard.updateSpaces()
        //is there an ActiveBlock? - check layer after a block locks into place (no active blocks) - if (collided)
        //gameBoard.checkFullLayer() -> .clearLayer() -> this.collapseLayers()
        //if collided (block's isactive = false - block only moves when isactive is true), store block in landed (position) - 3d array

        //motions
        this.scene.onKeyboardObservable.add((kbInfo) => { 
            console.log("3, called check col");
            if (this.gameBoard.inGrid(this.block.getPositions()))  {
                // this.block.recouple();
                this.fixRotationOffset();
                this.checkCollision(); //&& this.gameBoard.inGrid(this.block.getPositions())
            }
            if (!this.collided)  { //when block 1st drawn, outside of grid, cant use keyboard
                this.fixRotationOffset();
                switch (kbInfo.type) {
                    case BABYLON.KeyboardEventTypes.KEYDOWN:
                        switch (kbInfo.event.key) {
                            case "w": //forward
                                if (this.gameBoard.inGrid(this.block.getPositions()) && this.gameBoard.canMove(this.block.getPositions(), "forward")) {
                                    // this.block.recouple(); //must call recouple after you call getPositions
                                    this.block.position.z += 1;
                                }
                                break;

                            case "s": //backward
                                if (this.gameBoard.inGrid(this.block.getPositions()) && this.gameBoard.canMove(this.block.getPositions(), "back")) {
                                    // this.block.recouple();
                                    this.block.position.z -= 1;
                                }
                                break;

                            case "a": //left
                                if (this.gameBoard.inGrid(this.block.getPositions()) && this.gameBoard.canMove(this.block.getPositions(), "left")) {
                                    // this.block.recouple();
                                    this.block.position.x -= 1;
                                }
                                break;

                            case "d": //right
                                if (this.gameBoard.inGrid(this.block.getPositions()) && this.gameBoard.canMove(this.block.getPositions(), "right")) {
                                    // this.block.recouple();
                                    this.block.position.x += 1;
                                }
                                break;

                            case " ": //down
                                if (this.gameBoard.inGrid(this.block.getPositions()) && this.gameBoard.canMove(this.block.getPositions(), "down")) {
                                    // this.block.recouple();
                                    this.block.position.y -= 1;
                                }
                                else if (this.gameBoard.inGrid(this.block.getPositions()) && this.gameBoard.canMove(this.block.getPositions(), "down") === false) {
                                    // this.block.recouple(); //need?
                                    console.log("2, changed collided");
                                    this.collided = true;
                                } 
                                break;

                            case "z": //rotations screw up inGrid
                                //rotating, if block would be in a position not found in positions array - can't move (get preview)
                                // if (this.canRotate("x")) {
                                    console.log("rotate x");
                                    this.block.rotate("x", this._rotation); //rotate child 1st to se if it intersects?
                                    this.fixRotationOffset();
                                    console.log("rotating x");
                                    // console.log(this.block.getPositions());
                                    // this.block.recouple();
                                // }
                                break;

                            case "x":
                                // if (this.canRotate("y")) {
                                    console.log("rotate y");
                                    this.block.rotate("y", this._rotation);
                                    this.fixRotationOffset();
                                    console.log("rotating y");
                                // }
                                break;

                            case "c":
                                // if (this.canRotate("z")) {
                                    console.log("rotate z");
                                    this.block.rotate("z", this._rotation); 
                                    this.fixRotationOffset();
                                    console.log("rotating z");
                                // }
                                break;
                        }
                        this.fixRotationOffset();
                        this.gameBoard.updateSpaces(this.block.getPositions(), true, false);
                        // this.block.recouple();
                        console.log(this.gameBoard.spaces); //affected by rotations?
                        console.log(this.gameBoard.inGrid(this.block.getPositions()));
                        // this.checkCollision();
                    break;
                }
            }     
        });
    }

    public isGameOver(): boolean { 
        //isgameboardfull  - if space at y = 0 is full (after active block landed, before new block drawn)
        //at least one block pos at y = 0 and another block directly under it
        //and !ingrid()
        //if collided and !ingrid -> game over
        //remove keyboard observable?

        //not in grid - but y = 6.5 (1 above 5.5 - tallest height of grid)
        //in isOccupied, pass in x and z and see if space below (y = 5.5) is occupied/full

        // if (!this.gameBoard.inGrid(this.block.getPositions()) &&) {
            
        // }

         
        return false; //will make game loop forever
    } 
}

var createScene = function () {

    var scene = new BABYLON.Scene(engine);
    scene.clearColor = new BABYLON.Color4(0, 0, 0, 0);

    var camera = new BABYLON.ArcRotateCamera("Camera", -Math.PI/2, Math.PI/3.3, 18.4, new BABYLON.Vector3(0, 0, 0), scene);
    camera.attachControl(canvas, true);

    var light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);
    light.intensity = 1;

    var game = new Gameb(7, scene);

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