/*
 *  Subclass for large, 2 by 2 cube
 *  Block can move halfway into the wall
 */

 class LargeCube extends Piece {
    //properties for starting position of block, all blocks will fall from the same spot
    private _xStartPosition : number;
    private _zStartPosition : number;
    private _yStartPosition : number;
    private _size : number;      //small cubes will always be size: 1
    private _color : string;     //small cubes will always be color: red

    private _largeCube;     //holds physical block
    private _largeCubeMaterial;

    //constructor calls Parent class Piece
    constructor(name : string, isActive : boolean, offsetW : boolean, offsetH : boolean, ground : any) {
        super(name, isActive, offsetW, offsetH, ground);

        this._xStartPosition = 0;
        this._yStartPosition = 1;
        this._zStartPosition = 0;
        if(offsetH) {
            this._yStartPosition += this._shift;
        }
        if(offsetW) {
            this._xStartPosition += this._shift;
            this._zStartPosition += this._shift;
        }
        //properties specific to LargeCube
        this._size = 2;
        this._color = "green";

        //creating physical box
        this._largeCube = BABYLON.MeshBuilder.CreateBox("largeCube", {size : 2});

        //setting start position
        this._largeCube.position.x = this._xStartPosition;
        this._largeCube.position.y = this._yStartPosition;
        this._largeCube.position.z = this._zStartPosition;
        console.log("setting position");

        //adding color
        this._largeCubeMaterial = new BABYLON.StandardMaterial("largeCubeMat", scene);
        this._largeCubeMaterial.diffuseColor = new BABYLON.Color3(0, 1, 0);
        this._largeCube.material = this._largeCubeMaterial;
    }

    //accessor for getting physical box; needed for getting properties
    get piece() {
        return this._largeCube;
    }

    rotate(mesh : any) {
        //do nothing because symmetrical
    }

    flip(mesh : any) {
        //do nothing because symmetrical
    }

 }