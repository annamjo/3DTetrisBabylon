/*
 *  Subclass of Piece for mini "L"
 *  MiniLs are green and shaped like a little L
 *  TO-DO: Block can move half-way into the wall
 */

class MiniL extends Piece {
    //declaring properties for starting position of block, all blocks will fall from the same spot
    private _startingPosition;      //TO-DO: require type for array
    private _startingRotation : number;     //sets L upright
    private _depth : number;
    private flipCounter : number;
    private rotationCounter : number;

    //properties specific to miniL
    private _color : string;     //small cubes will always be color: red
    private _miniL;     //holds physical block
    private _miniLMaterial;     //stores material

    //will be used as center point of block ;)
    private _center : BABYLON.Mesh;
    private mesh : BABYLON.Mesh;

    constructor(name : string, isActive : boolean, offsetW : boolean, offsetH : boolean, ground : any) {
        super(name, isActive, offsetW, offsetH, ground);

        //setting starting positions in XoZ plane; y = 0 ALWAYS
        //coordinates are set as (x, 0, y); no changing z??
        this._startingPosition = [
            new BABYLON.Vector3(0, 0, 0),  //botton left corner
            new BABYLON.Vector3(0, 0, 2),  //top left corner
            new BABYLON.Vector3(1, 0, 2),  //high right corner
            new BABYLON.Vector3(1, 0, 1),  //midpoint
            new BABYLON.Vector3(2, 0, 1),  //mid-right corner
            new BABYLON.Vector3(2, 0, 0),   //bottom right corner
        ];
        this.rotationCounter = 0;     //0 when L
        this.flipCounter = 0;       //0 when L

        //properties specific to MiniL
        this._color = "green";
        this._depth = 1;

        //creating physical piece, MiniL
        //need BABYLON.Mesh.DOUBLESIDE to have solid block
        this._miniL = BABYLON.MeshBuilder.CreatePolygon("miniL", {
            shape: this._startingPosition, 
            depth: this._depth, 
            updatable: true, 
            sideOrientation: BABYLON.Mesh.DOUBLESIDE}, scene);
        this._miniL.position = new BABYLON.Vector3(0, 0, 0);

        //creating sphere that is center of rotation
        this._center = BABYLON.MeshBuilder.CreateSphere("sphere", {diameter: 0.1}, scene);
        this._center.position = new BABYLON.Vector3(0, 0, 0);

        //SUPER IMPORTANT: attaches block to center
        this._miniL.parent = this._center;
        this.mesh = this._center;

        this._miniL.position.x += this._center.position.x - 0.5;
        this._miniL.position.y += this._center.position.y - 0.5;
        this._miniL.position.z += this._center.position.z - 0.5;

        if(!offsetH) {
            this._center.position.y += this._shift;
        }
        if(!offsetW) {
            this._center.position.z +=  this._shift;
            this._center.position.x += this._shift;
        }

        //sets L upright
        this._startingRotation = (3*Math.PI)/2;
        this._miniL.rotation.x = this._startingRotation;

        //adding green to material of box
        this._miniLMaterial = new BABYLON.StandardMaterial("miniLMat", scene);
        this._miniLMaterial.diffuseColor = new BABYLON.Color3(0, 1, 0);     //r: 0, g: 1, b: 0
        // this._miniLMaterial.wireframe = true;        //wire frame
        this._miniL.material = this._miniLMaterial;
    }

    //accesor
    get piece() {
        return this._miniL;
    }

    get center() {
        return this.mesh;
    }

    rotate() {
        // rotations 0-3 inclusive; standard miniL is 0
        this.rotationCounter += 1;
        if(this.rotationCounter === 4) {
            this.rotationCounter = 0;
        }

        this.mesh.rotation.y -= this._rotation;
        console.log("Rotation: " + this.rotationCounter + " Flip: " + this.flipCounter);
        // console.log(gridData);
    }

    unrotate() {
        //rotations 0-3 inclusive; standard miniL is 0
        this.rotationCounter -= 1;
        if(this.rotationCounter === -1) {
            this.rotationCounter = 3;
        }

        this.mesh.rotation.y += this._rotation;
    }

    flip() {
        //case 0: protruding cube is lower --> flips down
        this.flipCounter += 1;
        if(this.flipCounter === 4) {
            this.flipCounter = 0;
        }

        this.mesh.rotation.x -= this._rotation;
        console.log("Rotation: " + this.rotationCounter + " Flip: " + this.flipCounter);
        // console.log(gridData);
    }

    unflip() {
        //flips 0-3 inclusive; standard miniL is 0
        this.flipCounter -= 1;
        if(this.flipCounter === -1) {
            this.flipCounter = 3;
        }

        this.mesh.rotation.x += this._rotation;
    }

