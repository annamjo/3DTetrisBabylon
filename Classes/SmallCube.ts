/*
 *  Subclass for 1 by 1 cube
 */

class SmallCube extends Piece {
    //properties for starting position of block, all blocks will fall from the same spot
    private _xStartPosition : number;
    private _zStartPosition : number;
    private _yStartPosition : number;
    private _size : number;      //small cubes will always be size: 1
    private _color : string;     //small cubes will always be color: red
    private _smallCube;     //holds physical block
    private _smallCubeMaterial;

    //constructor calls parent class Piece
    constructor(name : string, isActive : boolean, offsetW : boolean, offsetH : boolean, ground : any) {
        super(name, isActive, offsetW, offsetH, ground);

        //setting starting positions
        this._xStartPosition = -0.5 + this._shift;
        this._yStartPosition = 0.5;
        if(offsetH) {
            this._yStartPosition -= this._shift;
        }
        this._zStartPosition = 0.5 - this._shift;
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
}