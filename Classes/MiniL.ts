/*
 *  Subclass of Piece for mini "L"
 *  MiniLs are green and shaped like a little L
 */

class MiniL extends Piece {
    //declaring properties for starting position of block, all blocks will fall from the same spot
    private _startingPosition;      //TO-DO: require type for array
    private _startingRotation : number;     //sets L upright
    private _depth : number;

    private _color : string;     //small cubes will always be color: red
    private _miniL;     //holds physical block
    private _miniLMaterial;     //stores material

    constructor(name : string, isActive : boolean, offset : boolean) {
        super(name, isActive, offset);

        //setting starting positions in XoZ plane; y = 0 ALWAYS
        //coordinates are set as (x, 0, y); no changing z??
        this._startingPosition = [
            new BABYLON.Vector3(0 - this._shift, 0, 0),  //botton left corner
            new BABYLON.Vector3(0 - this._shift, 0, 2),  //top left corner
            new BABYLON.Vector3(1 - this._shift, 0, 2),  //high right corner
            new BABYLON.Vector3(1 - this._shift, 0, 1),  //midpoint
            new BABYLON.Vector3(2 - this._shift, 0, 1),  //mid-right corner
            new BABYLON.Vector3(2 - this._shift, 0, 0)   //bottom right corner
        ];

        //properties specific to MiniL
        this._color = "green";
        this._depth = 1;

        //creating physical piece, MiniL
        //need BABYLON.Mesh.DOUBLESIDE to have solid block
        this._miniL = BABYLON.MeshBuilder.CreatePolygon("miniL", {shape: this._startingPosition, depth: this._depth, updatable: true, sideOrientation: BABYLON.Mesh.DOUBLESIDE}, scene);
        this._miniL.position.z -=  this._shift;

        //sets L upright
        this._startingRotation = (3*Math.PI)/2;
        this._miniL.rotation.x = this._startingRotation;

        //adding green to material of box
        this._miniLMaterial = new BABYLON.StandardMaterial("miniLMat", scene);
        this._miniLMaterial.diffuseColor = new BABYLON.Color3(0, 1, 0);     //r: 0, g: 1, b: 0
        this._miniL.material = this._miniLMaterial;
    }

    //accesor
    get piece() {
        return this._miniL;
    }
}