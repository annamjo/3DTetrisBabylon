/*
 *  Subclass for 1 by 3 shorter tower
 *  Starting position is sideways, left to right
 */

 class ShortTower extends Piece {
    //properties for starting position of block
    private _xStartPosition : number;
    private _zStartPosition : number;
    private _yStartPosition : number;
    private _width : number;        //width of 1
    private _height : number;       //height of 3
    private _length : number;       //length of 1
    private rotationCounter : number;       //counter for keeping track of rotations, for ShortTower (0-2)
    private flipCounter : number;

    //properties unique to ShortTower
    private _color : string;        //ShortTower will always be color: blue
    private _shortTower;        //will store physical piece
    private _shortTowerMaterial;        //will store color : blue
    private _center : BABYLON.Mesh;
    private mesh : BABYLON.Mesh;

    constructor(name : string, isActive : boolean, offsetW : boolean, offsetH : boolean, ground : any) {
        super(name, isActive, offsetW, offsetH, ground);

        //setting starting positions
        this._xStartPosition = 0;
        this._yStartPosition = 0;
        this._zStartPosition = 0;

        this.rotationCounter = 0;
        this.flipCounter = 0;

        //properties specific to ShortTower
        this._width = 1;
        this._height = 3;
        this._length = 1;
        this._color = "blue";

        //creating physical short tower
        this._shortTower = BABYLON.MeshBuilder.CreateBox("shortTower", {width: this._width, height: this._height, depth: this._length}, scene);

        //creating sphere that is center of rotation
        this._center = BABYLON.MeshBuilder.CreateSphere("sphere", {diameter: 0.1}, scene);
        this._center.position = new BABYLON.Vector3(0, 0, 0);

        //SUPER IMPORTANT: attaches block to center
        this._shortTower.parent = this._center;

        if(!offsetW) {
            this._center.position.x += this._shift;
            this._center.position.z += this._shift;
        }
        if(!offsetH) {
            this._center.position.y += this._shift;
        }

        this.mesh = this._center;

        //setting start position
        this._shortTower.position.x = this._xStartPosition;
        this._shortTower.position.y = this._yStartPosition;
        this._shortTower.position.z = this._zStartPosition;

        //setting color to blue
        this._shortTowerMaterial = new BABYLON.StandardMaterial('smallCubeMat', scene);
        this._shortTowerMaterial.diffuseColor = new BABYLON.Color3(0, 0, 1);
        // this._shortTowerMaterial.wireframe = true;   //wireframe for debugging
        
        this.mesh.rotation.y = Math.PI/2;
        this.mesh.rotation.x = Math.PI/2;

        this._shortTower.material = this._shortTowerMaterial;
    }
    
    get piece() {
        return this._shortTower;
    }

    get center() {
        return this.mesh;
    }

    //changeState function will change the block to active or unactive depending on the state when initiailly called
    changeState() {    
        this._isActive = !this._isActive;
        //for debugging and keeping track
        if(this._isActive) {
            console.log("Block is active");
        } else {
            console.log("Block is unactive");
        }
    }

    rotate() {
        // console.log("Rotation: " + this.rotationCounter); 
        this.rotationCounter += 1;     //increment at start because rotationCounter is initialized to 0 (case 0)
        
        if (this.rotationCounter === 2) {   //either 0 or 1
            this.rotationCounter = 0;
        }
        if( this.flipCounter === 0) {   //when upright, rotate doesn't change anything
            //only updates if sideways
            this.mesh.rotation.y -= this._rotation;
        }

        // console.log("Rotation amount: " + this.mesh.rotation.y);
    }

    unrotate() {
        this.rotationCounter -= 1;     //increment at start because rotationCounter is initialized to 0 (case 0)
        
        if (this.rotationCounter === -1) {   //either 0 or 1
            this.rotationCounter = 1;
        }
        if (this.flipCounter === 0 ) {  //when upright, rotate doesn't change anything
            //only updates if sideways
            this.mesh.rotation.y += this._rotation;
        }
    }

    flip () {
        // console.log("Flip: " + this.flipCounter);
        this.flipCounter += 1;

        if(this.flipCounter === 2) {    //either 0 or 1
            this.flipCounter = 0;
        }
        this.mesh.rotation.x -= this._rotation;
    }

    unflip() {
        this.flipCounter -= 1;

        if(this.flipCounter === -1) {    //either 0 or 1
            this.flipCounter = 1;
        }
        this.mesh.rotation.x += this._rotation;
    }

    rotFlipCollisionCheck(xPos : number, yPos :  number, zPos : number, grid : boolean[]) {
        // console.log("coordinates = x: " + xPos + " y: " + yPos + " z: " + zPos);
        let xArr : number = gridToArray("X", xPos);
        let yArr : number = gridToArray("Y", yPos);
        let zArr : number = gridToArray("Z", zPos);
        // console.log("Attempting to rotate/flip at...");
        // console.log("Indexes = x: " + xArr + " y: " + yArr + " z: " + zArr);
        // console.log("Rotation: " + this.rotationCounter + " Flip: " + this.flipCounter);

        if( this.rotationCounter === 0 && this.flipCounter === 0 &&
            grid[xArr - 1][yArr][zArr] === false &&
            grid[xArr + 1][yArr][zArr] === false) {
                return true; 
        }
        if( this.rotationCounter === 1 && this.flipCounter === 0 &&
            grid[xArr][yArr][zArr + 1] === false &&
            grid[xArr][yArr][zArr - 1] === false) {
                return true;
        }
        if( this.flipCounter === 1 &&       //checking upright position
            grid[xArr][yArr - 1][zArr] === false &&
            grid[xArr][yArr + 1][zArr] === false) {
                return true;
        }
        return false; 
    }

    placeBlock() {
        let xPos : number = this.mesh.position.x;
        let yPos : number = this.mesh.position.y;
        let zPos : number = this.mesh.position.z;
        // console.log("Coordinates = x: " + xPos + " y: " + yPos + " z: " + zPos);

        let xArr : number = gridToArray("X", xPos);
        let yArr : number = gridToArray("Y", yPos);
        let zArr : number = gridToArray("Z", zPos);
        // console.log("Placing block at indexes = x: " + xArr + " y: " + yArr + " z: " + zArr);
        // console.log("Rotation: " + this.rotationCounter + " Flip: " + this.flipCounter);

        if( this.rotationCounter === 0 && this.flipCounter === 0) {     //block is sideways, left to right
            this.pieceData[xArr][yArr][zArr] = true;
            this.pieceData[xArr - 1][yArr][zArr] = true;
            this.pieceData[xArr + 1][yArr][zArr] = true; 
        }
        if( this.rotationCounter === 1 && this.flipCounter === 0) {     //block is sideways, forward to backward
            this.pieceData[xArr][yArr][zArr] = true;
            this.pieceData[xArr][yArr][zArr + 1] = true;
            this.pieceData[xArr][yArr][zArr - 1] = true; 
        }
        if( this.flipCounter === 1) {     //block is upright
            this.pieceData[xArr][yArr][zArr] = true;
            this.pieceData[xArr][yArr - 1][zArr] = true;
            this.pieceData[xArr][yArr + 1][zArr] = true; 
        }       
    }

    removeBlock() {
        let xPos : number = this.mesh.position.x;
        let yPos : number = this.mesh.position.y;
        let zPos : number = this.mesh.position.z;
        // console.log("Coordinates = x: " + xPos + " y: " + yPos + " z: " + zPos);

        let xArr : number = gridToArray("X", xPos);
        let yArr : number = gridToArray("Y", yPos);
        let zArr : number = gridToArray("Z", zPos);
        // console.log("Removing block at indexes = x: " + xArr + " y: " + yArr + " z: " + zArr);

        if( this.rotationCounter === 0 && this.flipCounter === 0) {     //block is sideways, left to right
            this.pieceData[xArr][yArr][zArr] = false;
            this.pieceData[xArr - 1][yArr][zArr] = false;
            this.pieceData[xArr + 1][yArr][zArr] = false; 

            gridData[xArr][yArr][zArr] = false;
            gridData[xArr - 1][yArr][zArr] = false;
            gridData[xArr + 1][yArr][zArr] = false; 
        }
        if( this.rotationCounter === 1 && this.flipCounter === 0) {     //block is sideways, forward to backward
            this.pieceData[xArr][yArr][zArr] = false;
            this.pieceData[xArr][yArr][zArr + 1] = false;
            this.pieceData[xArr][yArr][zArr - 1] = false; 

            gridData[xArr][yArr][zArr] = false;
            gridData[xArr][yArr][zArr + 1] = false;
            gridData[xArr][yArr][zArr - 1] = false; 
        }
        if( this.flipCounter === 1) {     //block is upright
            this.pieceData[xArr][yArr][zArr] = false;
            this.pieceData[xArr][yArr - 1][zArr] = false;
            this.pieceData[xArr][yArr + 1][zArr] = false; 

            gridData[xArr][yArr][zArr] = false;
            gridData[xArr][yArr - 1][zArr] = false;
            gridData[xArr][yArr + 1][zArr] = false; 
        }   
    }

    meshCollisionCheck(xPos : number, yPos :  number, zPos : number, grid : boolean[], direction? : string) {
        let xArr : number = gridToArray("X", xPos);
        let yArr : number = gridToArray("Y", yPos);
        let zArr : number = gridToArray("Z", zPos);
        // console.log("Array Indexes = x: " + xArr + " y: " + yArr + " z: " + zArr);

        let dir = direction.toUpperCase();

        if (this.flipCounter === 0) {
            switch(dir) {
                case "L":   //going left, key "A"
                    if(this.rotationCounter === 0) {
                        //xArr is -1 already
                        if( grid[xArr - 1][yArr][zArr] === false) {
                                return true; 
                        }
                    } else {    //this.rotationCounter === 1
                        //xArr is -1 already
                        if( grid[xArr][yArr][zArr] === false &&
                            grid[xArr][yArr][zArr + 1] === false &&
                            grid[xArr][yArr][zArr - 1] === false) {
                                return true; 
                        }
                    }
                    break;
                case "R":   //going right, key "D"
                    if(this.rotationCounter === 0) {
                        //xArr is +1 already
                        if( grid[xArr + 1][yArr][zArr] === false) {
                                return true; 
                        }
                    } else {    //this.rotationCounter === 1
                        //xArr is +1 already
                        if( grid[xArr][yArr][zArr] === false &&
                            grid[xArr][yArr][zArr + 1] === false &&
                            grid[xArr][yArr][zArr - 1] === false) {
                                return true; 
                        }
                    }
                    break;
                case "B":   //going backwards, key "W"
                    if(this.rotationCounter === 0) {
                        //zArr is +1 already
                        if( grid[xArr][yArr][zArr] === false &&
                            grid[xArr - 1][yArr][zArr] === false &&
                            grid[xArr + 1][yArr][zArr] === false) {
                            return true; 
                        }
                    } else {    //this.rotationCounter === 1
                        //zArr is +1 already
                        if( grid[xArr][yArr][zArr + 1] === false) {
                            return true; 
                        }
                    }
                    break;
                case "F":   //going forward, key "S"
                    if(this.rotationCounter === 0) {
                        //zArr is -1 already
                        if( grid[xArr][yArr][zArr] === false &&
                            grid[xArr + 1][yArr][zArr] === false &&
                            grid[xArr - 1][yArr][zArr] === false) {
                            return true; 
                        }
                    } else {    //this.rotationCounter === 1
                        //zArr is -1 already
                        if( grid[xArr][yArr][zArr - 1] === false) {
                            return true; 
                        }
                    }
                    break;
                case " ":   //going down, key " "
                    if(this.rotationCounter === 0) {
                        //yArr is +1 already
                        if( grid[xArr][yArr][zArr] === false &&
                            grid[xArr - 1][yArr][zArr] === false &&
                            grid[xArr + 1][yArr][zArr] === false) {
                                return true; 
                        }
                    } else {    //this.rotationCounter === 1
                        //yArr is +1 already
                        if( grid[xArr][yArr][zArr] === false &&
                            grid[xArr][yArr][zArr + 1] === false &&
                            grid[xArr][yArr][zArr - 1] === false) {
                                return true; 
                        }
                    }
                    break;
            }   //switch
        } else {    //this.flipCounter === 1
            switch(dir) {
                case "L":   //going left, key "A"
                    //xArr is -1 already
                    if( grid[xArr][yArr][zArr] === false &&
                        grid[xArr][yArr + 1][zArr] === false &&
                        grid[xArr][yArr - 1][zArr] === false) {
                            return true;
                    }
                    break;
                case "R":   //going right, key "D"
                    //xArr is +1 already
                    if( grid[xArr][yArr][zArr] === false &&
                        grid[xArr][yArr + 1][zArr] === false &&
                        grid[xArr][yArr - 1][zArr] === false) {
                            return true;
                    }
                    break;
                case "B":   //going backwards, key "W"
                    //zArr is +1 already
                    if( grid[xArr][yArr][zArr] === false &&
                        grid[xArr][yArr + 1][zArr] === false &&
                        grid[xArr][yArr - 1][zArr] === false) {
                            return true;
                    }
                    break;
                case "F":   //going forward, key "S"
                    //zArr is -1 already
                    if( grid[xArr][yArr][zArr] === false &&
                        grid[xArr][yArr + 1][zArr] === false &&
                        grid[xArr][yArr - 1][zArr] === false) {
                            return true;
                    }
                    break;
                case " ":   //going down, key " "
                    //yArr is +1 already
                    if( grid[xArr][yArr + 1][zArr] === false) {
                        return true;
                    }
                    break;
            }   //switch
        }
        return false;
    }
 }

