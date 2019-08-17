/*import {GameBoard} from './GameBoard.js';*/

class Game {
    private _gameBoard: GameBoard;
    private _score: number; //whenever a layer cleared = 49 pts (7x7)
    private _block: BABYLON.Mesh; //Block; //current active block
    private _collided: boolean;
    private _colpt: BABYLON.Vector3;
    private _landed: BABYLON.Mesh[]; //landed (inactive) blocks stored as cubes (uncoupled);  active -> collided -> space = true
    //use for landed cubes' positions
    private _scene: BABYLON.Scene;

    constructor(size: number, scene: BABYLON.Scene) {
        this._gameBoard = new GameBoard(size);
        this._scene = scene;
        this.enableControls();
        //animation loop? or in game?
    }

    private drawBlock() { //loop - draw another block based on time interval/when current block not active
        //randomize block - array of options (string or number); spawn a random block: switch case
    } //draw drop preview?
    
    private getNextBlock() {
        //randomize block here?
    } //also preview next block

    private removeBlock() {
        //update spaces
    }

    //how to check collisions of not just parent cube but all of its cubes??
    //collision w/ground, planes, meshes when moving/rotating -> not just based on parent mesh
    //create invisible bounding box?
    //whenever block moved boundingBox moved first to check collisions for action manager
    //only called when checking col
    //if potential position of any part of this block doesnt match positions array - can't rotate, move - disable
    //for every move (up - y +=1 in pos array, and must be false space)
    // GAMEBOARD.INGRID(); -  use to detect collisions w/dummy - for rotations (and if space = true/false)
    //or in keyboard- if going right one - check position to right x+=1 before moving
    //find index of rightmost position in pos array (check for rightmost in block array), check index of spaces arr

    private checkCollisons() {
        //create dummy obj/instance of same block (has same properties?) before actually moving
        //compare dummy's positions (its array) with positions of gameboard
    }

    //not just for bottom layer, but for any layer
    private checkFullLayer(): void { //use as (afterrender) observable in game???

        var height = this._gameBoard.height;
        var size = this._gameBoard.size;

        var fullLayer: boolean;
        var layerNums: number[] = new Array(); //which layers are cleared? .length = 0 if no full layers

        //single layer - same y coordinate
        for (var y = 0; y < height; y++) { //for each layer of y height...
            fullLayer = true;
            for (var x = 0; x < size; x++) {
                for (var z = 0; z < size; z++) {
                    if (this._gameBoard.spaces[x][y][z] === false) {
                        fullLayer = false
                    }
                }
            }
            if (fullLayer) { //clear everytime you encounter full layer
                layerNums.push(y);
                this.clearLayer(y, size);
            } 
        }
        
        if (layerNums.length > 0) { //collpase only if full layers exist and were cleared - when layerNums has >0 elements
            this.collapseLayers(layerNums, size, height);
        }
        //if layerNums has no elements, no layers were full and cleared, so no need to collapse layers - base case
    }

    //in spaces array and remove meshes -> block.dispose()
    private clearLayer(layer: number, size: number): void { //remove a full layer/plane of blocks - in game??
        //clear layer in spaces array - in horizontal plane of same y
        for (var x = 0; x < size; x++) {
            for (var z = 0; z < size; z++) {
                this._gameBoard.spaces[x][layer][z] = false; //can spaces in gameboard be modified in game?
            }
        }
        
        //to remove blocks:
        //iterate through blocks on this layer, make 1st block a parent of subsequent blocks, delete parent block
        //landed - array of blocks/meshes, if block.position.y = layer -> delete
        // for (var i = 0; i < this._landed.length; i++) {
        //     var position = this._landed[i].position;
        //     if (position.y === layer) {
        //         //delete mesh in 3d world, but doesn't delete element in landed array
        //         this._landed[i].dispose(); //deleting each block separately - inefficient
        //     }
        // }

        this._scene.blockfreeActiveMeshesAndRenderingGroups = true;

        var parent: BABYLON.Mesh;
        var first = true;

        for (var i = 0; i < this._landed.length; i++) { 
            if (this._landed[i].position.y === layer && first) {
                parent = this._landed[i]; //cube that makes up block at y lvl/height should be cleared 
                first = false;
            }
            else if (this._landed[i].position.y === layer) {
                this._landed[i].parent = parent;
            }

        }
        parent.dispose(); //WARNING! SHOULD ONLY DELETE CUBE PARTS OF EACH BLOCK - NEED POSITIONS OF EACH BLOCK THAT MAKES UP MESH - remove its parent setParent(null)

        this._scene.blockfreeActiveMeshesAndRenderingGroups = false;

        for (var j = this._landed.length - 1; j >= 0; j--) { //delete landed elements that have been disposed
            if (this._landed[j].position.y === layer) {
                this._landed.splice(j, 1); //remove cube mesh fr array
            }
        }
    }

