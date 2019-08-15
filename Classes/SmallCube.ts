/*
 *  Subclass for 1 by 1 cube
 */

class SmallCube extends Piece {
    //properties for starting position of block
    private _xStartPosition : number;
    private _zStartPosition : number;
    private _yStartPosition : number;

    //properties unique to SmallCube
    private _size : number;      //SmallCubes will always be size: 1
    private _color : string;     //SmallCubes will always be color: red
    private _smallCube;     //holds physical block
    private _smallCubeMaterial;
    
    //property of single instance
    public pieceGrid : Array<Boolean>;       //will store location of block in 3D arraya

    //constructor calls parent class Piece
    constructor(name : string, isActive : boolean, offsetW : boolean, offsetH : boolean, ground : any) {
        super(name, isActive, offsetW, offsetH, ground);

        //setting starting positions
        this._xStartPosition = -0.5;
        this._yStartPosition = 0.5;
        this._zStartPosition = 0.5;
        if (offsetW) {
            this._xStartPosition += this._shift;
            this._zStartPosition -= this._shift;
        }
        if(offsetH) {
            this._yStartPosition -= this._shift;
        }

        //properties specific to SmallCube
        this._size = 1;
        this._color = "red"; 

        //creating physical box
        this._smallCube = BABYLON.MeshBuilder.CreateBox("smallCube", {size: this._size}, scene);

        //setting starting position based on Piece starting position
        this._smallCube.position.x = this._xStartPosition;
        this._smallCube.position.y = this._yStartPosition;
        this._smallCube.position.z = this._zStartPosition;

        //adding color to box
        this._smallCubeMaterial = new BABYLON.StandardMaterial('smallCubeMat', scene);
        this._smallCubeMaterial.diffuseColor = new BABYLON.Color3(1, 0, 0);     //r: 1, g: 0, b: 0
        this._smallCube.material = this._smallCubeMaterial;

        //accesses global variables of size of grid
        this.pieceGrid = generateArray(width, height);
    }

    //accessor for getting physical box; needed for getting properties
    get piece() {
        return this._smallCube;
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
        //Code does nothing; just need to have because Piece movement() calls this function for ALL subclasses
    }

    unrotate() {
        //do nothing
    }
    
    flip() {
        //Code does nothing; just need to have because Piece movement() calls this function for ALL subclasses
    }
    
    rotFlipCollisionCheck(xPos : number, yPos :  number, zPos : number, grid : boolean[]) {
        //do nothing
    }

    /*** Backend of SmallCube **/
    placeBlock() {
        let xPos : number = this._smallCube.position.x;
        let yPos : number = this._smallCube.position.y;
        let zPos : number = this._smallCube.position.z;

        let xArr : number = gridToArray("X", xPos);
        let yArr : number = gridToArray("Y", yPos);
        let zArr : number = gridToArray("Z", zPos);

        this.pieceData[xArr][yArr][zArr] = true;
    }

    removeBlock() {
        //coordinates of piece on grid (x, y, z)
        let xPos : number = this._smallCube.position.x;
        let yPos : number = this._smallCube.position.y;
        let zPos : number = this._smallCube.position.z;

        //coodinates of piece in array [x][y][z]
        let xArr : number = gridToArray("X", xPos);
        let yArr : number = gridToArray("Y", yPos);
        let zArr : number = gridToArray("Z", zPos);

        gridData[xArr][yArr][zArr] = false;
        this.pieceData[xArr][yArr][zArr] = false;
    }

    meshCollisionCheck(xPos : number, yPos :  number, zPos : number, grid : boolean[], direction? : string) {
        //coodinates of piece in array [x][y][z]
        let xArr : number = gridToArray("X", xPos);
        let yArr : number = gridToArray("Y", yPos);
        let zArr : number = gridToArray("Z", zPos);
    
        if(grid[xArr][yArr][zArr] === false) {      //if spot on grid is empty, return true (mesh can move there)
            return true;
        }
    
        return false;    
    }

    placeObject(objectArray : Array<any>) {
        let xPos : number = this._smallCube.position.x;
        let yPos : number = this._smallCube.position.y;
        let zPos : number = this._smallCube.position.z;
    
        //coodinates of piece in array [x][y][z]
        let xArr : number = gridToArray("X", xPos);
        let yArr : number = gridToArray("Y", yPos);
        let zArr : number = gridToArray("Z", zPos);
    
        //sets spot in array to true because that's the spot in the grid that the cube occupies
        objectArray[xArr][yArr][zArr] = this._smallCube;
    }

    removeObject(objectArray : Array<any>) {
        let xPos : number = this._smallCube.position.x;
        let yPos : number = this._smallCube.position.y;
        let zPos : number = this._smallCube.position.z;
    
        //coodinates of piece in array [x][y][z]
        let xArr : number = gridToArray("X", xPos);
        let yArr : number = gridToArray("Y", yPos);
        let zArr : number = gridToArray("Z", zPos);
    
        //sets spot in array to true because that's the spot in the grid that the cube occupies
        objectArray[xArr][yArr][zArr] = null;
    }
}