/*import {GameBoard} from './GameBoard.js';*/

class Game {
    public gameBoard: Gameboardb;
    public block: Blockb; //stores current active block
    private _dummy: Blockb;
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
        this.gameBoard = new Gameboardb(size); //7 or 5
        this.score = 0;
        this.collided = false;
        this.enableControls();
        this._landed = new Array(); //push landed elements/blocks
        this._rotation = Math.PI / 2;

        //loop for drawing block...
        this.drawBlock();
    
        scene.registerBeforeRender(() => {
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
                this.block = new Cubeb();
                console.log("drew cube");
                break;
            case 1:
                this.block = new ShortTowerb(); //Collapsing X Rotation
                console.log("drew st");
                // this._dummy = new ShortTowerb();
                break;
            case 2:
                this.block = new BigTowerb(); //acts as if already collided when spawned?
                console.log("drew big tower");
                // this._dummy = new BigTowerb();
                break;
            case 3:
                this.block = new MiniLb(); //X collapse
                console.log("drew ml");
                // this._dummy = new MiniLb();
                break;
            case 4:
                this.block = new BigLb();
                console.log("drew bl");
                // this._dummy = new BigLb();
                break;
            case 5:
                this.block = new BigCubeb();
                console.log("drew bc");
                break;
            case 6:
                this.block = new TBlockb();
                console.log("drew t");
                // this._dummy = new TBlockb();
                break;
            case 7:
                this.block = new ZBlockb();
                console.log("drew z");
                // this._dummy = new ZBlockb();
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