var Game = /** @class */ (function () {
    // private _dummy: Block;
    function Game(size, scene) {
        var _this = this;
        this.scene = scene;
        this.gameBoard = new GameBoard(size, scene); //7 or 5
        this.collided = false;
        this.enableControls();
        this._landed = new Array();
        this._rotation = Math.PI / 2;
        this.gameOver = false;
        this.scoreCount = 0;
        this._score = new BABYLON.GUI.TextBlock("score");
        this._score.text = "Score : " + this.scoreCount;
        this._score.fontFamily = "Agency FB";
        this._score.color = "white";
        this._score.fontSize = 50;
        this._score.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
        this._score.textVerticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
        this._score.left = -20;
        this._score.top = 20;
        BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI").addControl(this._score);
        // var music = new BABYLON.Sound("Music", "tetris theme.mp3", this.scene, null, { loop: true, autoplay: true });
        // var myAudio = document.createElement("audio");
        // myAudio.src = "tetris theme.mp3";
        // myAudio.play();
        //loop for drawing block...
        this.drawBlock();
        scene.registerBeforeRender(function () {
            if (_this.gameOver) {
                clearInterval(_this.fallingInterval);
            }
            if (_this.collided) { //this.gameBoard.inGrid(this.block.getPositions())
                console.log("collided");
                clearInterval(_this.fallingInterval);
                // this.collided = true; //to disable controls
                // this._dummy.parentCube.dispose();
                // this.isGameOver();
                _this.setLanded();
                _this.checkFullLayer(); //IF landed.length > 0
                if (!_this.isGameOver()) { //calls and checks for game over, gameOver also stored as boolean
                    _this.collided = false;
                    _this.drawBlock();
                }
            }
        });
    }
    Game.prototype.drawBlock = function () {
        //after 1st block drawn, spawn a random block whenever a block lands/collides
        //draw block without hitting other blocks - start height above grid (!ingrid), only update spaces arr if inside grid & active
        // this.collided = false;
        var _this = this;
        //goal: randomize even more
        var random = Math.floor(Math.random() * 8); //generates numbers from 0-7
        //limitation: can only move block once fully in grid, but can rotate outside of grid
        switch (random) {
            case 0:
                this.block = new Cube(this.scene);
                break;
            case 1:
                this.block = new ShortTower(this.scene); //Collapsing X Rotation
                break;
            case 2:
                this.block = new BigTower(this.scene); //acts as if already collided when spawned?
                break;
            case 3:
                this.block = new MiniL(this.scene); //X collapse
                break;
            case 4:
                this.block = new BigL(this.scene);
                break;
            case 5:
                this.block = new BigCube(this.scene);
                break;
            case 6:
                this.block = new TBlock(this.scene);
                break;
            case 7:
                this.block = new ZBlock(this.scene);
                break;
        }
        this.checkCollision();
        this.fallingInterval = setInterval(function () {
            //!this.collided
            if (_this.gameBoard.inGrid(_this.block.getPositions()) === false && _this.gameBoard.canMove(_this.inGridPositions(), "down") === false) {
                _this.gameOver = true;
            }
            if (_this.gameBoard.inGrid(_this.block.getPositions()) === false) { //for when block first spawned
                _this.fixRotationOffset();
                _this.block.position.y -= 1;
            }
            else if (_this.gameBoard.inGrid(_this.block.getPositions()) && _this.gameBoard.canMove(_this.block.getPositions(), "down") === false) {
                _this.collided = true;
            }
            else if (_this.gameBoard.inGrid(_this.block.getPositions()) && _this.checkCollision() === false && _this.gameBoard.canMove(_this.block.getPositions(), "down")) {
                _this.block.position.y -= 1;
                _this.fixRotationOffset();
                _this.gameBoard.updateSpaces(_this.block.getPositions(), true, false);
            }
            console.log(_this.gameBoard.spaces);
        }, 1250); //1500    
    };
    Game.prototype.inGridPositions = function () {
        var allpos = this.block.getPositions();
        var gridpos = new Array(); //create an array without reference to allpos array
        for (var i = 0; i < allpos.length; i++) {
            if (this.gameBoard.inGrid([allpos[i]])) {
                gridpos.push(allpos[i]);
            }
        }
        return gridpos;
    };
    //draw drop preview - where the active block will fall
    // private dropPreview() {
    // }
    // private getNextBlock() { //for preview of next block
    //     //randomize block here?
    // }
    //MOVE TO GAMEBOARD CLASS!!!! like canMove, but shifting accoring to spaces array and change how blocks are rotated?? -a set x y z pos transl?
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
        //RESOLVED: rotated blocks caused block positions to store irrational number values
        //offset positions - unable to track, related to parent cube and uncoupling
        //when block rotated, cubes, not parentCube, get shifted by really small +/- decimals
        //parentCube doesn't have a relative position, only cubes
        var fixpos = this.block.getRelPos();
        for (var i = 0; i < fixpos.length; i++) {
            if (Math.abs(fixpos[i].x) > 0 && Math.abs(fixpos[i].x) < 0.1) {
                // console.log(this.block.getPositions());
                // console.log("fixing rotation x", fixpos[i].x);
                // fixpos[i].x = 0;
                fixpos[i].x = Math.floor(Math.abs(fixpos[i].x));
                // console.log("fixed", fixpos[i].x);
                // console.log(this.block.getPositions());
            }
            if (Math.abs(fixpos[i].y) > 0 && Math.abs(fixpos[i].y) < 0.1) {
                // console.log(this.block.getPositions());
                // console.log("fixing rotation y", fixpos[i].y);
                // fixpos[i].y = 0;
                fixpos[i].y = Math.floor(Math.abs(fixpos[i].y));
                // console.log("fixed", fixpos[i].y);
                // console.log(this.block.getPositions());
            }
            if (Math.abs(fixpos[i].z) > 0 && Math.abs(fixpos[i].z) < 0.1) {
                // console.log(this.block.getPositions());
                // console.log("fixing rotation z", fixpos[i].z);
                // fixpos[i].z = 0;
                fixpos[i].z = Math.floor(Math.abs(fixpos[i].z));
                // console.log("fixed", fixpos[i].z);
                // console.log(this.block.getPositions());
            }
        }
    };
    Game.prototype.checkCollision = function () {
        //either y = 11 (ground lvl)(height -1), or block right on top of another mesh (y+1 -> space = true)
        // console.log("in check collisions");
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
        //MUST HAVE - IMPORTANT - without it landed array contains unrounded off decimals (from rotations)
        this.block.uncouple();
        this.block.parentCube.computeWorldMatrix();
        for (var c = 0; c < this.block.cubes.length; c++) {
            this.block.cubes[c].computeWorldMatrix();
        }
        this.fixRotationOffset();
        // var arr = this.block.cubes;
        if (this.block.type === "cube") {
            this._landed.push(this.block.parentCube);
        }
        else if (this.block.type !== "cube") {
            for (var i = 0; i < this.block.cubes.length; i++) {
                this._landed.push(this.block.cubes[i]);
            }
            this._landed.push(this.block.parentCube);
        }
        // this._landed.push(this.block.parentCube);
        // console.log(this._landed.length);
        // console.log(this._landed);
        //store landed block's positions to updateSpaces
        var arr = new Array();
        for (var el = 0; el < this._landed.length; el++) {
            arr.push(this._landed[el].position); //abs pos?
        }
        console.log(arr); //!!
        console.log(this.block.getRelPos());
        this.gameBoard.updateSpaces(arr, false, true);
    };
    //check for any filled up layer, not just for bottom layer
    Game.prototype.checkFullLayer = function () {
        //this.checkFullLayer() -> this.clearLayer() -> this.collapseLayers()
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
                        // console.log(layerheight);
                    }
                }
            }
            if (fullLayer) { //clear everytime you encounter full layer
                // console.log("full layer");
                this.clearLayer(y, layerheight, size);
                if (y !== 0) {
                    layerNums.push(y); //stores which layers were cleared, used to collapse layers
                }
                this.scoreCount += size * size;
                this.updateScore(this.scoreCount);
                fullLayer = false;
            } //when block is at y = 0, game over?
        }
        if (layerNums.length > 0) { //collpase only if full layers exist and were cleared - when layerNums has > 0 elements
            this.collapseLayers(layerNums, size, height);
        }
        //if layerNums has no elements, no layers were full and cleared, so no need to collapse layers - base case
    };
    //update spaces array and remove meshes from landed array -> block.dispose()
    Game.prototype.clearLayer = function (layer, layerheight, size) {
        // console.log("clearing layer");
        //clear layer in spaces array - in horizontal plane of same y
        for (var x = 0; x < size; x++) {
            for (var z = 0; z < size; z++) {
                this.gameBoard.spaces[x][layer][z] = false;
            }
        }
        // console.log(this.gameBoard.spaces);
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
        // console.log(this._landed);
        for (var j = this._landed.length - 1; j >= 0; j--) { //delete landed elements that have been disposed
            if (this._landed[j] === null) {
                this._landed.splice(j, 1); //remove cube mesh fr landed array
            }
        }
        // console.log(this._landed);
    };
    Game.prototype.collapseLayers = function (layerNums, size, height) {
        //move down each element in landed array at a specific y layer
        //cases: double layers cleared; if not consecutive layerNums but multiple y layers - start with lowest y layer
        //clear layer(s) -> shift down layers above cleared layers: collapse function
        //use landed array -> change position.y's of any blocks above y to positions.y-1, IF space = false (unoccupied)
        //or pos.y shifted down as far as possible, if no collisions with other blocks
        //move blocks 1st and THEN update pos
        //move each cube down 1 at a time and update spaces each layer at a time: start from bottom
        //cascade method (could implement): same type of block shifts down together, cube remembers which part of block it was
        //this method: each cube in landed goes down if space below empty/false, until space below is true
        //start 1 from the lowest layer cleared:
        var y = layerNums[layerNums.length - 1] - 1; //ground lvl: y = 11 (height-1); assuming layer isn't y = 0 (top)
        var layer = y + 1;
        var landedPos = new Array();
        for (var el = 0; el < this._landed.length; el++) {
            landedPos.push(this._landed[el].position);
        }
        // console.log(landedPos);
        for (y; y >= 0; y--) {
            for (var x = 0; x < size; x++) {
                for (var z = 0; z < size; z++) {
                    for (var i = 0; i < landedPos.length; i++) {
                        //see if position in landed same as in position arr in gameboard - should only find 1 match at this xyz
                        if (this.gameBoard.compare(landedPos[i], x, y, z) === true) { //if yes, mesh at that pos to be shifted down
                            // console.log(landedPos);
                            //each block above layer goes down 1 y until reach lowest y   
                            //and shift blocks down if space below = true  
                            layer = y + 1;
                            // console.log(this.gameBoard.spaces);
                            // console.log(this.gameBoard.spaces[x][layer][z]  === false && layer < height);
                            // console.log(x, y, z, i);
                            // console.log(x, layer, z);  
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
                }
            }
            this.gameBoard.updateSpaces(landedPos, false, true); //update after entire y plane of cubes shifted down
        }
        //use canMmove method from gameBoard class, pass in one el in landed as one array
        // this.checkFullLayer(); //once collapsed, check for new full layers - runtime error?
        //check layer again once you collapsed - break out of this once checkLayer -> false
    };
    //keyboard controls for active, falling block
    Game.prototype.enableControls = function () {
        //everytime block moves, this.gameBoard.updateSpaces()
        //if collided -> block inactive, space = false, store block in landed (its vector position) - a 3d array
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
        //keyboard observable
        this.scene.onKeyboardObservable.add(function (kbInfo) {
            if (_this.gameBoard.inGrid(_this.block.getPositions())) {
                _this.fixRotationOffset();
                _this.checkCollision(); //&& this.gameBoard.inGrid(this.block.getPositions())
            }
            //keyboard actions
            if (!_this.collided && !_this.gameOver) { //when block 1st drawn, outside of grid (!inGrid), can only rotate
                _this.fixRotationOffset();
                switch (kbInfo.type) {
                    case BABYLON.KeyboardEventTypes.KEYDOWN:
                        switch (kbInfo.event.key) {
                            //canMove method (gameBoard class) used for collision detection
                            case "w": //forward
                                if (_this.gameBoard.inGrid(_this.block.getPositions()) && _this.gameBoard.canMove(_this.block.getPositions(), "forward")) {
                                    _this.block.position.z += 1;
                                }
                                break;
                            case "s": //backward
                                if (_this.gameBoard.inGrid(_this.block.getPositions()) && _this.gameBoard.canMove(_this.block.getPositions(), "back")) {
                                    _this.block.position.z -= 1;
                                }
                                break;
                            case "a": //left
                                if (_this.gameBoard.inGrid(_this.block.getPositions()) && _this.gameBoard.canMove(_this.block.getPositions(), "left")) {
                                    _this.block.position.x -= 1;
                                }
                                break;
                            case "d": //right
                                if (_this.gameBoard.inGrid(_this.block.getPositions()) && _this.gameBoard.canMove(_this.block.getPositions(), "right")) {
                                    _this.block.position.x += 1;
                                }
                                break;
                            case " ": //down
                                //TO FIX: press space bar continuously - canMove not called fast enough, meshes intersect
                                if (_this.gameBoard.inGrid(_this.block.getPositions()) && _this.gameBoard.canMove(_this.block.getPositions(), "down")) {
                                    _this.block.position.y -= 1;
                                }
                                else if (_this.gameBoard.inGrid(_this.block.getPositions()) && _this.gameBoard.canMove(_this.block.getPositions(), "down") === false) {
                                    // console.log("2, changed collided");
                                    _this.collided = true;
                                }
                                break;
                            case "z":
                                //if rotated block would be in a position not found in getPositions array - should'nt move (create a canRotate function?)
                                // if (this.canRotate("x")) {
                                console.log("rotate x");
                                _this.block.rotate("x", _this._rotation); //rotate child 1st to se if it intersects?
                                _this.fixRotationOffset();
                                // console.log(this.block.getPositions());
                                // }
                                break;
                            case "x":
                                // if (this.canRotate("y")) {
                                console.log("rotate y");
                                _this.block.rotate("y", _this._rotation);
                                _this.fixRotationOffset();
                                // }
                                break;
                            case "c":
                                // if (this.canRotate("z")) {
                                console.log("rotate z");
                                _this.block.rotate("z", _this._rotation);
                                _this.fixRotationOffset();
                                // }
                                break;
                        }
                        _this.fixRotationOffset();
                        _this.gameBoard.updateSpaces(_this.block.getPositions(), true, false);
                        console.log(_this.gameBoard.spaces); //affected by rotations?
                        console.log(_this.gameBoard.inGrid(_this.block.getPositions()));
                        // this.checkCollision();
                        // console.log("about to break");
                        break;
                }
            }
        });
    };
    Game.prototype.updateScore = function (score) {
        this._score.text = "Score : " + score;
    };
    Game.prototype.isGameOver = function () {
        //isgameboardfull  - if space at y = 0 is full (after active block landed, before new block drawn)
        //at least one block pos at y = 0 and another block directly under it, or block !ingrid()
        //if collided and !ingrid -> game over; use info from keyboard observable?
        //not in grid - but y = 6.5 (1 above 5.5 - tallest height of grid)
        //for isOccupied, pass in x and z and see if space below (y = 5.5) is occupied/full
        //if any space at top height occupied -> gameOver = true?
        var size = this.gameBoard.size;
        var height = this.gameBoard.height;
        var top = (height / 2) - 0.5;
        //array of positions of block that just spawned
        var spawnPos = this.block.getPositions();
        var clonedPos = JSON.parse(JSON.stringify(spawnPos)); //deep clone - no reference to getPositions (spawnPos)
        //if any of the block's positions (at y = 5.5) are right above another block -> gameover (like a can't move func)
        //check all positions right below each cube that makes up block (at y = 4.5)
        //find positions of block 1 below
        var posBelow = new Array();
        for (var i = 0; i < clonedPos.length; i++) {
            if (clonedPos[i].y === top) { //top + 1
                var vector = new BABYLON.Vector3(clonedPos[i].x, clonedPos[i].y - 1, clonedPos[i].z);
                posBelow.push(vector);
            }
        }
        //compare spaces at y = 5.5 to y = 4.5 (same x and z)
        var tracker = 0;
        for (var x = 0; x < size; x++) {
            for (var y = 0; y < height; y++) {
                for (var z = 0; z < size; z++) {
                    for (var i = 0; i < posBelow.length; i++) {
                        if (this.gameBoard.compare(posBelow[i], x, y, z)) {
                            if (this.gameBoard.spaces[x][y][z] === true) {
                                tracker++;
                            }
                        }
                    }
                }
            }
        }
        if (tracker > 0) {
            this.gameOver = true;
            return true;
        }
        return false;
    };
    return Game;
}());
//# sourceMappingURL=Game.js.map