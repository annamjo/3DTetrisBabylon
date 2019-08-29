var Game = /** @class */ (function () {
    function Game(size, scene) {
        var _this = this;
        this.scene = scene;
        this.gameBoard = new GameBoard(size, scene); //7 or 5
        this.collided = false;
        this.enableControls();
        this._landed = new Array();
        this._rotation = Math.PI / 2;
        this.gameOver = false;
        this._scoreCount = 0;
        this._score = new BABYLON.GUI.TextBlock("score");
        this._score.text = "Score : 0";
        this._score.fontFamily = "Agency FB";
        this._score.color = "white";
        this._score.fontSize = 50;
        this._score.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
        this._score.textVerticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
        this._score.left = -20;
        this._score.top = 20;
        BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI").addControl(this._score);
        //loop for drawing block...
        this.drawBlock();
        scene.registerBeforeRender(function () {
            // if (this.gameOver) {
            //     clearInterval(this.fallingInterval);
            // }
            if (_this.collided) { //this.gameBoard.inGrid(this.block.getPositions())
                console.log("collided");
                clearInterval(_this.fallingInterval); //compute world matrix?
                // this.collided = true; //to disable controls??
                //isactive = false;
                // this._dummy.parentCube.dispose();
                _this.setLanded();
                _this.checkFullLayer(); //IF landed.length > 0
                _this.isGameOver();
                if (!_this.isGameOver()) { //call game over when first draw block? store as var/prop?
                    _this.collided = false;
                    _this.drawBlock();
                }
            }
        });
    }
    Game.prototype.drawBlock = function () {
        //randomize block - array of options (string or number); spawn a random block: switch case
        //can block be drawn without hitting anything? - start height outside of grid (!ingrid), only update spaces if inside grid/active
        //if inactive - -3 <= pos.x <= 3 and -3 <= pos.z <= 3
        // this.collided = false;
        var _this = this;
        var random = Math.floor(Math.random() * 8); //generates numbers from 0-7
        // random = 5;
        //change randomizer later
        //limitation: can only move block once fully in grid
        switch (random) {
            case 0:
                this.block = new Cube(this.scene);
                console.log("drew cube");
                break;
            case 1:
                this.block = new ShortTower(this.scene); //Collapsing X Rotation
                console.log("drew st");
                // this._dummy = new ShortTower();
                break;
            case 2:
                this.block = new BigTower(this.scene); //acts as if already collided when spawned?
                console.log("drew big tower");
                // this._dummy = new BigTowerb();
                break;
            case 3:
                this.block = new MiniL(this.scene); //X collapse
                console.log("drew ml");
                // this._dummy = new MiniLb();
                break;
            case 4:
                this.block = new BigL(this.scene);
                console.log("drew bl");
                // this._dummy = new BigLb();
                break;
            case 5:
                this.block = new bigcube(this.scene);
                console.log("drew bc");
                break;
            case 6:
                this.block = new TBlock(this.scene);
                console.log("drew t");
                // this._dummy = new TBlockb();
                break;
            case 7:
                this.block = new ZBlock(this.scene);
                console.log("drew z");
                // this._dummy = new ZBlockb();
                break;
        }
        // this._dummy.parentCube.setParent(this.block.parentCube); //position??
        // this._dummy.parentCube.position = new BABYLON.Vector3(0, 0, 0);
        // this._dummy.parentCube.visibility = 0;
        console.log("1, called check col");
        this.checkCollision();
        this.fallingInterval = setInterval(function () {
            //!this.collided
            if (_this.gameBoard.inGrid(_this.block.getPositions()) === false) { //for when block first spawned
                // this.collided = false;
                _this.fixRotationOffset();
                _this.block.position.y -= 1;
            }
            else if (_this.gameBoard.inGrid(_this.block.getPositions()) && _this.gameBoard.canMove(_this.block.getPositions(), "down") === false) {
                console.log("1, changed collided");
                _this.collided = true;
            }
            else if (_this.gameBoard.inGrid(_this.block.getPositions()) && _this.checkCollision() === false && _this.gameBoard.canMove(_this.block.getPositions(), "down")) {
                console.log("2, called check col");
                _this.block.position.y -= 1;
                _this.fixRotationOffset();
                _this.gameBoard.updateSpaces(_this.block.getPositions(), true, false);
            }
            console.log(_this.gameBoard.spaces);
        }, 1250); //1500    
    };
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
    //             this._dummy.rotate("x", -this._rotation); //reset rotation of dummy
    //             break;
    //         case "y":
    //             this._dummy.rotate("y", this._rotation);
    //             console.log("y", this._dummy.parentCube.visibility);
    //             occupied = this.gameBoard.isOccupied(this.block.getPositions(), this._dummy.getPositions());
    //             inBounds = this.gameBoard.inGrid(this._dummy.getPositions());
    //             this._dummy.rotate("y", -this._rotation);
    //             break;
    //         case "z":
    //             this._dummy.rotate("z", this._rotation);
    //             console.log("z", this._dummy.parentCube.visibility);
    //             occupied = this.gameBoard.isOccupied(this.block.getPositions(), this._dummy.getPositions());
    //             inBounds = this.gameBoard.inGrid(this._dummy.getPositions());
    //             this._dummy.rotate("x", -this._rotation);
    //             break;
    //     }   
    //     if (occupied === false && inBounds === true) { //occupied is false - can rotate
    //         return true;
    //     }
    //     return false;
    // }
    Game.prototype.fixRotationOffset = function () {
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
    };
    Game.prototype.checkCollision = function () {
        //either y = 11 (ground lvl)(height -1), or block right ontop of another mesh (y+1 -> space = true)
        console.log("in check collisions");
        var groundlvl = this.gameBoard.groundlvl;
        var groundtrack = 0;
        for (var i = 0; i < this.block.getPositions().length; i++) {
            if (this.block.getPositions()[i].y === groundlvl) {
                groundtrack++;
            }
        }
        if (groundtrack > 0) {
            this.collided = true;
            console.log("true");
            return true;
        }
        return false;
    };
    Game.prototype.setLanded = function () {
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
            arr.push(this._landed[el].position); //abs pos?
        }
        console.log(arr); //!!
        console.log(this.block.getRelPos());
        this.gameBoard.updateSpaces(arr, false, true);
    };
    //not just for bottom layer, but for any layer
    Game.prototype.checkFullLayer = function () {
        var height = this.gameBoard.height;
        var size = this.gameBoard.size;
        var fullLayer;
        var layerNums = new Array(); //which layers are cleared? .length = 0 if no full layers
        var layerheight = null;
        //single layer - same y coordinate
        for (var y = 0; y < height; y++) { //for each layer of y height...
            fullLayer = true;
            for (var x = 0; x < size; x++) {
                for (var z = 0; z < size; z++) {
                    if (this.gameBoard.spaces[x][y][z] === false) { //if element in layer in false
                        fullLayer = false;
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
                this._scoreCount += size * size;
                this.updateScore(this._scoreCount);
                fullLayer = false;
            } //when block is at y = 0, game over?
        }
        if (layerNums.length > 0) { //collpase only if full layers exist and were cleared - when layerNums has >0 elements
            this.collapseLayers(layerNums, size, height);
        }
        //if layerNums has no elements, no layers were full and cleared, so no need to collapse layers - base case
    };
    //in spaces array and remove meshes -> block.dispose() -> landed array
    Game.prototype.clearLayer = function (layer, layerheight, size) {
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
        this.scene.blockfreeActiveMeshesAndRenderingGroups = true; //for optimization
        for (var i = 0; i < this._landed.length; i++) {
            var position = this._landed[i].position;
            if (position.y === layerheight) {
                //delete mesh in 3d world, but doesn't delete element in landed array
                this._landed[i].dispose(); //deleting each block separately
                this._landed[i] = null;
                console.log("cleared block");
            }
        }
        this.scene.blockfreeActiveMeshesAndRenderingGroups = false;
        console.log(this._landed);
        for (var j = this._landed.length - 1; j >= 0; j--) { //delete landed elements that have been disposed
            if (this._landed[j] === null) {
                this._landed.splice(j, 1); //remove cube mesh fr landed array
            }
        }
        console.log(this._landed);
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
                        if (this.gameBoard.compare(landedPos[i], x, y, z) === true) { //if yes, mesh at that pos to be shifted down
                            console.log(landedPos);
                            //each block above layer goes down 1 y until reach lowest y   
                            //and shift blocks down if space below = true  
                            layer = y + 1;
                            console.log(this.gameBoard.spaces);
                            console.log(this.gameBoard.spaces[x][layer][z] === false && layer < height);
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
    };
    //keyboard controls for active block
    Game.prototype.enableControls = function () {
        //everytime block moves, this._gameBoard.updateSpaces()
        //is there an ActiveBlock? - check layer after a block locks into place (no active blocks) - if (collided)
        //gameBoard.checkFullLayer() -> .clearLayer() -> this.collapseLayers()
        //if collided (block's isactive = false - block only moves when isactive is true), store block in landed (position) - 3d array
        var _this = this;
        // this.scene.actionManager = new BABYLON.ActionManager(this.scene);
        // this.scene.actionManager.registerAction(
        //     new BABYLON.ExecuteCodeAction(
        //         {
        //             trigger: BABYLON.ActionManager.OnKeyDownTrigger,
        //             parameter: ' '
        //         },
        //         function () { 
        //             if (this.gameBoard.canMove(this.block.getPositions(), "down") === false) {
        //                 this.collided = true;
        //             }
        //         }
        //     )
        // );
        //motions
        this.scene.onKeyboardObservable.add(function (kbInfo) {
            console.log("3, called check col");
            if (_this.gameBoard.inGrid(_this.block.getPositions())) {
                // this.block.recouple();
                _this.fixRotationOffset();
                _this.checkCollision(); //&& this.gameBoard.inGrid(this.block.getPositions())
            }
            if (!_this.collided) { //when block 1st drawn, outside of grid, cant use keyboard
                _this.fixRotationOffset();
                switch (kbInfo.type) {
                    case BABYLON.KeyboardEventTypes.KEYDOWN:
                        switch (kbInfo.event.key) {
                            case "w": //forward
                                if (_this.gameBoard.inGrid(_this.block.getPositions()) && _this.gameBoard.canMove(_this.block.getPositions(), "forward")) {
                                    // this.block.recouple(); //must call recouple after you call getPositions
                                    _this.block.position.z += 1;
                                }
                                break;
                            case "s": //backward
                                if (_this.gameBoard.inGrid(_this.block.getPositions()) && _this.gameBoard.canMove(_this.block.getPositions(), "back")) {
                                    // this.block.recouple();
                                    _this.block.position.z -= 1;
                                }
                                break;
                            case "a": //left
                                if (_this.gameBoard.inGrid(_this.block.getPositions()) && _this.gameBoard.canMove(_this.block.getPositions(), "left")) {
                                    // this.block.recouple();
                                    _this.block.position.x -= 1;
                                }
                                break;
                            case "d": //right
                                if (_this.gameBoard.inGrid(_this.block.getPositions()) && _this.gameBoard.canMove(_this.block.getPositions(), "right")) {
                                    // this.block.recouple();
                                    _this.block.position.x += 1;
                                }
                                break;
                            case " ": //down
                                //BUG: continuous space bar-canMove not called fast enought, mesh intersect
                                if (_this.gameBoard.inGrid(_this.block.getPositions()) && _this.gameBoard.canMove(_this.block.getPositions(), "down")) {
                                    // this.block.recouple();
                                    _this.block.position.y -= 1;
                                }
                                else if (_this.gameBoard.inGrid(_this.block.getPositions()) && _this.gameBoard.canMove(_this.block.getPositions(), "down") === false) {
                                    // this.block.recouple(); //need?
                                    console.log("2, changed collided");
                                    _this.collided = true;
                                }
                                console.log("going dowwwwwnnnnnnn");
                                break;
                            case "z":
                                //rotating, if block would be in a position not found in positions array - can't move (get preview)
                                // if (this.canRotate("x")) {
                                console.log("rotate x");
                                _this.block.rotate("x", _this._rotation); //rotate child 1st to se if it intersects?
                                _this.fixRotationOffset();
                                console.log("rotating x");
                                // console.log(this.block.getPositions());
                                // this.block.recouple();
                                // }
                                break;
                            case "x":
                                // if (this.canRotate("y")) {
                                console.log("rotate y");
                                _this.block.rotate("y", _this._rotation);
                                _this.fixRotationOffset();
                                console.log("rotating y");
                                // }
                                break;
                            case "c":
                                // if (this.canRotate("z")) {
                                console.log("rotate z");
                                _this.block.rotate("z", _this._rotation);
                                _this.fixRotationOffset();
                                console.log("rotating z");
                                // }
                                break;
                        }
                        _this.fixRotationOffset();
                        _this.gameBoard.updateSpaces(_this.block.getPositions(), true, false);
                        // this.block.recouple();
                        console.log(_this.gameBoard.spaces); //affected by rotations?
                        console.log(_this.gameBoard.inGrid(_this.block.getPositions()));
                        // this.checkCollision();
                        console.log("about to break");
                        break;
                }
            }
        });
    };
    Game.prototype.updateScore = function (newScore) {
        this._score.text = "Score : " + newScore;
    };
    Game.prototype.isGameOver = function () {
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
    };
    return Game;
}());
//# sourceMappingURL=Game.js.map