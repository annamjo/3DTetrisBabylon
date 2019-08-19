// import { gameboard as Gameboard } from './GameBoard';
// export
var Game = /** @class */ (function () {
    function Game(size) {
        this._gameBoard = new Gameboard(size);
        this.enableControls();
        //animation loop? or in game?
    }
    Game.prototype.drawBlock = function () {
        //randomize block - array of options (string or number); spawn a random block: switch case
    }; //draw drop preview?
    Game.prototype.getNextBlock = function () {
        //randomize block here?
    }; //also preview next block
    //not just for bottom layer, but for any layer
    Game.prototype.checkFullLayer = function () {
        var height = this._gameBoard.height;
        var size = this._gameBoard.size;
        var fullLayer;
        var layerNums = new Array(); //which layers are cleared? .length = 0 if no full layers
        //single layer - same y coordinate
        for (var y = 0; y < height; y++) { //for each layer of y height...
            fullLayer = true;
            for (var x = 0; x < size; x++) {
                for (var z = 0; z < size; z++) {
                    if (this._gameBoard.spaces[x][y][z] === false) {
                        fullLayer = false;
                    }
                }
            }
            if (fullLayer) { //clear everytime you encounter full layer
                layerNums.push(y);
                this.clearLayer(y, size);
            }
        }
        if (layerNums.length > 0) { //collpase only if full layers exist and were cleared - when layerNums has >0 elements
            this.collapseLayers(layerNums);
        }
        //if layerNums has no elements, no layers were full and cleared, so no need to collapse layers - base case
    };
    //in spaces array and remove meshes -> block.dispose()
    Game.prototype.clearLayer = function (layer, size) {
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
        var parent;
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
        parent.dispose(); //WARNING! ONLY DELETE CUBE PARTS OF EACH BLOCK - NEED POSITIONS OF EACH BLOCK THAT MAKES UP MESH - remove its parent setParent(null)
        for (var j = this._landed.length - 1; j >= 0; j--) { //delete landed elements that have been disposed
            if (this._landed[j].position.y === layer) {
                this._landed.splice(j, 1); //remove mesh fr array
            }
        }
    };
    /** PSUDOCODE FOR COLLAPSE LAYERS **/
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
    //updateSpaces(getpositions(this._landed))??? to translate fr pos of blocks to space
    //this.checkFullLayer(); //once collapsed, check for new full layers
    Game.prototype.collapseLayers = function (layerNums) {
        //layerNums is an array of numbers that stores all the y-values to be cleared
        /*
         *  What's happening? aka Understanding the Logic...
         *  Every number in the layerNums array is a y-plane that is full; it needs to be cleared.
         *  The collapseLayers function is called after the layers have been cleared.
         *
         *  Traverse through the array of landed blocks (already converted to solo cubes), and if the space underneath
         *  them is clear, drop them down.
         *
         *  When you traverse the array, you have to start from the bottom because the bottom pieces must collapse and
         *  make room for the higher pieces.
         */
        var y = layerNums[layerNums.length - 1]; //starts from lowest layer cleared
        //TO-DO: Implement this
        for (var x = 0; x < this._landed.length; x++) {
            for (y; y >= 0; y--) {
                for (var z = 0; z < this._landed[x][y].length; z++) {
                    while (this._landed[x][y + 1][z] === false) { //should be while position under block is empty...
                        //remove from array
                        //move piece down
                        //place block in array
                    }
                }
            }
        }
        /*
         *  Iterate layerNums loop
         *  Start with the higher y number (lowest layer)
         *  Traverse through each position on that y-plane
         */
        for (y; y >= 0; y--) {
            for (x = 0; x < size; x++) {
                for (z = 0; z < size; z++) {
                    //if spot underneath piece is empty
                    //move piece down
                    //place piece in array
                }
            }
        }
    };
    //1st - delete full layer of blocks
    //for each block in landed array - update positions
    //check layer again once you collapsed - break out of this once checkLayer -> false
    //each block above layer goes down 1 y
    Game.prototype.enableControls = function () {
        //keyboard controls on block
        //everytime block moves, this._gameBoard.updateSpaces()
        //is there an ActiveBlock? - check layer after a block locks into place (no active blocks) - if (collided)
        //gameBoard.checkFullLayer() -> .clearLayer() -> this.collapseLayers()
        //if collided (block's isactive = false - block only moves when isactive is true), store block in landed (position) - 3d array
        var collided;
        if (collided) {
            this.checkFullLayer();
            //clear all layers 1st, then shift layers down?
            //after this can spawn new block (need observer?)
        }
    };
    Game.prototype.gameOver = function () {
        //isgameboardfull
    };
    return Game;
}());
// export { Game as game };
//# sourceMappingURL=Game.js.map