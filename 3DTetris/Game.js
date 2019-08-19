/*import {GameBoard} from './GameBoard.js';*/
var Game = /** @class */ (function () {
    function Game(size, scene) {
        var _this = this;
        this.scene = scene;
        this.gameBoard = new GameBoard(size); //7 or 5
        this.score = 0;
        this.collided = false;
        this.enableControls();
        this._landed = new Array(); //push landed elements/blocks
        this._rotation = Math.PI / 2;
        //loop for drawing block...
        this.drawBlock();
        scene.registerBeforeRender(function () {
            //updateSpaces()?
            if (_this.checkCollision() === true) { //box collision
                clearInterval(_this.fallingInterval); //compute world matrix?
                _this.collided = true; //to disable controls
                //isactive = false;
                _this._dummy.parentCube.dispose();
                _this.setLanded();
                _this.checkFullLayer(); //IF landed.length > 0
                if (!_this.gameOver()) {
                    _this.drawBlock();
                }
            }
        });
    }
    Game.prototype.drawBlock = function () {
        var _this = this;
        //randomize block - array of options (string or number); spawn a random block: switch case
        //can block be drawn without hitting anything? - start height outside of grid (!ingrid), only update spaces if inside grid/active
        //if inactive - -3 <= pos.x <= 3 and -3 <= pos.z <= 3
        this.collided = false;
        var random = Math.floor(Math.random() * 8); //generates numbers from 0-7
        //change randomizer later
        //limitation: can only move block once fully in grid
        switch (random) {
            case 0:
                this.block = new Cube();
                this._dummy = new Cube();
                break;
            case 1:
                this.block = new ShortTower();
                this._dummy = new ShortTower();
                break;
            case 2:
                this.block = new BigTower();
                this._dummy = new BigTower();
                break;
            case 3:
                this.block = new MiniL();
                this._dummy = new MiniL();
                break;
            case 4:
                this.block = new BigL();
                this._dummy = new BigL();
                break;
            case 5:
                this.block = new BigCube();
                this._dummy = new BigCube();
                break;
            case 6:
                this.block = new TBlock();
                this._dummy = new TBlock();
                break;
            case 7:
                this.block = new ZBlock();
                this._dummy = new ZBlock();
                break;
        }
        this._dummy.parentCube.visibility = 0;
        this._dummy.parentCube.parent = this.block.parentCube;
        this.fallingInterval = setInterval(function () {
            //!this.collided
            if (_this.checkCollision() === false && _this.gameBoard.canMove(_this.block.getPositions(), "down")) { //need check col?
                _this.block.recouple();
                _this.block.position.y -= 1;
                _this.gameBoard.updateSpaces(_this.block.getPositions(), true, false);
            }
        }, 1250); //1500
    };
    //draw drop preview
    // private getNextBlock() { //for preview of next block
    //     //randomize block here?
    // }
    Game.prototype.canRotate = function (axis) {
        //create dummy obj/instance of same block (has same properties?) before actually moving
        //compare dummy's positions (its array) with positions of gameboard
        //ingrid, isoccupied
        var occupied;
        var inBounds;
        switch (axis) {
            case "x":
                this._dummy.rotate("x", this._rotation); //rotating dummy doesn't affect parent
                occupied = this.gameBoard.isOccupied(this.block.getPositions(), this._dummy.getPositions());
                inBounds = this.gameBoard.inGrid(this._dummy.getPositions());
                this._dummy.recouple();
                this._dummy.rotate("x", -this._rotation); //reset rotation of dummy
                break;
            case "y":
                this._dummy.rotate("y", this._rotation);
                occupied = this.gameBoard.isOccupied(this.block.getPositions(), this._dummy.getPositions());
                inBounds = this.gameBoard.inGrid(this._dummy.getPositions());
                this._dummy.recouple();
                this._dummy.rotate("y", -this._rotation);
                break;
            case "z":
                this._dummy.rotate("z", this._rotation);
                occupied = this.gameBoard.isOccupied(this.block.getPositions(), this._dummy.getPositions());
                inBounds = this.gameBoard.inGrid(this._dummy.getPositions());
                this._dummy.recouple();
                this._dummy.rotate("x", -this._rotation);
                break;
        }
        if (occupied === false && inBounds === true) { //occupied is false - can rotate
            return true;
        }
        return false;
    };
    Game.prototype.checkCollision = function () {
        //if block 1 y above ground or another mesh -> considered landed/collided
        //if collided - delete dummy
        //either y = 11 (ground lvl)(height -1), or block right ontop of another mesh (y+1 -> space = true)
        var groundlvl = this.gameBoard.height - 1;
        var groundtrack = 0;
        var arr = this.block.getPositions();
        for (var i = 0; i < arr.length; i++) {
            if (arr[i].y === groundlvl) {
                groundtrack++;
            }
        }
        var rightAbove = false;
        if (this.gameBoard.canMove(arr, "down") === false) {
            rightAbove = true;
        }
        this.block.recouple();
        if (groundtrack > 0 || rightAbove) {
            return true;
        }
        return false;
    };
    Game.prototype.setLanded = function () {
        this.block.uncouple();
        var arr = this.block.cubes;
        for (var i = 0; i < arr.length; i++) {
            this._landed.push(arr[i]);
        }
        this._landed.push(this.block.parentCube);
    };
    //not just for bottom layer, but for any layer
    Game.prototype.checkFullLayer = function () {
        var height = this.gameBoard.height;
        var size = this.gameBoard.size;
        var fullLayer;
        var layerNums = new Array(); //which layers are cleared? .length = 0 if no full layers
        //single layer - same y coordinate
        for (var y = 0; y < height; y++) { //for each layer of y height...
            fullLayer = true;
            for (var x = 0; x < size; x++) {
                for (var z = 0; z < size; z++) {
                    if (this.gameBoard.spaces[x][y][z] === false) { //if element in layer in false
                        fullLayer = false;
                        //fullLayer stays true if element in layer never = false
                    }
                }
            }
            if (fullLayer) { //clear everytime you encounter full layer
                this.clearLayer(y, size);
                if (y !== 0) {
                    layerNums.push(y); //stores which layers were cleared, used to collapse layer
                }
                this.score += size * size;
            } //when block is at y = 0, game over?
        }
        if (layerNums.length > 0) { //collpase only if full layers exist and were cleared - when layerNums has >0 elements
            this.collapseLayers(layerNums, size, height);
        }
        //if layerNums has no elements, no layers were full and cleared, so no need to collapse layers - base case
    };
    //in spaces array and remove meshes -> block.dispose() -> landed array
    Game.prototype.clearLayer = function (layer, size) {
        //clear layer in spaces array - in horizontal plane of same y
        for (var x = 0; x < size; x++) {
            for (var z = 0; z < size; z++) {
                this.gameBoard.spaces[x][layer][z] = false;
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
            //cube that makes up block at y lvl/height should be cleared 
            if (this._landed[i].position.y === layer && first) {
                parent = this._landed[i]; //makes 1st block the parent
                first = false;
            }
            else if (this._landed[i].position.y === layer) {
                this._landed[i].parent = parent;
            }
        }
        scene.blockfreeActiveMeshesAndRenderingGroups = true;
        parent.dispose(); //removes cube parts of block (as stored in landed arr - blocks uncoupled onced landed- dont recouple)
        parent = null;
        scene.blockfreeActiveMeshesAndRenderingGroups = false;
        for (var j = this._landed.length - 1; j >= 0; j--) { //delete landed elements that have been disposed
            if (this._landed[j].position.y === layer) {
                this._landed.splice(j, 1); //remove cube mesh fr landed array
            }
        }
    };
    Game.prototype.collapseLayers = function (layerNums, size, height) {
        //move down each element in landed array at specific y layer
        //cases: double layers cleared; if layerNums not right after another but multiple - start with lowest layer (y) - last element
        //cleared layer(s) 1st -> shift down layers above cleared layers: collapse function
        //use landed array -> change positions.y of any block above y to positions.y-1, IF space = false
        //actually pos.y shifted down as far as it can if it none of it collides with other blocks
        //move blocks 1st and THEN update pos
        //move each cube down 1 at a time and update spaces each layer at a time: start from bottom
        //cascade method (implement later): same type of block shifts down together, cube remembers which part of block it was
        //this method: each cube in landed goes down if space below empty/false, does this until space below is true
        //store landed block's positions (for updateSpaces)
        var landedPos = new Array(this._landed.length);
        for (var el = 0; el < this._landed.length; el++) {
            landedPos[el] = this._landed[el].position;
        }
        //start 1 from the lowest layer cleared:
        var y = layerNums[layerNums.length - 1] - 1; //ground lvl: y = 11 (height-1); assuming layer isn't y = 0 (top)
        for (y; y >= 0; y--) {
            for (var x = 0; x < size; x++) {
                for (var z = 0; z < size; z++) {
                    for (var i = 0; i < this._landed.length; i++) {
                        //see if position in landed same as in position arr in gameboard - should only find 1 match at this xyz
                        if (this.gameBoard.compare(this._landed[i].position, x, y, z) === true) { //if yes, mesh at that pos shifted down
                            //each block above layer goes down 1 y until reach lowest y   
                            //and shift blocks down if space below = true  
                            var layer = y + 1;
                            while (this.gameBoard.spaces[x][layer][z] === false && layer < height) {
                                this._landed[i].position.y -= 1; //shift down cube in 3d world
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
        this.checkFullLayer(); //once collapsed, check for new full layers - runtime error?
        //check layer again once you collapsed - break out of this once checkLayer -> false
    };
    //keyboard controls for active block
    Game.prototype.enableControls = function () {
        //everytime block moves, this._gameBoard.updateSpaces()
        //is there an ActiveBlock? - check layer after a block locks into place (no active blocks) - if (collided)
        //gameBoard.checkFullLayer() -> .clearLayer() -> this.collapseLayers()
        //if collided (block's isactive = false - block only moves when isactive is true), store block in landed (position) - 3d array
        var _this = this;
        //motions
        scene.onKeyboardObservable.add(function (kbInfo) {
            if (!_this.collided && _this.gameBoard.inGrid(_this.block.getPositions())) { //when block 1st drawn, outside of grid, cant use keyboard
                switch (kbInfo.type) {
                    case BABYLON.KeyboardEventTypes.KEYDOWN:
                        switch (kbInfo.event.key) {
                            case "w": //forward
                                if (_this.gameBoard.canMove(_this.block.getPositions(), "forward")) {
                                    _this.block.recouple(); //must call recouple after you call getPositions
                                    _this.block.position.z += 1;
                                }
                                break;
                            case "s": //backward
                                if (_this.gameBoard.canMove(_this.block.getPositions(), "back")) {
                                    _this.block.recouple();
                                    _this.block.position.z -= 1;
                                }
                                break;
                            case "a": //left
                                if (_this.gameBoard.canMove(_this.block.getPositions(), "left")) {
                                    _this.block.recouple();
                                    _this.block.position.x -= 1;
                                }
                                break;
                            case "d": //right
                                if (_this.gameBoard.canMove(_this.block.getPositions(), "right")) {
                                    _this.block.recouple();
                                    _this.block.position.x += 1;
                                }
                                break;
                            case " ": //down
                                if (_this.gameBoard.canMove(_this.block.getPositions(), "down")) {
                                    _this.block.recouple();
                                    _this.block.position.y -= 1;
                                }
                                break;
                            case "z":
                                //rotating, if block would be in a position not found in positions array - can't move (get preview)
                                if (_this.canRotate("x")) {
                                    _this.block.rotate("x", _this._rotation); //rotate child 1st to se if it intersects?
                                }
                                break;
                            case "x":
                                if (_this.canRotate("y")) {
                                    _this.block.rotate("y", _this._rotation);
                                }
                                break;
                            case "c":
                                if (_this.canRotate("z")) {
                                    _this.block.rotate("z", _this._rotation);
                                }
                                break;
                        }
                        _this.gameBoard.updateSpaces(_this.block.getPositions(), true, false);
                        _this.block.recouple();
                        // this.checkCollision();
                        break;
                }
            }
        });
    };
    Game.prototype.gameOver = function () {
        //isgameboardfull  - if space at y = 0 is full (after active block landed, before new block drawn)
        //at least one block pos at y = 0 and another block directly under it
        //and !ingrid()
        //if collided and !ingrid -> game over
        //remove keyboard observable?
        return false; //will make game loop forever
    };
    return Game;
}());
//# sourceMappingURL=Game.js.map