    //cascade method
    private collapseLayers(layerNums: number[], size: number, height: number): void { //layers (above) will all move down 1 after full layer disappears
        
        //move down each element in array?, top layer all defaulted to false (unoccupied)
        //update spaces - for each position of landed blocks? - where its not landed - space = true
        //checkfullLayer (for new filled lines once blocks above are now landed)

        //case: double full layer - clear both layers, then shift layers 2 above 1st layer down 2
        //if elements of layerNums right after each other - track how many times, shift layers above down #times
        //case: if layerNums not right after another but multiple - start with lowest layer (y) - 1st element

        //cleared layer(s) 1st -> shift down layers above cleared layers: collapse function
        //1) top layer that was cleared -> shift above layers down 1st - start w/smallest y (topmost layer)
        //2) then bottom-most layer that was cleared -> shift down 2nd

        //change spaces array -> y layer that was cleared already set to false -> everything that is true shifted one down, layer by layer, and previous position set to false/empty?
        //topmost layer that has blocks (space = true) shifted down -> layer it was in all set to false; (so above layers already set to false)
        //use landed array -> change positions.y of any block above y to positions.y-1, IF space = false
            //actually pos.y shifted down as far as it can if it none of it collides with other blocks ->just use movewithcollisions (and stop on collide?)
            //move blocks 1st and THEN update pos??
        

        //move each block layer down 1 at a time and update spaces each layer at a time: start from bottom
        for (var i = 0; i < layerNums.length; i++) { //for each layer that was cleared

            for (var y = layerNums[i] + 1; y >= 0; y--) { //go fr layer above cleared layer to top-most layer
                //and shift blocks down if space below = true
                //iterate through SPACES
                for (var x = 0; x < size; x++) {
                    for (var z = 0; z < size; z++) {
                        if (y === height-1) { //11th y layer - bottommost layer (height-1)
                            //shift everything above down AS CUBES? OR BLOCKS?? OR PART OF BLOCKS? CUBES REMEMBER WHAT BLOCK obj THEY WERE?
                            //if TYPE of cube in landed is same
                        }
                        else if (this._gameBoard.spaces[x][y-1][z] === true) {
                            //shift down block (check typeOf - same type moves down together)
                            //iterate through LANDED - move each block at this height, x&z down (BLOCK NOT BROKEN APART YET-ONLY WHEN COLLAPSING)
                        }
                    }
                }
            }

        }


        //updateSpaces(getpositions(this._landed))??? to translate fr pos of blocks to space
        //this.checkFullLayer(); //once collapsed, check for new full layers
    }

    //1st - delete full layer of blocks
    //for each block in landed array - update positions
    //check layer again once you collapsed - break out of this once checkLayer -> false
    //each block above layer goes down 1 y

    private shiftLayer() {
        //for now, shift each block down 1 (assume layer on ground)
    }

    private enableControls() {
        //keyboard controls on block
        //everytime block moves, this._gameBoard.updateSpaces()

        //is there an ActiveBlock? - check layer after a block locks into place (no active blocks) - if (collided)
        //gameBoard.checkFullLayer() -> .clearLayer() -> this.collapseLayers()
        //if collided (block's isactive = false - block only moves when isactive is true), store block in landed (position) - 3d array

        //motions
        var rotation = Math.PI / 2;
        scene.onKeyboardObservable.add((kbInfo) => { 
            if (this._collided) {
                this._block.position = this._colpt;
                //collided = false; //reset once block landed - onexit

                //break apart block -> actually do in CLEARLAYER?
                //store each cube in landed
                //UPDATE SPACES ACCORDINGLY! - pass in each position of cubes in landed
                this.checkFullLayer();
                //clear all layers 1st, then shift layers down?
                //after this can spawn new block (need observer?)

                //in keyboard controls, check space to left, right, up, & down... rotations
                //check if it can move, if potential move is in border space - 
            }
            else {
                switch (kbInfo.type) {
                    case BABYLON.KeyboardEventTypes.KEYDOWN:
                        switch (kbInfo.event.key) {
                            case "a": //left
                                this._block.position.x -= 1;
                            break;

                            case "d": //right
                                this._block.position.x += 1;
                            break;

                            case "w": //forward
                                this._block.position.z += 1;
                            break;

                            case "s": //backward
                                this._block.position.z -= 1;
                            break;

                            case " ": //down
                                this._block.position.y -= 1;
                            break;

                            case "z":
                                //rotating, if block would be in a position not found in positions array - can't move (get preview)
                                this._block.rotate(BABYLON.Axis.X, rotation, BABYLON.Space.WORLD); //rotate child 1st to se if it intersects?
                                break;

                            case "x":
                                this._block.rotate(BABYLON.Axis.Y, -rotation, BABYLON.Space.WORLD);
                                break;

                            case "c":
                                this._block.rotate(BABYLON.Axis.Z, -rotation, BABYLON.Space.WORLD); 
                                break;
                        }
                        //updateSpaces?
                    break;
                }
            }   
        });
    }

    private gameOver() {
        //isgameboardfull
    }
}