/*export*/ class GameBoard {
    private _size: number;
    private _height: number;
    private _ground: BABYLON.Mesh;
    private _spaces: any[];
    private _positions: any[];
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
        
        //if tracker (tracks when true) = blockpos.length (found matches for each element), return true
        if (tracker === blockpos.length) {
            return true;
        }

        return false; //must only return false if blockpos doesnt match ANY els in POS ARRAY
    }

    public canMove(blockpos: BABYLON.Vector3[], dir: string): boolean { //to compare potential position of block
        //to see if block can move or not (in a certain direction) - can it move to potential space?
        //dir: left - x -= 1, right - x += 1, forward - z += 1, backward - z -= 1, down - y -= 1
        
        var potential: BABYLON.Vector3[] = new Array(blockpos.length);

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
            potential[i] = blockpos[i];
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