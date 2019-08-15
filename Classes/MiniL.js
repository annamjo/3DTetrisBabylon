/*
 *  Subclass of Piece for mini "L"
 *  MiniLs are green and shaped like a little L
 *  TO-DO: Block can move half-way into the wall
 */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var MiniL = /** @class */ (function (_super) {
    __extends(MiniL, _super);
    function MiniL(name, isActive, offsetW, offsetH, ground) {
        var _this = _super.call(this, name, isActive, offsetW, offsetH, ground) || this;
        //setting starting positions in XoZ plane; y = 0 ALWAYS
        //coordinates are set as (x, 0, y); no changing z??
        _this._startingPosition = [
            new BABYLON.Vector3(0, 0, 0),
            new BABYLON.Vector3(0, 0, 2),
            new BABYLON.Vector3(1, 0, 2),
            new BABYLON.Vector3(1, 0, 1),
            new BABYLON.Vector3(2, 0, 1),
            new BABYLON.Vector3(2, 0, 0),
        ];
        _this.rotationCounter = 0; //0 when L
        _this.flipCounter = 0; //0 when L
        //properties specific to MiniL
        _this._color = "green";
        _this._depth = 1;
        //creating physical piece, MiniL
        //need BABYLON.Mesh.DOUBLESIDE to have solid block
        _this._miniL = BABYLON.MeshBuilder.CreatePolygon("miniL", {
            shape: _this._startingPosition,
            depth: _this._depth,
            updatable: true,
            sideOrientation: BABYLON.Mesh.DOUBLESIDE
        }, scene);
        _this._miniL.position = new BABYLON.Vector3(0, 0, 0);
        //creating sphere that is center of rotation
        _this._center = BABYLON.MeshBuilder.CreateSphere("sphere", { diameter: 0.1 }, scene);
        _this._center.position = new BABYLON.Vector3(0, 0, 0);
        //SUPER IMPORTANT: attaches block to center
        _this._miniL.parent = _this._center;
        _this.mesh = _this._center;
        _this._miniL.position.x += _this._center.position.x - 0.5;
        _this._miniL.position.y += _this._center.position.y - 0.5;
        _this._miniL.position.z += _this._center.position.z - 0.5;
        if (!offsetH) {
            _this._center.position.y += _this._shift;
        }
        if (!offsetW) {
            _this._center.position.z += _this._shift;
            _this._center.position.x += _this._shift;
        }
        //sets L upright
        _this._startingRotation = (3 * Math.PI) / 2;
        _this._miniL.rotation.x = _this._startingRotation;
        //adding green to material of box
        _this._miniLMaterial = new BABYLON.StandardMaterial("miniLMat", scene);
        _this._miniLMaterial.diffuseColor = new BABYLON.Color3(0, 1, 0); //r: 0, g: 1, b: 0
        // this._miniLMaterial.wireframe = true;        //wire frame
        _this._miniL.material = _this._miniLMaterial;
        return _this;
    }
    Object.defineProperty(MiniL.prototype, "piece", {
        //accesor
        get: function () {
            return this._miniL;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MiniL.prototype, "center", {
        get: function () {
            return this.mesh;
        },
        enumerable: true,
        configurable: true
    });
    MiniL.prototype.rotate = function () {
        // rotations 0-3 inclusive; standard miniL is 0
        this.rotationCounter += 1;
        if (this.rotationCounter === 4) {
            this.rotationCounter = 0;
        }
        this.mesh.rotation.y -= this._rotation;
        console.log("Rotation: " + this.rotationCounter + " Flip: " + this.flipCounter);
        // console.log(gridData);
    };
    MiniL.prototype.unrotate = function () {
        //rotations 0-3 inclusive; standard miniL is 0
        this.rotationCounter -= 1;
        if (this.rotationCounter === -1) {
            this.rotationCounter = 3;
        }
        this.mesh.rotation.y += this._rotation;
    };
    MiniL.prototype.flip = function () {
        //case 0: protruding cube is lower --> flips down
        this.flipCounter += 1;
        if (this.flipCounter === 4) {
            this.flipCounter = 0;
        }
        this.mesh.rotation.x -= this._rotation;
        console.log("Rotation: " + this.rotationCounter + " Flip: " + this.flipCounter);
        // console.log(gridData);
    };
    MiniL.prototype.unflip = function () {
        //flips 0-3 inclusive; standard miniL is 0
        this.flipCounter -= 1;
        if (this.flipCounter === -1) {
            this.flipCounter = 3;
        }
        this.mesh.rotation.x += this._rotation;
    };
    MiniL.prototype.rotFlipCollisionCheck = function (xPos, yPos, zPos, grid) {
        // console.log("coordinates = x: " + xPos + " y: " + yPos + " z: " + zPos);
        var xArr = gridToArray("X", xPos);
        var yArr = gridToArray("Y", yPos);
        var zArr = gridToArray("Z", zPos);
        // console.log("Indexes = x: " + xArr + " y: " + yArr + " z: " + zArr);
        console.log("Rotation: " + this.rotationCounter + " Flip: " + this.flipCounter);
        if (this.rotationCounter === 0 && this.flipCounter === 0 && //rotation and flips
            grid[xArr + 1][yArr - 1][zArr] === false) {
            return true;
        }
        if (this.rotationCounter === 1 && this.flipCounter === 0 &&
            (grid[xArr][yArr][zArr + 1] === false ||
                grid[xArr][yArr + 1][zArr] === false ||
                grid[xArr][yArr - 1][zArr] === false)) {
            return true;
        }
        if (this.rotationCounter === 2 && this.flipCounter === 0 &&
            (grid[xArr - 1][yArr][zArr] === false ||
                grid[xArr][yArr - 1][zArr] === false)) {
            return true;
        }
        if (this.rotationCounter === 3 && this.flipCounter === 0 &&
            (grid[xArr][yArr][zArr - 1] === false ||
                grid[xArr][yArr - 1][zArr] === false)) {
            return true;
        }
        /** FLIP COUNTER 1 **/
        if (this.rotationCounter === 0 && this.flipCounter === 1 &&
            (grid[xArr][yArr][zArr - 1] === false ||
                grid[xArr + 1][yArr][zArr] === false)) {
            return true;
        }
        if (this.rotationCounter === 1 && this.flipCounter === 1 &&
            (grid[xArr][yArr][zArr + 1] === false ||
                grid[xArr - 1][yArr][zArr] === false)) {
            return true;
        }
        if (this.rotationCounter === 2 && this.flipCounter === 1 &&
            (grid[xArr - 1][yArr][zArr] === false ||
                grid[xArr][yArr][zArr + 1] === false)) {
            return true;
        }
        if (this.rotationCounter === 3 && this.flipCounter === 1 &&
            (grid[xArr][yArr][zArr - 1] === false ||
                grid[xArr - 1][yArr][zArr] === false)) {
            return true;
        }
        /** FLIP COUNTER 2 */
        if (this.rotationCounter === 0 && this.flipCounter === 2 &&
            (grid[xArr][yArr + 1][zArr] === false ||
                grid[xArr + 1][yArr][zArr] === false)) {
            return true;
        }
        if (this.rotationCounter === 1 && this.flipCounter === 2 &&
            (grid[xArr][yArr][zArr + 1] === false ||
                grid[xArr][yArr + 1][zArr] === false)) {
            return true;
        }
        if (this.rotationCounter === 2 && this.flipCounter === 2 &&
            (grid[xArr - 1][yArr][zArr] === false ||
                grid[xArr][yArr + 1][zArr] === false)) {
            return true;
        }
        if (this.rotationCounter === 3 && this.flipCounter === 2 &&
            (grid[xArr][yArr][zArr - 1] === false ||
                grid[xArr][yArr + 1][zArr] === false)) {
            return true;
        }
        /** FLIP COUNTER 3 */
        if (this.rotationCounter === 0 && this.flipCounter === 3 &&
            grid[xArr][yArr][zArr + 1] === false) {
            return true;
        }
        if (this.rotationCounter === 1 && this.flipCounter === 3 &&
            grid[xArr - 1][yArr][zArr] === false) {
            return true;
        }
        if (this.rotationCounter === 2 && this.flipCounter === 3 &&
            grid[xArr][yArr][zArr - 1] === false) {
            return true;
        }
        if (this.rotationCounter === 3 && this.flipCounter === 3 &&
            grid[xArr + 1][yArr][zArr] === false) {
            return true;
        }
        // console.log("Returning false");
        return false;
    };
    MiniL.prototype.placeBlock = function () {
        var xPos = this.mesh.position.x;
        var yPos = this.mesh.position.y;
        var zPos = this.mesh.position.z;
        console.log("Coordinates = x: " + xPos + " y: " + yPos + " z: " + zPos);
        var xArr = gridToArray("X", xPos);
        var yArr = gridToArray("Y", yPos);
        var zArr = gridToArray("Z", zPos);
        console.log("Placing block at indexes = x: " + xArr + " y: " + yArr + " z: " + zArr);
        /** FLIP COUNTER 0 **/
        if (this.rotationCounter === 0 && this.flipCounter === 0) { //starting L
            //sets starting spot in array (bottom left corner of L) to true
            this.pieceData[xArr][yArr][zArr] = true; //bottom left
            this.pieceData[xArr][yArr - 1][zArr] = true; //top left
            this.pieceData[xArr + 1][yArr][zArr] = true; //bottom right
        }
        else if (this.rotationCounter === 1 && this.flipCounter === 0) { //rotated pi/2 counterclockwise
            this.pieceData[xArr][yArr][zArr] = true; //bottom front
            this.pieceData[xArr][yArr - 1][zArr] = true; //bottom top
            this.pieceData[xArr][yArr][zArr + 1] = true; //bottom back
        }
        else if (this.rotationCounter === 2 && this.flipCounter === 0) { //rotated pi counterclockwise
            this.pieceData[xArr][yArr][zArr] = true; //bottom right
            this.pieceData[xArr][yArr - 1][zArr] = true; //top right
            this.pieceData[xArr - 1][yArr][zArr] = true; //bottom left
        }
        else if (this.rotationCounter === 3 && this.flipCounter === 0) { //rotated 3*pi/2 counterclockwise
            this.pieceData[xArr][yArr][zArr] = true; //bottom back
            this.pieceData[xArr][yArr - 1][zArr] = true; //top back
            this.pieceData[xArr][yArr][zArr - 1] = true; //bottom front
            /** FLIP COUNTER 1 **/
        }
        else if (this.rotationCounter === 0 && this.flipCounter === 1) {
            this.pieceData[xArr][yArr][zArr] = true; //back left
            this.pieceData[xArr + 1][yArr][zArr] = true; //back right
            this.pieceData[xArr][yArr][zArr - 1] = true; //front left
        }
        else if (this.rotationCounter === 1 && this.flipCounter === 1) {
            this.pieceData[xArr][yArr][zArr] = true; //front left
            this.pieceData[xArr + 1][yArr][zArr] = true; //front right
            this.pieceData[xArr][yArr][zArr + 1] = true; //back left
        }
        else if (this.rotationCounter === 2 && this.flipCounter === 1) {
            this.pieceData[xArr][yArr][zArr] = true; //front right
            this.pieceData[xArr][yArr][zArr + 1] = true; //back right
            this.pieceData[xArr - 1][yArr][zArr] = true; //front left
        }
        else if (this.rotationCounter === 3 && this.flipCounter === 1) {
            this.pieceData[xArr][yArr][zArr] = true; //back right
            this.pieceData[xArr][yArr][zArr - 1] = true; //front right
            this.pieceData[xArr - 1][yArr][zArr] = true; //back left
            /** FLIP COUNTER 2 */
        }
        else if (this.rotationCounter === 0 && this.flipCounter === 2) {
            this.pieceData[xArr][yArr][zArr] = true; //top left
            this.pieceData[xArr + 1][yArr][zArr] = true; //top right
            this.pieceData[xArr][yArr + 1][zArr] = true; //bottom left
        }
        else if (this.rotationCounter === 1 && this.flipCounter === 2) {
            this.pieceData[xArr][yArr][zArr] = true; //front top
            this.pieceData[xArr][yArr][zArr + 1] = true; //back top
            this.pieceData[xArr][yArr + 1][zArr] = true; //front bottom
        }
        else if (this.rotationCounter === 2 && this.flipCounter === 2) {
            this.pieceData[xArr][yArr][zArr] = true; //top right
            this.pieceData[xArr - 1][yArr][zArr] = true; //top left
            this.pieceData[xArr][yArr + 1][zArr] = true; //bottom left
        }
        else if (this.rotationCounter === 3 && this.flipCounter === 2) {
            this.pieceData[xArr][yArr][zArr] = true; //back top
            this.pieceData[xArr][yArr][zArr - 1] = true; //front top
            this.pieceData[xArr][yArr + 1][zArr] = true; //back bottom
            /** FLIP COUNTER 3 */
        }
        else if (this.rotationCounter === 0 && this.flipCounter === 3) {
            this.pieceData[xArr][yArr][zArr] = true; //front left
            this.pieceData[xArr + 1][yArr][zArr] = true; //front right
            this.pieceData[xArr][yArr][zArr + 1] = true; //back left
        }
        else if (this.rotationCounter === 1 && this.flipCounter === 3) {
            this.pieceData[xArr][yArr][zArr] = true; //front right
            this.pieceData[xArr - 1][yArr][zArr] = true; //front left
            this.pieceData[xArr][yArr][zArr + 1] = true; //back left
        }
        else if (this.rotationCounter === 2 && this.flipCounter === 3) {
            this.pieceData[xArr][yArr][zArr] = true; //back right
            this.pieceData[xArr - 1][yArr][zArr] = true; //back left
            this.pieceData[xArr][yArr][zArr - 1] = true; //front right
        }
        else { //this.rotationCounter === 3 && this.flipCounter === 3
            this.pieceData[xArr][yArr][zArr] = true; //back left
            this.pieceData[xArr + 1][yArr][zArr] = true; //back right
            this.pieceData[xArr][yArr][zArr - 1] = true; //front left
        }
        console.log(this.pieceData);
    };
    MiniL.prototype.removeBlock = function () {
        var xPos = this.mesh.position.x;
        var yPos = this.mesh.position.y;
        var zPos = this.mesh.position.z;
        var xArr = gridToArray("X", xPos);
        var yArr = gridToArray("Y", yPos);
        var zArr = gridToArray("Z", zPos);
        console.log("Removing block at indexes = x: " + xArr + " y: " + yArr + " z: " + zArr);
        /** FLIP COUNTER 0 **/
        if (this.rotationCounter === 0 && this.flipCounter === 0) { //starting L
            //sets starting spot in array (bottom left corner of L) to true
            this.pieceData[xArr][yArr][zArr] = false; //bottom left
            this.pieceData[xArr][yArr - 1][zArr] = false; //top left
            this.pieceData[xArr + 1][yArr][zArr] = false; //bottom right
            gridData[xArr][yArr][zArr] = false; //bottom left
            gridData[xArr][yArr - 1][zArr] = false; //top left
            gridData[xArr + 1][yArr][zArr] = false; //bottom right
        }
        else if (this.rotationCounter === 1 && this.flipCounter === 0) { //rotated pi/2 counterclockwise
            this.pieceData[xArr][yArr][zArr] = false; //bottom front
            this.pieceData[xArr][yArr - 1][zArr] = false; //bottom top
            this.pieceData[xArr][yArr][zArr + 1] = false; //bottom back
            gridData[xArr][yArr][zArr] = false; //bottom front
            gridData[xArr][yArr - 1][zArr] = false; //bottom top
            gridData[xArr][yArr][zArr + 1] = false; //bottom back
        }
        else if (this.rotationCounter === 2 && this.flipCounter === 0) { //rotated pi counterclockwise
            this.pieceData[xArr][yArr][zArr] = false; //bottom right
            this.pieceData[xArr][yArr - 1][zArr] = false; //top right
            this.pieceData[xArr - 1][yArr][zArr] = false; //bottom left
            gridData[xArr][yArr][zArr] = false; //bottom right
            gridData[xArr][yArr - 1][zArr] = false; //top right
            gridData[xArr - 1][yArr][zArr] = false; //bottom left
        }
        else if (this.rotationCounter === 3 && this.flipCounter === 0) { //rotated 3*pi/2 counterclockwise
            this.pieceData[xArr][yArr][zArr] = false; //bottom back
            this.pieceData[xArr][yArr - 1][zArr] = false; //top back
            this.pieceData[xArr][yArr][zArr - 1] = false; //bottom front
            gridData[xArr][yArr][zArr] = false; //bottom back
            gridData[xArr][yArr - 1][zArr] = false; //top back
            gridData[xArr][yArr][zArr - 1] = false; //bottom front
            /** FLIP COUNTER 1 **/
        }
        else if (this.rotationCounter === 0 && this.flipCounter === 1) {
            this.pieceData[xArr][yArr][zArr] = false; //back left
            this.pieceData[xArr + 1][yArr][zArr] = false; //back right
            this.pieceData[xArr][yArr][zArr - 1] = false; //front left
            gridData[xArr][yArr][zArr] = false; //back left
            gridData[xArr + 1][yArr][zArr] = false; //back right
            gridData[xArr][yArr][zArr - 1] = false; //front left
        }
        else if (this.rotationCounter === 1 && this.flipCounter === 1) {
            this.pieceData[xArr][yArr][zArr] = false; //front left
            this.pieceData[xArr + 1][yArr][zArr] = false; //front right
            this.pieceData[xArr][yArr][zArr + 1] = false; //back left
            gridData[xArr][yArr][zArr] = false; //front left
            gridData[xArr + 1][yArr][zArr] = false; //front right
            gridData[xArr][yArr][zArr + 1] = false; //back left
        }
        else if (this.rotationCounter === 2 && this.flipCounter === 1) {
            this.pieceData[xArr][yArr][zArr] = false; //front right
            this.pieceData[xArr][yArr][zArr + 1] = false; //back right
            this.pieceData[xArr - 1][yArr][zArr] = false; //front left
            gridData[xArr][yArr][zArr] = false; //front right
            gridData[xArr][yArr][zArr + 1] = false; //back right
            gridData[xArr - 1][yArr][zArr] = false; //front left
        }
        else if (this.rotationCounter === 3 && this.flipCounter === 1) {
            this.pieceData[xArr][yArr][zArr] = false; //back right
            this.pieceData[xArr][yArr][zArr - 1] = false; //front right
            this.pieceData[xArr - 1][yArr][zArr] = false; //back left
            gridData[xArr][yArr][zArr] = false; //back right
            gridData[xArr][yArr][zArr - 1] = false; //front right
            gridData[xArr - 1][yArr][zArr] = false; //back left
            /** FLIP COUNTER 2 */
        }
        else if (this.rotationCounter === 0 && this.flipCounter === 2) {
            this.pieceData[xArr][yArr][zArr] = false; //top left
            this.pieceData[xArr + 1][yArr][zArr] = false; //top right
            this.pieceData[xArr][yArr + 1][zArr] = false; //bottom left
            gridData[xArr][yArr][zArr] = false; //top left
            gridData[xArr + 1][yArr][zArr] = false; //top right
            gridData[xArr][yArr + 1][zArr] = false; //bottom left
        }
        else if (this.rotationCounter === 1 && this.flipCounter === 2) {
            this.pieceData[xArr][yArr][zArr] = false; //front top
            this.pieceData[xArr][yArr][zArr + 1] = false; //back top
            this.pieceData[xArr][yArr + 1][zArr] = false; //front bottom
            gridData[xArr][yArr][zArr] = false; //front top
            gridData[xArr][yArr][zArr + 1] = false; //back top
            gridData[xArr][yArr + 1][zArr] = false; //front bottom
        }
        else if (this.rotationCounter === 2 && this.flipCounter === 2) {
            this.pieceData[xArr][yArr][zArr] = false; //top right
            this.pieceData[xArr - 1][yArr][zArr] = false; //top left
            this.pieceData[xArr][yArr + 1][zArr] = false; //bottom left
            gridData[xArr][yArr][zArr] = false; //top right
            gridData[xArr - 1][yArr][zArr] = false; //top left
            gridData[xArr][yArr + 1][zArr] = false; //bottom left
        }
        else if (this.rotationCounter === 3 && this.flipCounter === 2) {
            this.pieceData[xArr][yArr][zArr] = false; //back top
            this.pieceData[xArr][yArr][zArr - 1] = false; //front top
            this.pieceData[xArr][yArr + 1][zArr] = false; //back bottom
            gridData[xArr][yArr][zArr] = false; //back top
            gridData[xArr][yArr][zArr - 1] = false; //front top
            gridData[xArr][yArr + 1][zArr] = false; //back bottom
            /** FLIP COUNTER 3 */
        }
        else if (this.rotationCounter === 0 && this.flipCounter === 3) {
            this.pieceData[xArr][yArr][zArr] = false; //front left
            this.pieceData[xArr + 1][yArr][zArr] = false; //front right
            this.pieceData[xArr][yArr][zArr + 1] = false; //back left
            gridData[xArr][yArr][zArr] = false; //front left
            gridData[xArr + 1][yArr][zArr] = false; //front right
            gridData[xArr][yArr][zArr + 1] = false; //back left
        }
        else if (this.rotationCounter === 1 && this.flipCounter === 3) {
            this.pieceData[xArr][yArr][zArr] = false; //front right
            this.pieceData[xArr - 1][yArr][zArr] = false; //front left
            this.pieceData[xArr][yArr][zArr + 1] = false; //back left
            gridData[xArr][yArr][zArr] = false; //front right
            gridData[xArr - 1][yArr][zArr] = false; //front left
            gridData[xArr][yArr][zArr + 1] = false; //back left
        }
        else if (this.rotationCounter === 2 && this.flipCounter === 3) {
            this.pieceData[xArr][yArr][zArr] = false; //back right
            this.pieceData[xArr - 1][yArr][zArr] = false; //back left
            this.pieceData[xArr][yArr][zArr - 1] = false; //front right
            gridData[xArr][yArr][zArr] = false; //back right
            gridData[xArr - 1][yArr][zArr] = false; //back left
            gridData[xArr][yArr][zArr - 1] = false; //front right
        }
        else { //this.rotationCounter === 3 && this.flipCounter === 3
            this.pieceData[xArr][yArr][zArr] = false; //back left
            this.pieceData[xArr + 1][yArr][zArr] = false; //back right
            this.pieceData[xArr][yArr][zArr - 1] = false; //front left
            gridData[xArr][yArr][zArr] = false; //back left
            gridData[xArr + 1][yArr][zArr] = false; //back right
            gridData[xArr][yArr][zArr - 1] = false; //front left
        }
    };
    MiniL.prototype.meshCollisionCheck = function (xPos, yPos, zPos, grid, direction) {
        var xArr = gridToArray("X", xPos);
        var yArr = gridToArray("Y", yPos);
        var zArr = gridToArray("Z", zPos);
        // console.log("Array Indexes = x: " + xArr + " y: " + yArr + " z: " + zArr);
        var dir = direction.toUpperCase();
        /************* FLIPCOUNTER === 0 *************/
        if (this.flipCounter === 0) { //starting L
            switch (dir) {
                case "L": //going left, key "A"
                    if (this.rotationCounter === 0) { //L
                        //xArr is -1 already
                        if (grid[xArr][yArr][zArr] === false &&
                            grid[xArr][yArr - 1][zArr] === false) {
                            return true;
                        }
                    }
                    else if (this.rotationCounter === 1) {
                        //xArr is -1 already
                        if (grid[xArr][yArr][zArr] === false &&
                            grid[xArr][yArr - 1][zArr] === false &&
                            grid[xArr][yArr][zArr + 1] === false) {
                            return true;
                        }
                    }
                    else if (this.rotationCounter === 2) {
                        //xArr is -1 already
                        if (grid[xArr - 1][yArr][zArr] === false &&
                            grid[xArr][yArr - 1][zArr] === false) {
                            return true;
                        }
                    }
                    else { //this.rotationCounter === 3
                        //xArr is -1 already
                        if (grid[xArr][yArr][zArr] === false &&
                            grid[xArr][yArr - 1][zArr] === false &&
                            grid[xArr][yArr][zArr - 1] === false) {
                            return true;
                        }
                    }
                    break;
                case "R": //going right, key "D"
                    //xArr is +1 already
                    if (this.rotationCounter === 0) {
                        if (grid[xArr + 1][yArr][zArr] === false && //bottom right
                            grid[xArr][yArr - 1][zArr] === false) { //top left
                            return true;
                        }
                    }
                    else if (this.rotationCounter === 1) {
                        //xArr is +1 already
                        if (grid[xArr][yArr][zArr] === false &&
                            grid[xArr][yArr - 1][zArr] === false &&
                            grid[xArr][yArr][zArr + 1] === false) {
                            return true;
                        }
                    }
                    else if (this.rotationCounter === 2) {
                        //xArr is +1 already
                        if (grid[xArr][yArr][zArr] === false &&
                            grid[xArr][yArr - 1][zArr] === false) {
                            return true;
                        }
                    }
                    else { //this.rotationCounter === 3
                        //xArr is +1 already
                        if (grid[xArr][yArr][zArr] === false &&
                            grid[xArr][yArr - 1][zArr] === false &&
                            grid[xArr][yArr][zArr - 1] === false) {
                            return true;
                        }
                    }
                    break;
                case "B": //going backwards, key "W"
                    if (this.rotationCounter === 0) {
                        //zArr is +1 already
                        if (grid[xArr][yArr][zArr] === false && //bottom left
                            grid[xArr][yArr - 1][zArr] === false && //top left
                            grid[xArr + 1][yArr][zArr] === false) { //bottom right
                            return true;
                        }
                    }
                    else if (this.rotationCounter === 1) {
                        //zArr is +1 already
                        if (grid[xArr][yArr][zArr + 1] === false &&
                            grid[xArr][yArr - 1][zArr] === false) {
                            return true;
                        }
                    }
                    else if (this.rotationCounter === 2) {
                        //zArr is +1 already
                        if (grid[xArr][yArr][zArr] === false &&
                            grid[xArr][yArr - 1][zArr] === false &&
                            grid[xArr - 1][yArr][zArr] === false) {
                            return true;
                        }
                    }
                    else { //this.rotationCounter === 3
                        //zArr is +1 already
                        if (grid[xArr][yArr][zArr] === false &&
                            grid[xArr][yArr - 1][zArr] === false) {
                            return true;
                        }
                    }
                    break;
                case "F": //going forward, key "S"
                    if (this.rotationCounter === 0) {
                        //zArr is -1 already
                        if (grid[xArr][yArr][zArr] === false && //bottom left
                            grid[xArr][yArr - 1][zArr] === false && //top left
                            grid[xArr + 1][yArr][zArr] === false) { //bottom right
                            return true;
                        }
                    }
                    else if (this.rotationCounter === 1) {
                        //zArr is -1 already
                        if (grid[xArr][yArr][zArr] === false &&
                            grid[xArr][yArr - 1][zArr] === false) {
                            return true;
                        }
                    }
                    else if (this.rotationCounter === 2) {
                        //zArr is -1 already
                        if (grid[xArr][yArr][zArr] === false &&
                            grid[xArr][yArr - 1][zArr] === false &&
                            grid[xArr - 1][yArr][zArr] === false) {
                            return true;
                        }
                    }
                    else { //this.rotationCounter === 3
                        //zArr is -1 already
                        if (grid[xArr][yArr][zArr - 1] === false &&
                            grid[xArr][yArr - 1][zArr] === false) {
                            return true;
                        }
                    }
                    break;
                case " ":
                    if (this.rotationCounter === 0) {
                        if (grid[xArr][yArr][zArr] === false &&
                            grid[xArr + 1][yArr][zArr] === false) {
                            return true;
                        }
                    }
                    else if (this.rotationCounter === 1) {
                        if (grid[xArr][yArr][zArr] === false &&
                            grid[xArr][yArr][zArr + 1] === false) {
                            return true;
                        }
                    }
                    else if (this.rotationCounter === 2) {
                        if (grid[xArr][yArr][zArr] === false &&
                            grid[xArr - 1][yArr][zArr] === false) {
                            return true;
                        }
                    }
                    else { //this.rotationCounter === 3
                        if (grid[xArr][yArr][zArr] === false &&
                            grid[xArr][yArr][zArr - 1] === false) {
                            return true;
                        }
                    }
                    break;
            } //switch
            /************* FLIPCOUNTER === 1 *************/
        }
        else if (this.flipCounter === 1) {
            switch (dir) {
                case "L": //moving left, key "A"
                    if (this.rotationCounter === 0) {
                        //xArr is -1 already
                        if (grid[xArr][yArr][zArr] === false &&
                            grid[xArr][yArr][zArr - 1] === false) {
                            return true;
                        }
                    }
                    else if (this.rotationCounter === 1) {
                        //xArr is -1 already
                        if (grid[xArr][yArr][zArr] === false &&
                            grid[xArr][yArr][zArr + 1] === false) {
                            return true;
                        }
                    }
                    else if (this.rotationCounter === 2) {
                        //xArr is -1 already
                        if (grid[xArr - 1][yArr][zArr] === false &&
                            grid[xArr][yArr][zArr + 1] === false) {
                            return true;
                        }
                    }
                    else { //this.rotationCounter === 3
                        //xArr is -1 already
                        if (grid[xArr - 1][yArr][zArr] === false &&
                            grid[xArr][yArr][zArr - 1] === false) {
                            return true;
                        }
                    }
                    break;
                case "R": //moving right, key "D"
                    if (this.rotationCounter === 0) {
                        //xArr is +1 already
                        if (grid[xArr + 1][yArr][zArr] === false &&
                            grid[xArr][yArr][zArr - 1] === false) {
                            return true;
                        }
                    }
                    else if (this.rotationCounter === 1) {
                        //xArr is +1 already
                        if (grid[xArr + 1][yArr][zArr] === false &&
                            grid[xArr][yArr][zArr + 1] === false) {
                            return true;
                        }
                    }
                    else if (this.rotationCounter === 2) {
                        //xArr is +1 already
                        if (grid[xArr][yArr][zArr] === false &&
                            grid[xArr][yArr][zArr + 1] === false) {
                            return true;
                        }
                    }
                    else { //this.rotationCounter === 3
                        //xArr is +1 already
                        if (grid[xArr][yArr][zArr] === false &&
                            grid[xArr][yArr][zArr - 1] === false) {
                            return true;
                        }
                    }
                    break;
                case "B": //moving backwards, key "W"
                    if (this.rotationCounter === 0) {
                        //zArr is +1 already
                        if (grid[xArr][yArr][zArr] === false &&
                            grid[xArr + 1][yArr][zArr] === false) {
                            return true;
                        }
                    }
                    else if (this.rotationCounter === 1) {
                        //zArr is +1 already
                        if (grid[xArr][yArr][zArr + 1] === false &&
                            grid[xArr + 1][yArr][zArr] === false) {
                            return true;
                        }
                    }
                    else if (this.rotationCounter === 2) {
                        //zArr is +1 already
                        if (grid[xArr][yArr][zArr + 1] === false &&
                            grid[xArr - 1][yArr][zArr] === false) {
                            return true;
                        }
                    }
                    else { //this.rotationCounter === 3
                        //zArr is +1 already
                        if (grid[xArr][yArr][zArr] === false &&
                            grid[xArr - 1][yArr][zArr] === false) {
                            return true;
                        }
                    }
                    break;
                case "F": //moving forward, key "S"
                    if (this.rotationCounter === 0) {
                        //zArr is -1 already
                        if (grid[xArr][yArr][zArr - 1] === false &&
                            grid[xArr + 1][yArr][zArr] === false) {
                            return true;
                        }
                    }
                    else if (this.rotationCounter === 1) {
                        //zArr is -1 already
                        if (grid[xArr][yArr][zArr] === false &&
                            grid[xArr + 1][yArr][zArr] === false) {
                            return true;
                        }
                    }
                    else if (this.rotationCounter === 2) {
                        //zArr is -1 already
                        if (grid[xArr][yArr][zArr] === false &&
                            grid[xArr - 1][yArr][zArr] === false) {
                            return true;
                        }
                    }
                    else { //this.rotationCounter === 3
                        //zArr is -1 already
                        if (grid[xArr][yArr][zArr - 1] === false &&
                            grid[xArr - 1][yArr][zArr] === false) {
                            return true;
                        }
                    }
                    break;
                case " ":
                    if (this.rotationCounter === 0) {
                        if (grid[xArr][yArr][zArr] === false &&
                            grid[xArr + 1][yArr][zArr] === false &&
                            grid[xArr][yArr][zArr - 1] === false) {
                            return true;
                        }
                    }
                    else if (this.rotationCounter === 1) {
                        if (grid[xArr][yArr][zArr] === false &&
                            grid[xArr + 1][yArr][zArr] === false &&
                            grid[xArr][yArr][zArr + 1] === false) {
                            return true;
                        }
                    }
                    else if (this.rotationCounter === 2) {
                        if (grid[xArr][yArr][zArr] === false &&
                            grid[xArr][yArr][zArr + 1] === false &&
                            grid[xArr - 1][yArr][zArr] === false) {
                            return true;
                        }
                    }
                    else { //this.rotationCounter === 3
                        if (grid[xArr][yArr][zArr] === false &&
                            grid[xArr][yArr][zArr - 1] === false &&
                            grid[xArr - 1][yArr][zArr] === false) {
                            return true;
                        }
                    }
                    break;
            } //switch
            /************* FLIPCOUNTER === 2 *************/
        }
        else if (this.flipCounter === 2) {
            switch (dir) {
                case "L": //moving left, key "A"
                    if (this.rotationCounter === 0) {
                        //xArr is -1 already
                        if (grid[xArr][yArr][zArr] === false &&
                            grid[xArr][yArr + 1][zArr] === false) {
                            return true;
                        }
                    }
                    else if (this.rotationCounter === 1) {
                        //xArr is -1 already
                        if (grid[xArr][yArr][zArr] === false &&
                            grid[xArr][yArr + 1][zArr] === false &&
                            grid[xArr][yArr][zArr + 1] === false) {
                            return true;
                        }
                    }
                    else if (this.rotationCounter === 2) {
                        //xArr is -1 already
                        if (grid[xArr - 1][yArr][zArr] === false &&
                            grid[xArr][yArr + 1][zArr] === false) {
                            return true;
                        }
                    }
                    else { //this.rotationCounter === 3
                        //xArr is -1 already
                        if (grid[xArr][yArr][zArr] === false &&
                            grid[xArr][yArr + 1][zArr] === false &&
                            grid[xArr][yArr][zArr - 1] === false) {
                            return true;
                        }
                    }
                    break;
                case "R": //moving right, key "D"
                    if (this.rotationCounter === 0) {
                        //xArr is +1 already
                        if (grid[xArr + 1][yArr][zArr] === false &&
                            grid[xArr][yArr + 1][zArr] === false) {
                            return true;
                        }
                    }
                    else if (this.rotationCounter === 1) {
                        //xArr is +1 already
                        if (grid[xArr][yArr][zArr] === false &&
                            grid[xArr][yArr + 1][zArr] === false &&
                            grid[xArr][yArr][zArr + 1] === false) {
                            return true;
                        }
                    }
                    else if (this.rotationCounter === 2) {
                        //xArr is +1 already
                        if (grid[xArr][yArr][zArr] === false &&
                            grid[xArr][yArr + 1][zArr] === false) {
                            return true;
                        }
                    }
                    else { //this.rotationCounter === 3
                        //xArr is +1 already
                        if (grid[xArr][yArr][zArr] === false &&
                            grid[xArr][yArr + 1][zArr] === false &&
                            grid[xArr][yArr][zArr - 1] === false) {
                            return true;
                        }
                    }
                    break;
                case "B": //going backwards, case "W"
                    if (this.rotationCounter === 0) {
                        //zArr is +1 already
                        if (grid[xArr][yArr][zArr] === false &&
                            grid[xArr][yArr + 1][zArr] === false &&
                            grid[xArr + 1][yArr][zArr] === false) {
                            return true;
                        }
                    }
                    else if (this.rotationCounter === 1) {
                        //zArr is +1 already
                        if (grid[xArr][yArr][zArr + 1] === false &&
                            grid[xArr][yArr + 1][zArr] === false) {
                            return true;
                        }
                    }
                    else if (this.rotationCounter === 2) {
                        //zArr is +1 already
                        if (grid[xArr][yArr][zArr] === false &&
                            grid[xArr][yArr + 1][zArr] === false &&
                            grid[xArr - 1][yArr][zArr] === false) {
                            return true;
                        }
                    }
                    else { //this.rotationCounter === 3
                        //zArr is +1 already
                        if (grid[xArr][yArr][zArr] === false &&
                            grid[xArr][yArr + 1][zArr] === false) {
                            return true;
                        }
                    }
                    break;
                case "F": //moving forward, key "S"
                    if (this.rotationCounter === 0) {
                        //zArr is -1 already
                        if (grid[xArr][yArr][zArr] === false &&
                            grid[xArr][yArr + 1][zArr] === false &&
                            grid[xArr + 1][yArr][zArr] === false) {
                            return true;
                        }
                    }
                    else if (this.rotationCounter === 1) {
                        //zArr is -1 already
                        if (grid[xArr][yArr][zArr] === false &&
                            grid[xArr][yArr + 1][zArr] === false) {
                            return true;
                        }
                    }
                    else if (this.rotationCounter === 2) {
                        //zArr is -1 already
                        if (grid[xArr][yArr][zArr] === false &&
                            grid[xArr][yArr + 1][zArr] === false &&
                            grid[xArr - 1][yArr][zArr] === false) {
                            return true;
                        }
                    }
                    else { //this.rotationCounter === 3
                        //zArr is -1 already
                        if (grid[xArr][yArr][zArr - 1] === false &&
                            grid[xArr][yArr + 1][zArr] === false) {
                            return true;
                        }
                    }
                    break;
                case " ":
                    if (this.rotationCounter === 0) {
                        if (grid[xArr][yArr + 1][zArr] === false &&
                            grid[xArr + 1][yArr][zArr] === false) {
                            return true;
                        }
                    }
                    else if (this.rotationCounter === 1) {
                        if (grid[xArr][yArr + 1][zArr] === false &&
                            grid[xArr][yArr][zArr + 1] === false) {
                            return true;
                        }
                    }
                    else if (this.rotationCounter === 2) {
                        if (grid[xArr][yArr + 1][zArr] === false &&
                            grid[xArr - 1][yArr][zArr] === false) {
                            return true;
                        }
                    }
                    else { //this.rotationCounter === 3
                        if (grid[xArr][yArr + 1][zArr] === false &&
                            grid[xArr][yArr][zArr - 1] === false) {
                            return true;
                        }
                    }
                    break;
            } //switch
            /************* FLIPCOUNTER === 3 *************/
        }
        else { //this.flipCounter === 3
            switch (dir) {
                case "L": //going left, key "A"
                    if (this.rotationCounter === 0) {
                        //xArr is -1 already
                        if (grid[xArr][yArr][zArr] === false &&
                            grid[xArr][yArr][zArr + 1] === false) {
                            return true;
                        }
                    }
                    else if (this.rotationCounter === 1) {
                        //xArr is -1 already
                        if (grid[xArr - 1][yArr][zArr] === false &&
                            grid[xArr][yArr][zArr + 1] === false) {
                            return true;
                        }
                    }
                    else if (this.rotationCounter === 2) {
                        //xArr is -1 already
                        if (grid[xArr - 1][yArr][zArr] === false &&
                            grid[xArr][yArr][zArr - 1] === false) {
                            return true;
                        }
                    }
                    else { //this.rotationCounter === 3
                        //xArr is -1 already
                        if (grid[xArr][yArr][zArr] === false &&
                            grid[xArr][yArr][zArr - 1] === false) {
                            return true;
                        }
                    }
                    break;
                case "R": //going right, key "D"
                    if (this.rotationCounter === 0) {
                        //xArr is +1 already
                        if (grid[xArr + 1][yArr][zArr] === false &&
                            grid[xArr][yArr][zArr + 1] === false) {
                            return true;
                        }
                    }
                    else if (this.rotationCounter === 1) {
                        //xArr is +1 already
                        if (grid[xArr][yArr][zArr] === false &&
                            grid[xArr][yArr][zArr + 1] === false) {
                            return true;
                        }
                    }
                    else if (this.rotationCounter === 2) {
                        //xArr is +1 already
                        if (grid[xArr][yArr][zArr] === false &&
                            grid[xArr][yArr][zArr - 1] === false) {
                            return true;
                        }
                    }
                    else { //this.rotationCounter === 3
                        //xArr is +1 already
                        if (grid[xArr + 1][yArr][zArr] === false &&
                            grid[xArr][yArr][zArr - 1] === false) {
                            return true;
                        }
                    }
                    break;
                case "B": //going backwards, key "W"
                    if (this.rotationCounter === 0) {
                        //zArr is +1 already
                        if (grid[xArr][yArr][zArr + 1] === false &&
                            grid[xArr + 1][yArr][zArr] === false) {
                            return true;
                        }
                    }
                    else if (this.rotationCounter === 1) {
                        //zArr is +1 already
                        if (grid[xArr][yArr][zArr + 1] === false &&
                            grid[xArr - 1][yArr][zArr] === false) {
                            return true;
                        }
                    }
                    else if (this.rotationCounter === 2) {
                        //zArr is +1 already
                        if (grid[xArr - 1][yArr][zArr] === false &&
                            grid[xArr][yArr][zArr] === false) {
                            return true;
                        }
                    }
                    else { //this.rotationCounter === 3
                        //zArr is +1 already
                        if (grid[xArr][yArr][zArr] === false &&
                            grid[xArr + 1][yArr][zArr] === false) {
                            return true;
                        }
                    }
                    break;
                case "F": //going forwards, key "S"
                    if (this.rotationCounter === 0) {
                        //zArr is -1 already
                        if (grid[xArr][yArr][zArr] === false &&
                            grid[xArr + 1][yArr][zArr] === false) {
                            return true;
                        }
                    }
                    else if (this.rotationCounter === 1) {
                        //zArr is -1 already
                        if (grid[xArr][yArr][zArr] === false &&
                            grid[xArr - 1][yArr][zArr] === false) {
                            return true;
                        }
                    }
                    else if (this.rotationCounter === 2) {
                        //zArr is -1 already
                        if (grid[xArr][yArr][zArr - 1] === false &&
                            grid[xArr - 1][yArr][zArr] === false) {
                            return true;
                        }
                    }
                    else { //this.rotationCounter === 3
                        //zArr is -1 already
                        if (grid[xArr][yArr][zArr - 1] === false &&
                            grid[xArr + 1][yArr][zArr] === false) {
                            return true;
                        }
                    }
                    break;
                case " ":
                    if (this.rotationCounter === 0) {
                        if (grid[xArr][yArr][zArr] === false &&
                            grid[xArr + 1][yArr][zArr] === false &&
                            grid[xArr][yArr][zArr + 1] === false) {
                            return true;
                        }
                    }
                    else if (this.rotationCounter === 1) {
                        if (grid[xArr][yArr][zArr] === false &&
                            grid[xArr - 1][yArr][zArr] === false &&
                            grid[xArr][yArr][zArr + 1] === false) {
                            return true;
                        }
                    }
                    else if (this.rotationCounter === 2) {
                        if (grid[xArr][yArr][zArr] === false &&
                            grid[xArr][yArr][zArr - 1] === false &&
                            grid[xArr - 1][yArr][zArr] === false) {
                            return true;
                        }
                    }
                    else { //this.rotationCounter === 3
                        if (grid[xArr][yArr][zArr] === false &&
                            grid[xArr][yArr][zArr - 1] === false &&
                            grid[xArr + 1][yArr][zArr] === false) {
                            return true;
                        }
                    }
                    break;
            } //switch
        }
        // console.log("returning false");
        return false;
    };
    MiniL.prototype.placeObject = function (objectArray) {
        var xPos = this.mesh.position.x;
        var yPos = this.mesh.position.y;
        var zPos = this.mesh.position.z;
        var xArr = gridToArray("X", xPos);
        var yArr = gridToArray("Y", yPos);
        var zArr = gridToArray("Z", zPos);
        if (this.rotationCounter === 0 && this.flipCounter === 0) { //starting L
            //adds physical object to Object array
            objectArray[xArr][yArr][zArr] = this._miniL; //bottom left
            objectArray[xArr][yArr - 1][zArr] = this._miniL; //top left
            objectArray[xArr + 1][yArr][zArr] = this._miniL; //bottom right
        }
    };
    MiniL.prototype.removeObject = function (objectArray) {
        var xPos = this.mesh.position.x;
        var yPos = this.mesh.position.y;
        var zPos = this.mesh.position.z;
        var xArr = gridToArray("X", xPos);
        var yArr = gridToArray("Y", yPos);
        var zArr = gridToArray("Z", zPos);
        if (this.rotationCounter === 0 && this.flipCounter === 0) { //starting L
            //removes physical object from Object array
            objectArray[xArr][yArr][zArr] = null; //bottom left
            objectArray[xArr][yArr - 1][zArr] = null; //top left
            objectArray[xArr + 1][yArr][zArr] = null; //bottom right
        }
    };
    return MiniL;
}(Piece));
//# sourceMappingURL=MiniL.js.map