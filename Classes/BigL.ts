/*
 *  Subclass of Piece for BigL
 *  Taller versions of MiniL
 *  BigLs are purple
 */

 class BigL extends Piece {
    //declaring properties for starting position of block
    private _startingPosition;     //TO-DO: Will store array of vectors
    private _startingRotation : number;     //setting BigL upright
    private _depth : number; 
    private _color : string;    //BigLs will be purple
    
    private _bigL;      //will store physical piece
    private _bigLMaterial;      //will store material (color)

    constructor(name : string, isActive : boolean) {
        super(name, isActive);

        //setting starting position
        this._startingPosition = [
            new BABYLON.Vector3(0, 0, 0),  //botton left corner
            new BABYLON.Vector3(0, 0, 3),  //top left corner
            new BABYLON.Vector3(1, 0, 3),  //high right corner
            new BABYLON.Vector3(1, 0, 1),  //midpoint
            new BABYLON.Vector3(2, 0, 1),  //low right corner
            new BABYLON.Vector3(2, 0, 0)   //bottom right corner
        ];

        //properties specific to BigL
        this._color = "purple";
        this._depth = 1;

        //creating physical block; note, need sideOridentation for "solid" block
        this._bigL = BABYLON.MeshBuilder.CreatePolygon("bigL", {shape: this._startingPosition, depth: this._depth, updatable: true, sideOrientation: BABYLON.Mesh.DOUBLESIDE}, scene);
    
        //sets L upright
        this._startingRotation = (3*Math.PI)/2;
        this._bigL.rotation.x = this._startingRotation;

        //adding color purple to block material
        this._bigLMaterial = new BABYLON.StandardMaterial("bigLMat", scene);
        this._bigLMaterial.diffuseColor = new BABYLON.Color3(0.5, 0, 0.5);      //r: 0.5, g: 0, b: 0.5
        this._bigL.material = this._bigLMaterial;
    }

    //accessor
    get piece() {
        return this._bigL;
    }
 }