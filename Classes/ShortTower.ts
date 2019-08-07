/*
 *  Subclass for 1 by 3 shorter tower
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

    //properties unique to ShortTower
    private _color : string;        //ShortTower will always be color: blue
    private _shortTower;        //will store physical piece
    private _shortTowerMaterial;        //will store color : blue

    constructor(name : string, isActive : boolean, offsetW : boolean, offsetH : boolean, ground : any) {
        super(name, isActive, offsetW, offsetH, ground);

        //setting starting positions
        this._xStartPosition = 0.5;
        this._yStartPosition = 1;
        this._zStartPosition = 0.5;
        if(offsetW) {
            this._xStartPosition -= this._shift;
            this._zStartPosition -= this._shift;
        }
        if(offsetH) {
            this._yStartPosition -= this._shift;
        }
        this.rotationCounter = 0;

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
     *  Instead of allowing users to rotate by axes, we have defined set rotations that the block can 
     *  cycle through. For ShortTower, there are three unique rotations: upright, sideways, and laid-down.
     *     
     *  View if looking straight on (x, y)
     *      0.) upright: (1, 2)
     *      1.) sideways: (2, 1)
     *      2.) laid-down: (1, 1)
     * 
     *  What's Happening?
     *      Essentially, the piece is starting in case 0 (upright). The first time we rotate, we will increment
     *      the rotationCounter by 1 so that it rotates to case 1 (sideways). The shifts on the x and y 
     *      positions account for any discrepancies where the block is between squares of the grid. The next
     *      time the piece is rotated, rotationCounter is incremented taking us to case 2 (laid-down), once
     *      again accounting for the shift. Here, we set rotationCounter to -1 because we want the next case to
     *      be case 0. -1 is incremented to 0, allowing us to enter case 0 (upright). There, we just undo the
     *      previous rotations and shifts.
     */
    rotate(mesh : any) {
        this.rotationCounter++;     //increment at start because rotationCounter is initialized to 0 (case 0)

        //upright rotation (case 0)
        if(this.rotationCounter === 0) {
            //essentially undoing the previous two rotations
            mesh.rotate(BABYLON.Axis.Y, -this._rotation, BABYLON.Space.WORLD);
            mesh.rotate(BABYLON.Axis.Z, -this._rotation, BABYLON.Space.WORLD);
            mesh.position.z += this._shift;
            mesh.position.y -= this._shift;
        
        //sideways rotation (case 1)
        } else if (this.rotationCounter === 1) {
            mesh.rotate(BABYLON.Axis.Z, this._rotation, BABYLON.Space.WORLD);
            mesh.position.y += this._shift;     //Shift the piece up half a step
            mesh.position.x += this._shift;     //AND to the right half a step
        
        //laid-down rotation (case 2)
        } else {
            mesh.rotate(BABYLON.Axis.Y, this._rotation, BABYLON.Space.WORLD);
            mesh.position.x -= this._shift;     //Shift the piece to the left half a step
            mesh.position.z -= this._shift;

            this.rotationCounter = -1;      //set to -1 because will get incremented
        } 
    }

    flip (mesh : any) {
        //Code does nothing; just need to have because Piece movement() calls this function for ALL subclasses
    }
}