    rotFlipCollisionCheck(xPos : number, yPos :  number, zPos : number, grid : boolean[]) {
        // console.log("coordinates = x: " + xPos + " y: " + yPos + " z: " + zPos);
        let xArr : number = gridToArray("X", xPos);
        let yArr : number = gridToArray("Y", yPos);
        let zArr : number = gridToArray("Z", zPos);
        // console.log("Indexes = x: " + xArr + " y: " + yArr + " z: " + zArr);
        console.log("Rotation: " + this.rotationCounter + " Flip: " + this.flipCounter);

        if( this.rotationCounter === 0 && this.flipCounter === 0 &&     //rotation and flips
            grid[xArr + 1][yArr - 1][zArr] === false) {
                return true;
        }
        if( this.rotationCounter === 1 && this.flipCounter === 0  && 
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
            (grid[xArr][yArr][zArr + 1]=== false || 
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
            (grid[xArr][yArr][zArr - 1] === false  ||
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
    }

    placeBlock() {
        let xPos : number = this.mesh.position.x;
        let yPos : number = this.mesh.position.y;
        let zPos : number = this.mesh.position.z;
        console.log("Coordinates = x: " + xPos + " y: " + yPos + " z: " + zPos);

        let xArr : number = gridToArray("X", xPos);
        let yArr : number = gridToArray("Y", yPos);
        let zArr : number = gridToArray("Z", zPos);
        console.log("Placing block at indexes = x: " + xArr + " y: " + yArr + " z: " + zArr);

        /** FLIP COUNTER 0 **/
        if(this.rotationCounter === 0 && this.flipCounter === 0) {      //starting L
            //sets starting spot in array (bottom left corner of L) to true
            this.pieceData[xArr][yArr][zArr] = true;           //bottom left
            this.pieceData[xArr][yArr - 1][zArr] = true;       //top left
            this.pieceData[xArr + 1][yArr][zArr] = true;       //bottom right
        } else if (this.rotationCounter === 1 && this.flipCounter === 0) {  //rotated pi/2 counterclockwise
            this.pieceData[xArr][yArr][zArr] = true;           //bottom front
            this.pieceData[xArr][yArr - 1][zArr] = true;       //bottom top
            this.pieceData[xArr][yArr][zArr + 1] = true;       //bottom back
        } else if (this.rotationCounter === 2 && this.flipCounter === 0) {  //rotated pi counterclockwise
            this.pieceData[xArr][yArr][zArr] = true;           //bottom right
            this.pieceData[xArr][yArr - 1][zArr] = true;       //top right
            this.pieceData[xArr - 1][yArr][zArr] = true;       //bottom left
        } else if (this.rotationCounter === 3 && this.flipCounter === 0) {  //rotated 3*pi/2 counterclockwise
            this.pieceData[xArr][yArr][zArr] = true;           //bottom back
            this.pieceData[xArr][yArr - 1][zArr] = true;       //top back
            this.pieceData[xArr][yArr][zArr - 1] = true;           //bottom front
        /** FLIP COUNTER 1 **/
        } else if (this.rotationCounter === 0 && this.flipCounter === 1) {
            this.pieceData[xArr][yArr][zArr] = true;           //back left
            this.pieceData[xArr + 1][yArr][zArr] = true;       //back right
            this.pieceData[xArr][yArr][zArr - 1] = true;       //front left
        } else if (this.rotationCounter === 1 && this.flipCounter === 1) {
            this.pieceData[xArr][yArr][zArr] = true;           //front left
            this.pieceData[xArr + 1][yArr][zArr] = true;       //front right
            this.pieceData[xArr][yArr][zArr + 1] = true;       //back left
        } else if (this.rotationCounter === 2 && this.flipCounter === 1) {
            this.pieceData[xArr][yArr][zArr] = true;           //front right
            this.pieceData[xArr][yArr][zArr + 1] = true;       //back right
            this.pieceData[xArr - 1][yArr][zArr] = true;       //front left
        } else if (this.rotationCounter === 3 && this.flipCounter === 1) {
            this.pieceData[xArr][yArr][zArr] = true;           //back right
            this.pieceData[xArr][yArr][zArr - 1] = true;       //front right
            this.pieceData[xArr - 1][yArr][zArr] = true;       //back left
        /** FLIP COUNTER 2 */
        } else if (this.rotationCounter === 0 && this.flipCounter === 2) {
            this.pieceData[xArr][yArr][zArr] = true;           //top left
            this.pieceData[xArr + 1][yArr][zArr] = true;       //top right
            this.pieceData[xArr][yArr + 1][zArr] = true;       //bottom left
        } else if (this.rotationCounter === 1 && this.flipCounter === 2) {
            this.pieceData[xArr][yArr][zArr] = true;           //front top
            this.pieceData[xArr][yArr][zArr + 1] = true;       //back top
            this.pieceData[xArr][yArr + 1][zArr] = true;       //front bottom
        } else if (this.rotationCounter === 2 && this.flipCounter === 2) {
            this.pieceData[xArr][yArr][zArr] = true;           //top right
            this.pieceData[xArr - 1][yArr][zArr] = true;       //top left
            this.pieceData[xArr][yArr + 1][zArr] = true;       //bottom left
        } else if (this.rotationCounter === 3 && this.flipCounter === 2) {
            this.pieceData[xArr][yArr][zArr] = true;           //back top
            this.pieceData[xArr][yArr][zArr - 1] = true;       //front top
            this.pieceData[xArr][yArr + 1][zArr] = true;       //back bottom
        /** FLIP COUNTER 3 */
        } else if (this.rotationCounter === 0 && this.flipCounter === 3) {
            this.pieceData[xArr][yArr][zArr] = true;           //front left
            this.pieceData[xArr + 1][yArr][zArr] = true;       //front right
            this.pieceData[xArr][yArr][zArr + 1] = true;       //back left
        } else if (this.rotationCounter === 1 && this.flipCounter === 3) {
            this.pieceData[xArr][yArr][zArr] = true;           //front right
            this.pieceData[xArr - 1][yArr][zArr] = true;       //front left
            this.pieceData[xArr][yArr][zArr + 1] = true;       //back left
        } else if (this.rotationCounter === 2 && this.flipCounter === 3) {
            this.pieceData[xArr][yArr][zArr] = true;           //back right
            this.pieceData[xArr - 1][yArr][zArr] = true;       //back left
            this.pieceData[xArr][yArr][zArr - 1] = true;       //front right
        } else { //this.rotationCounter === 3 && this.flipCounter === 3
            this.pieceData[xArr][yArr][zArr] = true;           //back left
            this.pieceData[xArr + 1][yArr][zArr] = true;       //back right
            this.pieceData[xArr][yArr][zArr - 1] = true;       //front left
        }
        console.log(this.pieceData);
    }
    

    removeBlock() {
        let xPos : number = this.mesh.position.x;
        let yPos : number = this.mesh.position.y;
        let zPos : number = this.mesh.position.z; 

        let xArr : number = gridToArray("X", xPos);
        let yArr : number = gridToArray("Y", yPos);
        let zArr : number = gridToArray("Z", zPos);
        console.log("Removing block at indexes = x: " + xArr + " y: " + yArr + " z: " + zArr);

        /** FLIP COUNTER 0 **/
        if(this.rotationCounter === 0 && this.flipCounter === 0) {      //starting L
            //sets starting spot in array (bottom left corner of L) to true
            this.pieceData[xArr][yArr][zArr] = false;           //bottom left
            this.pieceData[xArr][yArr - 1][zArr] = false;       //top left
            this.pieceData[xArr + 1][yArr][zArr] = false;       //bottom right

            gridData[xArr][yArr][zArr] = false;           //bottom left
            gridData[xArr][yArr - 1][zArr] = false;       //top left
            gridData[xArr + 1][yArr][zArr] = false;       //bottom right
        } else if (this.rotationCounter === 1 && this.flipCounter === 0) {  //rotated pi/2 counterclockwise
            this.pieceData[xArr][yArr][zArr] = false;           //bottom front
            this.pieceData[xArr][yArr - 1][zArr] = false;       //bottom top
            this.pieceData[xArr][yArr][zArr + 1] = false;       //bottom back

            gridData[xArr][yArr][zArr] = false;           //bottom front
            gridData[xArr][yArr - 1][zArr] = false;       //bottom top
            gridData[xArr][yArr][zArr + 1] = false;       //bottom back
        } else if (this.rotationCounter === 2 && this.flipCounter === 0) {  //rotated pi counterclockwise
            this.pieceData[xArr][yArr][zArr] = false;           //bottom right
            this.pieceData[xArr][yArr - 1][zArr] = false;       //top right
            this.pieceData[xArr - 1][yArr][zArr] = false;       //bottom left

            gridData[xArr][yArr][zArr] = false;           //bottom right
            gridData[xArr][yArr - 1][zArr] = false;       //top right
            gridData[xArr - 1][yArr][zArr] = false;       //bottom left
        } else if (this.rotationCounter === 3 && this.flipCounter === 0) {  //rotated 3*pi/2 counterclockwise
            this.pieceData[xArr][yArr][zArr] = false;           //bottom back
            this.pieceData[xArr][yArr - 1][zArr] = false;       //top back
            this.pieceData[xArr][yArr][zArr - 1] = false;           //bottom front

            gridData[xArr][yArr][zArr] = false;           //bottom back
            gridData[xArr][yArr - 1][zArr] = false;       //top back
            gridData[xArr][yArr][zArr - 1] = false;           //bottom front
        /** FLIP COUNTER 1 **/
        } else if (this.rotationCounter === 0 && this.flipCounter === 1) {
            this.pieceData[xArr][yArr][zArr] = false;           //back left
            this.pieceData[xArr + 1][yArr][zArr] = false;       //back right
            this.pieceData[xArr][yArr][zArr - 1] = false;       //front left

            gridData[xArr][yArr][zArr] = false;           //back left
            gridData[xArr + 1][yArr][zArr] = false;       //back right
            gridData[xArr][yArr][zArr - 1] = false;       //front left
        } else if (this.rotationCounter === 1 && this.flipCounter === 1) {
            this.pieceData[xArr][yArr][zArr] = false;           //front left
            this.pieceData[xArr + 1][yArr][zArr] = false;       //front right
            this.pieceData[xArr][yArr][zArr + 1] = false;       //back left

            gridData[xArr][yArr][zArr] = false;           //front left
            gridData[xArr + 1][yArr][zArr] = false;       //front right
            gridData[xArr][yArr][zArr + 1] = false;       //back left
        } else if (this.rotationCounter === 2 && this.flipCounter === 1) {
            this.pieceData[xArr][yArr][zArr] = false;           //front right
            this.pieceData[xArr][yArr][zArr + 1] = false;       //back right
            this.pieceData[xArr - 1][yArr][zArr] = false;       //front left

            gridData[xArr][yArr][zArr] = false;           //front right
            gridData[xArr][yArr][zArr + 1] = false;       //back right
            gridData[xArr - 1][yArr][zArr] = false;       //front left
        } else if (this.rotationCounter === 3 && this.flipCounter === 1) {
            this.pieceData[xArr][yArr][zArr] = false;           //back right
            this.pieceData[xArr][yArr][zArr - 1] = false;       //front right
            this.pieceData[xArr - 1][yArr][zArr] = false;       //back left

            gridData[xArr][yArr][zArr] = false;           //back right
            gridData[xArr][yArr][zArr - 1] = false;       //front right
            gridData[xArr - 1][yArr][zArr] = false;       //back left
        /** FLIP COUNTER 2 */
        } else if (this.rotationCounter === 0 && this.flipCounter === 2) {
            this.pieceData[xArr][yArr][zArr] = false;           //top left
            this.pieceData[xArr + 1][yArr][zArr] = false;       //top right
            this.pieceData[xArr][yArr + 1][zArr] = false;       //bottom left

            gridData[xArr][yArr][zArr] = false;           //top left
            gridData[xArr + 1][yArr][zArr] = false;       //top right
            gridData[xArr][yArr + 1][zArr] = false;       //bottom left
        } else if (this.rotationCounter === 1 && this.flipCounter === 2) {
            this.pieceData[xArr][yArr][zArr] = false;           //front top
            this.pieceData[xArr][yArr][zArr + 1] = false;       //back top
            this.pieceData[xArr][yArr + 1][zArr] = false;       //front bottom

            gridData[xArr][yArr][zArr] = false;           //front top
            gridData[xArr][yArr][zArr + 1] = false;       //back top
            gridData[xArr][yArr + 1][zArr] = false;       //front bottom
        } else if (this.rotationCounter === 2 && this.flipCounter === 2) {
            this.pieceData[xArr][yArr][zArr] = false;           //top right
            this.pieceData[xArr - 1][yArr][zArr] = false;       //top left
            this.pieceData[xArr][yArr + 1][zArr] = false;       //bottom left

            gridData[xArr][yArr][zArr] = false;           //top right
            gridData[xArr - 1][yArr][zArr] = false;       //top left
            gridData[xArr][yArr + 1][zArr] = false;       //bottom left
        } else if (this.rotationCounter === 3 && this.flipCounter === 2) {
            this.pieceData[xArr][yArr][zArr] = false;           //back top
            this.pieceData[xArr][yArr][zArr - 1] = false;       //front top
            this.pieceData[xArr][yArr + 1][zArr] = false;       //back bottom

            gridData[xArr][yArr][zArr] = false;           //back top
            gridData[xArr][yArr][zArr - 1] = false;       //front top
            gridData[xArr][yArr + 1][zArr] = false;       //back bottom
        /** FLIP COUNTER 3 */
        } else if (this.rotationCounter === 0 && this.flipCounter === 3) {
            this.pieceData[xArr][yArr][zArr] = false;           //front left
            this.pieceData[xArr + 1][yArr][zArr] = false;       //front right
            this.pieceData[xArr][yArr][zArr + 1] = false;       //back left

            gridData[xArr][yArr][zArr] = false;           //front left
            gridData[xArr + 1][yArr][zArr] = false;       //front right
            gridData[xArr][yArr][zArr + 1] = false;       //back left
        } else if (this.rotationCounter === 1 && this.flipCounter === 3) {
            this.pieceData[xArr][yArr][zArr] = false;           //front right
            this.pieceData[xArr - 1][yArr][zArr] = false;       //front left
            this.pieceData[xArr][yArr][zArr + 1] = false;       //back left

            gridData[xArr][yArr][zArr] = false;           //front right
            gridData[xArr - 1][yArr][zArr] = false;       //front left
            gridData[xArr][yArr][zArr + 1] = false;       //back left
        } else if (this.rotationCounter === 2 && this.flipCounter === 3) {
            this.pieceData[xArr][yArr][zArr] = false;           //back right
            this.pieceData[xArr - 1][yArr][zArr] = false;       //back left
            this.pieceData[xArr][yArr][zArr - 1] = false;       //front right

            gridData[xArr][yArr][zArr] = false;           //back right
            gridData[xArr - 1][yArr][zArr] = false;       //back left
            gridData[xArr][yArr][zArr - 1] = false;       //front right
        } else { //this.rotationCounter === 3 && this.flipCounter === 3
            this.pieceData[xArr][yArr][zArr] = false;           //back left
            this.pieceData[xArr + 1][yArr][zArr] = false;       //back right
            this.pieceData[xArr][yArr][zArr - 1] = false;       //front left

            gridData[xArr][yArr][zArr] = false;           //back left
            gridData[xArr + 1][yArr][zArr] = false;       //back right
            gridData[xArr][yArr][zArr - 1] = false;       //front left
        }
    }

    meshCollisionCheck(xPos : number, yPos :  number, zPos : number, grid : boolean[], direction? : string) {
        let xArr : number = gridToArray("X", xPos);
        let yArr : number = gridToArray("Y", yPos);
        let zArr : number = gridToArray("Z", zPos);
        // console.log("Array Indexes = x: " + xArr + " y: " + yArr + " z: " + zArr);

        let dir = direction.toUpperCase();

        /************* FLIPCOUNTER === 0 *************/
        if(this.flipCounter === 0) {      //starting L
            switch(dir) {
                case "L":   //going left, key "A"
                    if (this.rotationCounter === 0) {   //L
                        //xArr is -1 already
                        if( grid[xArr][yArr][zArr] === false &&
                            grid[xArr][yArr - 1][zArr] === false) {
                            return true;
                        }
                    } else if (this.rotationCounter === 1) {
                        //xArr is -1 already
                        if( grid[xArr][yArr][zArr] === false &&
                            grid[xArr][yArr - 1][zArr] === false &&
                            grid[xArr][yArr][zArr + 1] === false) {
                            return true;
                        }
                    } else if (this.rotationCounter === 2) {
                        //xArr is -1 already
                        if( grid[xArr - 1][yArr][zArr] === false &&
                            grid[xArr][yArr - 1][zArr] === false) {
                            return true;
                        }
                    } else {    //this.rotationCounter === 3
                        //xArr is -1 already
                        if( grid[xArr][yArr][zArr] === false &&
                            grid[xArr][yArr - 1][zArr] === false &&
                            grid[xArr][yArr][zArr - 1] === false) {
                            return true;
                        }
                    }
                    break;
                case "R":   //going right, key "D"
                    //xArr is +1 already
                    if (this.rotationCounter === 0) {
                        if( grid[xArr + 1][yArr][zArr] === false &&     //bottom right
                            grid[xArr][yArr - 1][zArr] === false) {     //top left
                            return true;
                        }
                    } else if (this.rotationCounter === 1) {
                        //xArr is +1 already
                        if( grid[xArr][yArr][zArr] === false &&
                            grid[xArr][yArr - 1][zArr] === false &&
                            grid[xArr][yArr][zArr + 1] === false) {
                            return true; 
                        }
                    } else if (this.rotationCounter === 2) {
                        //xArr is +1 already
                        if( grid[xArr][yArr][zArr] === false &&
                            grid[xArr][yArr - 1][zArr] === false) {
                            return true;
                        }
                    } else {    //this.rotationCounter === 3
                        //xArr is +1 already
                        if( grid[xArr][yArr][zArr] === false &&
                            grid[xArr][yArr - 1][zArr] === false &&
                            grid[xArr][yArr][zArr - 1] === false) {
                            return true;
                        }
                    }
                    break;
                case "B":   //going backwards, key "W"
                    if (this.rotationCounter === 0) {
                        //zArr is +1 already
                        if( grid[xArr][yArr][zArr] === false &&         //bottom left
                            grid[xArr][yArr - 1][zArr] === false &&     //top left
                            grid[xArr + 1][yArr][zArr] === false) {     //bottom right
                            return true;
                        }
                    } else if (this.rotationCounter === 1) {
                        //zArr is +1 already
                        if( grid[xArr][yArr][zArr + 1] === false && 
                            grid[xArr][yArr - 1][zArr] === false) {
                            return true; 
                        }
                    } else if (this.rotationCounter === 2) {
                        //zArr is +1 already
                        if( grid[xArr][yArr][zArr] === false &&
                            grid[xArr][yArr - 1][zArr] === false &&
                            grid[xArr - 1][yArr][zArr] === false) {
                            return true; 
                        }
                    } else {    //this.rotationCounter === 3
                        //zArr is +1 already
                        if( grid[xArr][yArr][zArr] === false &&
                            grid[xArr][yArr - 1][zArr] === false) {
                            return true;
                        }
                    }
                    break;
                case "F":   //going forward, key "S"
                    if (this.rotationCounter === 0) {
                        //zArr is -1 already
                        if( grid[xArr][yArr][zArr] === false &&     //bottom left
                            grid[xArr][yArr - 1][zArr] === false && //top left
                            grid[xArr + 1][yArr][zArr] === false) { //bottom right
                            return true;
                        }
                    } else if (this.rotationCounter === 1) {
                        //zArr is -1 already
                        if( grid[xArr][yArr][zArr] === false &&
                            grid[xArr][yArr - 1][zArr] === false) {
                            return true; 
                        }
                    } else if (this.rotationCounter === 2) {
                        //zArr is -1 already
                        if( grid[xArr][yArr][zArr] === false &&
                            grid[xArr][yArr - 1][zArr] === false &&
                            grid[xArr - 1][yArr][zArr] === false) {
                            return true; 
                        }
                    } else {    //this.rotationCounter === 3
                        //zArr is -1 already
                        if( grid[xArr][yArr][zArr - 1] === false &&
                            grid[xArr][yArr - 1][zArr] === false) {
                            return true; 
                        }
                    }
                    break;
                case " ":
                    if(this.rotationCounter === 0) {
                        if( grid[xArr][yArr][zArr] === false &&
                            grid[xArr + 1][yArr][zArr] === false) {
                            return true;
                        }
                    } else if (this.rotationCounter === 1) {
                        if( grid[xArr][yArr][zArr] === false &&
                            grid[xArr][yArr][zArr + 1] === false) {
                            return true;
                        }
                    } else if (this.rotationCounter === 2) {
                        if( grid[xArr][yArr][zArr] === false &&
                            grid[xArr - 1][yArr][zArr] === false) {
                            return true;
                        }
                    } else {    //this.rotationCounter === 3
                        if( grid[xArr][yArr][zArr] === false &&
                            grid[xArr][yArr][zArr - 1] === false) {
                            return true;
                        }
                    }
                    break;
            }   //switch
        /************* FLIPCOUNTER === 1 *************/
        } else if (this.flipCounter === 1) {
            switch(dir) {
                case "L":   //moving left, key "A"
                    if (this.rotationCounter === 0) {
                        //xArr is -1 already
                        if( grid[xArr][yArr][zArr] === false &&
                            grid[xArr][yArr][zArr - 1] === false) {
                            return true;
                        }
                    } else if (this.rotationCounter === 1) {
                        //xArr is -1 already
                        if( grid[xArr][yArr][zArr] === false &&
                            grid[xArr][yArr][zArr + 1] === false) {
                            return true;
                        }
                    } else if (this.rotationCounter === 2) {
                        //xArr is -1 already
                        if( grid[xArr - 1][yArr][zArr] === false && 
                            grid[xArr][yArr][zArr + 1] === false) {
                            return true;
                        }
                    } else {    //this.rotationCounter === 3
                        //xArr is -1 already
                        if( grid[xArr - 1][yArr][zArr] === false &&
                            grid[xArr][yArr][zArr - 1] === false) {
                            return true;
                        }
                    }
                    break;
                case "R":   //moving right, key "D"
                    if (this.rotationCounter === 0) {
                        //xArr is +1 already
                        if( grid[xArr + 1][yArr][zArr] === false &&
                            grid[xArr][yArr][zArr - 1] === false) {
                            return true;
                        }
                    } else if (this.rotationCounter === 1) {
                        //xArr is +1 already
                        if( grid[xArr + 1][yArr][zArr] === false &&
                            grid[xArr][yArr][zArr + 1] === false) {
                            return true;
                        }
                    } else if (this.rotationCounter === 2) {
                        //xArr is +1 already
                        if( grid[xArr][yArr][zArr] === false &&
                            grid[xArr][yArr][zArr + 1] === false) {
                            return true;
                        }
                    } else {    //this.rotationCounter === 3
                        //xArr is +1 already
                        if( grid[xArr][yArr][zArr] === false &&
                            grid[xArr][yArr][zArr - 1] === false) {
                            return true;
                        }
                    }
                    break;
                case "B":   //moving backwards, key "W"
                    if (this.rotationCounter === 0) {
                        //zArr is +1 already
                        if( grid[xArr][yArr][zArr] === false &&
                            grid[xArr + 1][yArr][zArr] === false) {
                            return true;
                        }
                    } else if (this.rotationCounter === 1) {
                        //zArr is +1 already
                        if( grid[xArr][yArr][zArr + 1] === false &&
                            grid[xArr + 1][yArr][zArr] === false) {
                            return true;
                        }
                    } else if (this.rotationCounter === 2) {
                        //zArr is +1 already
                        if( grid[xArr][yArr][zArr + 1] === false &&
                            grid[xArr - 1][yArr][zArr] === false) {
                            return true;
                        }
                    } else {    //this.rotationCounter === 3
                        //zArr is +1 already
                        if( grid[xArr][yArr][zArr] === false &&
                            grid[xArr - 1][yArr][zArr] === false) {
                            return true;
                        }
                    }
                    break;
                case "F": //moving forward, key "S"
                    if (this.rotationCounter === 0) {
                        //zArr is -1 already
                        if( grid[xArr][yArr][zArr - 1] === false &&
                            grid[xArr + 1][yArr][zArr] === false) {
                            return true;
                        }
                    } else if (this.rotationCounter === 1) {
                        //zArr is -1 already
                        if( grid[xArr][yArr][zArr] === false &&
                            grid[xArr + 1][yArr][zArr] === false) {
                            return true;
                        }
                    } else if (this.rotationCounter === 2) {
                        //zArr is -1 already
                        if( grid[xArr][yArr][zArr] === false &&
                            grid[xArr - 1][yArr][zArr] === false) {
                            return true;
                        }
                    } else {    //this.rotationCounter === 3
                        //zArr is -1 already
                        if( grid[xArr][yArr][zArr - 1] === false &&
                            grid[xArr - 1][yArr][zArr] === false) {
                            return true;
                        }
                    }
                    break;
                case " ":
                    if( this.rotationCounter === 0) {
                        if( grid[xArr][yArr][zArr] === false &&
                            grid[xArr + 1][yArr][zArr] === false &&
                            grid[xArr][yArr][zArr - 1] === false) {
                            return true;
                        }
                    } else if (this.rotationCounter === 1) {
                        if( grid[xArr][yArr][zArr] === false &&
                            grid[xArr + 1][yArr][zArr] === false &&
                            grid[xArr][yArr][zArr + 1] === false) {
                                return true;
                        }
                    } else if (this.rotationCounter === 2) {
                        if( grid[xArr][yArr][zArr] === false &&
                            grid[xArr][yArr][zArr + 1] === false &&
                            grid[xArr - 1][yArr][zArr] === false) {
                                return true;
                        }
                    } else {    //this.rotationCounter === 3
                        if( grid[xArr][yArr][zArr] === false &&
                            grid[xArr][yArr][zArr - 1] === false &&
                            grid[xArr - 1][yArr][zArr] === false) {
                                return true; 
                        }
                    }
                    break;
            }   //switch
        /************* FLIPCOUNTER === 2 *************/
        } else if (this.flipCounter === 2) {
            switch(dir) {
                case "L":   //moving left, key "A"
                    if (this.rotationCounter === 0) {
                        //xArr is -1 already
                        if( grid[xArr][yArr][zArr] === false &&
                            grid[xArr][yArr + 1][zArr] === false) {
                            return true;
                        }
                    } else if (this.rotationCounter === 1) {
                        //xArr is -1 already
                        if( grid[xArr][yArr][zArr] === false &&
                            grid[xArr][yArr + 1][zArr] === false &&
                            grid[xArr][yArr][zArr + 1] === false) {
                            return true;
                        }
                    } else if (this.rotationCounter === 2) {
                        //xArr is -1 already
                        if( grid[xArr - 1][yArr][zArr] === false &&
                            grid[xArr][yArr + 1][zArr] === false) {
                            return true;
                        }
                    } else {    //this.rotationCounter === 3
                        //xArr is -1 already
                        if( grid[xArr][yArr][zArr] === false &&
                            grid[xArr][yArr + 1][zArr] === false &&
                            grid[xArr][yArr][zArr - 1] === false) {
                            return true;
                        }
                    }
                    break;
                case "R":   //moving right, key "D"
                    if (this.rotationCounter === 0) {
                        //xArr is +1 already
                        if( grid[xArr + 1][yArr][zArr] === false &&
                            grid[xArr][yArr + 1][zArr] === false) {
                            return true;
                        }
                    } else if (this.rotationCounter === 1) {
                        //xArr is +1 already
                        if( grid[xArr][yArr][zArr] === false &&
                            grid[xArr][yArr + 1][zArr] === false &&
                            grid[xArr][yArr][zArr + 1] === false) {
                            return true;
                        }
                    } else if (this.rotationCounter === 2) {
                        //xArr is +1 already
                        if( grid[xArr][yArr][zArr] === false &&
                            grid[xArr][yArr + 1][zArr] === false) {
                            return true;
                        }
                    } else {    //this.rotationCounter === 3
                        //xArr is +1 already
                        if( grid[xArr][yArr][zArr] === false &&
                            grid[xArr][yArr + 1][zArr] === false &&
                            grid[xArr][yArr][zArr - 1] === false) {
                            return true;
                        }
                    }
                    break;
                case "B":   //going backwards, case "W"
                    if (this.rotationCounter === 0) {
                        //zArr is +1 already
                        if( grid[xArr][yArr][zArr] === false &&
                            grid[xArr][yArr + 1][zArr] === false &&
                            grid[xArr + 1][yArr][zArr] === false) {
                            return true;
                        }
                    } else if (this.rotationCounter === 1) {
                        //zArr is +1 already
                        if( grid[xArr][yArr][zArr + 1] === false &&
                            grid[xArr][yArr + 1][zArr] === false) {
                            return true;
                        }
                    } else if (this.rotationCounter === 2) {
                        //zArr is +1 already
                        if( grid[xArr][yArr][zArr] === false &&
                            grid[xArr][yArr + 1][zArr] === false &&
                            grid[xArr - 1][yArr][zArr] === false) {
                            return true;
                        }
                    } else {    //this.rotationCounter === 3
                        //zArr is +1 already
                        if( grid[xArr][yArr][zArr] === false &&
                            grid[xArr][yArr + 1][zArr] === false) {
                            return true;
                        }
                    }
                    break;
                case "F":   //moving forward, key "S"
                    if (this.rotationCounter === 0) {
                        //zArr is -1 already
                        if( grid[xArr][yArr][zArr] === false &&
                            grid[xArr][yArr + 1][zArr] === false &&
                            grid[xArr + 1][yArr][zArr] === false) {
                            return true;
                        }
                    } else if (this.rotationCounter === 1) {
                        //zArr is -1 already
                        if( grid[xArr][yArr][zArr] === false &&
                            grid[xArr][yArr + 1][zArr] === false) {
                            return true;
                        }
                    } else if (this.rotationCounter === 2) {
                        //zArr is -1 already
                        if( grid[xArr][yArr][zArr] === false &&
                            grid[xArr][yArr + 1][zArr] === false &&
                            grid[xArr - 1][yArr][zArr] === false) {
                            return true;
                        }
                    } else {    //this.rotationCounter === 3
                        //zArr is -1 already
                        if( grid[xArr][yArr][zArr - 1] === false &&
                            grid[xArr][yArr + 1][zArr] === false) {
                            return true;
                        }
                    }
                    break;
                case " ":
                    if( this.rotationCounter === 0) {
                        if( grid[xArr][yArr + 1][zArr] === false &&
                            grid[xArr + 1][yArr][zArr] === false) {
                                return true;
                        }
                    } else if (this.rotationCounter === 1) {
                        if( grid[xArr][yArr + 1][zArr] === false &&
                            grid[xArr][yArr][zArr + 1] === false) {
                                return true;
                        }
                    } else if (this.rotationCounter === 2) {
                        if( grid[xArr][yArr + 1][zArr] === false &&
                            grid[xArr - 1][yArr][zArr] === false) {
                                return true;
                        }
                    } else {    //this.rotationCounter === 3
                        if( grid[xArr][yArr + 1][zArr] === false &&
                            grid[xArr][yArr][zArr - 1] === false) {
                                return true;
                        }
                    }
                    break;
            }   //switch
        /************* FLIPCOUNTER === 3 *************/
        } else {    //this.flipCounter === 3
            switch(dir) {
                case "L":   //going left, key "A"
                    if (this.rotationCounter === 0) {
                        //xArr is -1 already
                        if( grid[xArr][yArr][zArr] === false &&
                            grid[xArr][yArr][zArr + 1] === false) {
                            return true;
                        }
                    } else if (this.rotationCounter === 1) {
                        //xArr is -1 already
                        if( grid[xArr - 1][yArr][zArr] === false &&
                            grid[xArr][yArr][zArr + 1] === false) {
                            return true;
                        }
                    } else if (this.rotationCounter === 2) {
                        //xArr is -1 already
                        if( grid[xArr - 1][yArr][zArr] === false &&
                            grid[xArr][yArr][zArr - 1] === false) {
                            return true;
                        }
                    } else {    //this.rotationCounter === 3
                        //xArr is -1 already
                        if( grid[xArr][yArr][zArr] === false &&
                            grid[xArr][yArr][zArr - 1] === false) {
                            return true;
                        }
                    }
                    break;
                case "R":   //going right, key "D"
                    if (this.rotationCounter === 0) {
                        //xArr is +1 already
                        if( grid[xArr + 1][yArr][zArr] === false &&
                            grid[xArr][yArr][zArr + 1] === false) {
                            return true;
                        }
                    } else if (this.rotationCounter === 1) {
                        //xArr is +1 already
                        if( grid[xArr][yArr][zArr] === false &&
                            grid[xArr][yArr][zArr + 1] === false) {
                            return true;
                        }
                    } else if (this.rotationCounter === 2) {
                        //xArr is +1 already
                        if( grid[xArr][yArr][zArr] === false &&
                            grid[xArr][yArr][zArr - 1] === false) {
                            return true;
                        }
                    } else {    //this.rotationCounter === 3
                        //xArr is +1 already
                        if( grid[xArr + 1][yArr][zArr] === false &&
                            grid[xArr][yArr][zArr - 1] === false) {
                            return true;
                        }
                    }
                    break;
                case "B":   //going backwards, key "W"
                    if (this.rotationCounter === 0) {
                        //zArr is +1 already
                        if( grid[xArr][yArr][zArr + 1] === false &&
                            grid[xArr + 1][yArr][zArr] === false) {
                            return true;
                        }
                    } else if (this.rotationCounter === 1) {
                        //zArr is +1 already
                        if( grid[xArr][yArr][zArr + 1] === false &&
                            grid[xArr - 1][yArr][zArr] === false) {
                            return true;
                        }
                    } else if (this.rotationCounter === 2) {
                        //zArr is +1 already
                        if( grid[xArr - 1][yArr][zArr] === false &&
                            grid[xArr][yArr][zArr] === false) {
                            return true;
                        }
                    } else {    //this.rotationCounter === 3
                        //zArr is +1 already
                        if( grid[xArr][yArr][zArr] === false &&
                            grid[xArr + 1][yArr][zArr] === false) {
                            return true;
                        }
                    }
                    break;
                case "F":   //going forwards, key "S"
                    if (this.rotationCounter === 0) {
                        //zArr is -1 already
                        if( grid[xArr][yArr][zArr] === false &&
                            grid[xArr + 1][yArr][zArr] === false) {
                            return true;
                        }
                    } else if (this.rotationCounter === 1) {
                        //zArr is -1 already
                        if( grid[xArr][yArr][zArr] === false &&
                            grid[xArr - 1][yArr][zArr] === false) {
                            return true;
                        }
                    } else if (this.rotationCounter === 2) {
                        //zArr is -1 already
                        if( grid[xArr][yArr][zArr - 1] === false &&
                            grid[xArr - 1][yArr][zArr] === false) {
                            return true;
                        }
                    } else {    //this.rotationCounter === 3
                        //zArr is -1 already
                        if( grid[xArr][yArr][zArr - 1] === false &&
                            grid[xArr + 1][yArr][zArr] === false) {
                            return true;
                        }
                    }
                    break;
                case " ":
                    if( this.rotationCounter === 0) {
                        if( grid[xArr][yArr][zArr] === false &&
                            grid[xArr + 1][yArr][zArr] === false &&
                            grid[xArr][yArr][zArr + 1] === false) {
                            return true;
                        }
                    } else if (this.rotationCounter === 1) {
                        if( grid[xArr][yArr][zArr] === false &&
                            grid[xArr- 1][yArr][zArr] === false &&
                            grid[xArr][yArr][zArr + 1] === false) {
                            return true;
                        }
                    } else if (this.rotationCounter === 2) {
                        if( grid[xArr][yArr][zArr] === false &&
                            grid[xArr][yArr][zArr - 1] === false &&
                            grid[xArr - 1][yArr][zArr] === false) {
                            return true;
                        }
                    } else {    //this.rotationCounter === 3
                        if( grid[xArr][yArr][zArr] === false &&
                            grid[xArr][yArr][zArr - 1] === false &&
                            grid[xArr + 1][yArr][zArr] === false) {
                            return true;
                        }
                    }
                    break;
            }   //switch
        }
        // console.log("returning false");
        return false;
    }
}