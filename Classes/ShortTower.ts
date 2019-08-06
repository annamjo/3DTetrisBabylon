/*
 *  Subclass for 1 by 3 shorter tower
 *  TO-DO: When rotating tower and grid is odd, block is no longer locked to grid. The y-position is +0.5
 */

 class ShortTower extends Piece {
    //properties for starting position of block, all blocks will fall from the same spot
    private _xStartPosition : number;
    private _zStartPosition : number;
    private _yStartPosition : number;

    //based on starting position
    private _width : number;    //width of 1
    private _height : number;   //height of 3
    private _length : number;   //length of 1

    private _color : string;     //ShortTower will always be color: blue
    private _shortTower;    //will store physical piece
    private _shortTowerMaterial;    //will store color

    constructor(name : string, isActive : boolean, offsetW : boolean, offsetH : boolean, ground : any) {
        super(name, isActive, offsetW, offsetH, ground);

        //setting starting positions
        this._xStartPosition = 0.5 - this._shift;
        this._yStartPosition = 1;
        if(offsetH) {
            this._yStartPosition -= this._shift;
        }
        this._zStartPosition = 0.5 - this._shift;

        //properties specific to ShortTower
        this._width = 1;
        this._height = 2;
        this._length = 1;
        this._color = "blue";

        //creating physical short tower
        this._shortTower = BABYLON.MeshBuilder.CreateBox("shortTower", {width: this._width, height: this._height, depth: this._length}, scene);

        //setting start position
        this._shortTower.position.x = this._xStartPosition;
        this._shortTower.position.y = this._yStartPosition;
        this._shortTower.position.z = this._zStartPosition;

        //setting color to blue
        this._shortTowerMaterial = new BABYLON.StandardMaterial('smallCubeMat', scene);
        this._shortTowerMaterial.diffuseColor = new BABYLON.Color3(0, 0, 1);
        //this._shortTowerMaterial.wireframe = true;
        
        //ugly grid on block
            // this._shortTowerMaterial = new BABYLON.GridMaterial("shortTowerGrid", scene);
            // this._shortTowerMaterial.lineColor = BABYLON.Color3.White();
            // this._shortTowerMaterial.mainColor = BABYLON.Color3.Blue();
        //TO-DO: Create material for prettier grid

        this._shortTower.material = this._shortTowerMaterial;
    }
    
    get piece() {
        return this._shortTower;
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

    /*
     *  this.blockRotationZ is a counter that keeps track of ShortTower's rotation on the z-axis.
     *  For short tower, the two different z-rotations are PI/2 and 0 (upright and sideways)
     * 
     *  Everytime the block rotates, we must shift the piece by 0.5 (half-step), so that it stays
     *  locked within the grid.
     * 
     *  This function must be implemented in each subclass. Notice that every time it rotates, the 
     *  shifts cancel each other (+0.5 and -0.5).
     * 
     *  The functions all work in the same way for this block, just acting on different axes.
     */
    rotateMoveZ() { 
        if(this.blockRotationZ === this._rotation) {     //if the counter is equal to Math.PI/2, then...
            this._shortTower.position.y -= this._shift;     //...shift the piece down half a step
            this._shortTower.position.x -= this._shift;     //AND to the left half a step
            this.blockRotationZ = 0;     //reset the counter back to 0 because this block only has 2 rotations
        } else {    //if the counter is 0, then...
            this._shortTower.position.y += this._shift;     //...shift the piece up half a step
            this._shortTower.position.x += this._shift;     //AND to the right half a step
            this.blockRotationZ += this._rotation;       //add Math.PI/2 to counter
        }
    }

    rotateMoveX() {
        if(this.blockRotationX === this._rotation) {     //if the counter is equal to Math.PI/2, then...
            this._shortTower.position.y -= this._shift;     //...shift the piece down half a step
            this._shortTower.position.z -= this._shift;     //AND back half a step
            this.blockRotationX = 0;     //reset the counter back to 0 because this block only has 2 rotations
        } else {    //if the counter is 0, then...
            this._shortTower.position.y += this._shift;     //...shift the piece up half a step
            this._shortTower.position.z += this._shift;     //AND forward half a step
            this.blockRotationX += this._rotation;       //add Math.PI/2 to counter
        }
    }

    rotateMoveY() {

    }
}

