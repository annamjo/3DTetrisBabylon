/*
 *  Subclass for large, 2 by 2 cube
 *  Block can move halfway into the wall
 */

 class LargeCube extends Piece {
    //properties for starting position of block, all blocks will fall from the same spot
    private _xStartPosition : number;
    private _zStartPosition : number;
    private _yStartPosition : number;
    private _color : string;     //small cubes will always be color: red

    private _largeCube : BABYLON.Mesh;     //holds physical block
    private _largeCubeMaterial;

    //constructor calls Parent class Piece
    constructor(name : string, isActive : boolean, offsetW : boolean, offsetH : boolean, ground : any) {
        super(name, isActive, offsetW, offsetH, ground);

        this._xStartPosition = 0;
        this._yStartPosition = 2;
        this._zStartPosition = 0;
        if(offsetH) {
            this._yStartPosition -= this._shift;
        }
        if(offsetW) {
            this._xStartPosition += this._shift;
            this._zStartPosition += this._shift;
        }

        //properties specific to LargeCube
        this._color = "green";

        //creating physical LargeCube
        this._largeCube = BABYLON.MeshBuilder.CreateBox("largeCube", {width : 2, height : 2, depth : 2}, scene);

        //setting start position
        this._largeCube.position.x = this._xStartPosition;
        this._largeCube.position.y = this._yStartPosition;
        this._largeCube.position.z = this._zStartPosition;

        //adding color
        this._largeCubeMaterial = new BABYLON.StandardMaterial("largeCubeMat", scene);
        this._largeCubeMaterial.diffuseColor = new BABYLON.Color3(0, 1, 0);
        this._largeCube.material = this._largeCubeMaterial;
    }

    //accessor for getting physical box; needed for getting properties
    get piece() {
        return this._largeCube;
    }

    rotate() {
        //do nothing because symmetrical
    }

    unrotate() {
        //do nothing
    }

    flip() {
        //do nothing because symmetrical
    }

    rotFlipCollisionCheck(xPos : number, yPos :  number, zPos : number, grid : boolean[]) {
        //do nothing
    }

    placeBlock() {
        //coordinates of piece on grid (x, y, z)
        let xPos : number = this._largeCube.position.x;
        let yPos : number = this._largeCube.position.y;
        let zPos : number = this._largeCube.position.z;;

        if (offsetW) {
            xPos -= 0.5;
            zPos -= 0.5;
        }
        if(offsetH) {
            yPos += 0.5;
        }      
        // console.log("Coords = x: " + xPos + " y: " + yPos + " z: " + zPos); 

        let xArr : number = gridToArray("X", xPos);
        let yArr : number = gridToArray("Y", yPos);
        let zArr : number = gridToArray("Z", zPos);
        // console.log("Array Indexes = x: " + xArr + " y: " + yArr + " z: " + zArr);
    
        //sets spot in array (top right corner of block) to true
        this.pieceData[xArr][yArr][zArr] = true;           //front top left
        this.pieceData[xArr + 1][yArr][zArr] = true;       //front top right
        this.pieceData[xArr][yArr + 1][zArr] = true;       //front bottom left
        this.pieceData[xArr + 1][yArr + 1][zArr] = true;   //front bottom right

        this.pieceData[xArr][yArr][zArr + 1] = true;           //back top left
        this.pieceData[xArr + 1][yArr][zArr + 1] = true;       //back top right
        this.pieceData[xArr][yArr + 1][zArr + 1] = true;       //back bottom left
        this.pieceData[xArr + 1][yArr + 1][zArr + 1] = true;   //back bottom right
    }

    removeBlock() {
        //coordinates of piece on grid (x, y, z)
        let xPos : number = this._largeCube.position.x;
        let yPos : number = this._largeCube.position.y;
        let zPos : number = this._largeCube.position.z;;

        if (offsetW) {
            xPos -= 0.5;
            zPos -= 0.5;
        }
        if(offsetH) {
            yPos += 0.5;
        }    
        // console.log("Coords = x: " + xPos + " y: " + yPos + " z: " + zPos); 

        let xArr : number = gridToArray("X", xPos);
        let yArr : number = gridToArray("Y", yPos);
        let zArr : number = gridToArray("Z", zPos);
    
        // console.log("Array Indexes = x: " + xArr + " y: " + yArr + " z: " + zArr);
        //sets spot in Piece array to false
        this.pieceData[xArr][yArr][zArr] = false;           //front top left
        this.pieceData[xArr + 1][yArr][zArr] = false;       //front top right
        this.pieceData[xArr][yArr + 1][zArr] = false;       //front bottom left
        this.pieceData[xArr + 1][yArr + 1][zArr] = false;   //front bottom right
        this.pieceData[xArr][yArr][zArr + 1] = false;           //back top left
        this.pieceData[xArr + 1][yArr][zArr + 1] = false;       //back top right
        this.pieceData[xArr][yArr + 1][zArr + 1] = false;       //back bottom left
        this.pieceData[xArr + 1][yArr + 1][zArr + 1] = false;   //back bottom right

        //sets spot in Grid array to false
        gridData[xArr][yArr][zArr] = false;           //front top left
        gridData[xArr + 1][yArr][zArr] = false;       //front top right
        gridData[xArr][yArr + 1][zArr] = false;       //front bottom left
        gridData[xArr + 1][yArr + 1][zArr] = false;   //front bottom right
        gridData[xArr][yArr][zArr + 1] = false;           //back top left
        gridData[xArr + 1][yArr][zArr + 1] = false;       //back top right
        gridData[xArr][yArr + 1][zArr + 1] = false;       //back bottom left
        gridData[xArr + 1][yArr + 1][zArr + 1] = false;   //back bottom right
    }

    meshCollisionCheck(xPos : number, yPos :  number, zPos : number, grid : boolean[], direction? : string) {
        if (offsetW) {
            xPos -= 0.5;
            zPos -= 0.5;
        }
        if(offsetH) {
            yPos += 0.5;
        }    
        // console.log("Mesh collision x : " + xPos + " y: " + yPos + " z: " + zPos);
        
        //coodinates of piece in array [x][y][z]
        let xArr : number = gridToArray("X", xPos);
        let yArr : number = gridToArray("Y", yPos);
        let zArr : number = gridToArray("Z", zPos);
        // console.log("Array Indexes = x: " + xArr + " y: " + yArr + " z: " + zArr);

        let dir = direction.toUpperCase();

        switch (dir) {
            case "L":   //going left (case "A"); starting square is front top left
                //-1 to original x, nothing to potential x (see code in Piece class) 
                if( grid[xArr][yArr][zArr] === false &&              //front top left
                    grid[xArr][yArr][zArr + 1] === false &&          //back top left
                    grid[xArr][yArr + 1][zArr] === false &&         //front bottom right
                    grid[xArr][yArr + 1][zArr + 1] === false) {     //back bottom right
                    return true;
                }
                break;
            case "R":   //going right (case "D"); starting square is front top left
                //+2 to original x, +1 to potential x (see code in Piece class)
                if( grid[xArr + 1][yArr][zArr] === false &&                 //front top right
                    grid[xArr + 1][yArr + 1][zArr] === false &&             //front bottom right
                    grid[xArr + 1][yArr][zArr + 1] === false &&             //back top right
                    grid[xArr + 1][yArr + 1][zArr + 1] === false ) {        //back bottom right
                    return true;
                }
                break;
            case "B":   //going backwards (key "w")
                //movement is based off the reference point of the block (front-facing top left corner)
                //technically adding +2 to original z (see code in Piece class for key "w"); +1 to potential Z
                if( grid[xArr][yArr][zArr + 1] === false &&             //top left
                    grid[xArr][yArr + 1][zArr + 1] === false &&         //bottom left
                    grid[xArr + 1][yArr][zArr + 1] === false &&         //top right
                    grid[xArr + 1][yArr + 1][zArr + 1] === false ) {    //bottom right
                    return true;
                }
                break;
            case "F":   //going forward (key "s")
                //-1 to original z, nothing to potential z (see subtraction in Piece class)
                if( grid[xArr][yArr][zArr] === false &&             //top left
                    grid[xArr][yArr + 1][zArr] === false &&         //bottom left
                    grid[xArr + 1][yArr][zArr] === false &&         //top right
                    grid[xArr + 1][yArr + 1][zArr] === false ) {    //bottom right
                    return true;
                }
                break;
            case " ":   //going down (key " ")
                //yArr is -1 already
                if( grid[xArr][yArr + 1][zArr] === false &&         //top left
                    grid[xArr + 1][yArr + 1][zArr] === false &&     //top right
                    grid[xArr][yArr + 1][zArr + 1] === false &&     //back left
                    grid[xArr + 1][yArr + 1][zArr + 1] === false) { //back right
                    return true;
                }
        }
        return false;
    }

    placeObject(objectArray : Array<any>) {
        //coordinates of piece on grid (x, y, z)
        let xPos : number = this._largeCube.position.x;
        let yPos : number = this._largeCube.position.y;
        let zPos : number = this._largeCube.position.z;

        if (offsetW) {
            xPos -= 0.5;
            zPos -= 0.5;
        }
        if(offsetH) {
            yPos += 0.5;
        }      

        let xArr : number = gridToArray("X", xPos);
        let yArr : number = gridToArray("Y", yPos);
        let zArr : number = gridToArray("Z", zPos);
    
        //sets spot in array (top left corner of block) to true
        objectArray[xArr][yArr][zArr] = this._largeCube;           //front top left
        objectArray[xArr + 1][yArr][zArr] = this._largeCube;       //front top right
        objectArray[xArr][yArr + 1][zArr] = this._largeCube;       //front bottom left
        objectArray[xArr + 1][yArr + 1][zArr] = this._largeCube;   //front bottom right

        objectArray[xArr][yArr][zArr + 1] = this._largeCube;           //back top left
        objectArray[xArr + 1][yArr][zArr + 1] = this._largeCube;       //back top right
        objectArray[xArr][yArr + 1][zArr + 1] = this._largeCube;       //back bottom left
        objectArray[xArr + 1][yArr + 1][zArr + 1] = this._largeCube;   //back bottom right
    }

    removeObject(objectArray : Array<any>) {
        //coordinates of piece on grid (x, y, z)
        let xPos : number = this._largeCube.position.x;
        let yPos : number = this._largeCube.position.y;
        let zPos : number = this._largeCube.position.z;

        if (offsetW) {
            xPos -= 0.5;
            zPos -= 0.5;
        }
        if(offsetH) {
            yPos += 0.5;
        }    

        let xArr : number = gridToArray("X", xPos);
        let yArr : number = gridToArray("Y", yPos);
        let zArr : number = gridToArray("Z", zPos);
    
        //sets spot in array (top left corner of block) to true
        objectArray[xArr][yArr][zArr] = null;           //front top left
        objectArray[xArr + 1][yArr][zArr] = null;       //front top right
        objectArray[xArr][yArr + 1][zArr] = null;       //front bottom left
        objectArray[xArr + 1][yArr + 1][zArr] = null;   //front bottom right

        objectArray[xArr][yArr][zArr + 1] = null;           //back top left
        objectArray[xArr + 1][yArr][zArr + 1] = null;       //back top right
        objectArray[xArr][yArr + 1][zArr + 1] = null;       //back bottom left
        objectArray[xArr + 1][yArr + 1][zArr + 1] = null;   //back bottom right
    }
 }