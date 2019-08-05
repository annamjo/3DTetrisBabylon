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

    constructor(name : string, isActive : boolean, offset : boolean) {
        super(name, isActive, offset); 

        //setting starting positions
        this._xStartPosition = 0.5 - this._shift;
        this._yStartPosition = 1;
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
}

