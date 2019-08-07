/*
 *  Subclass of Piece for mini "L"
 *  MiniLs are green and shaped like a little L
 *  TO-DO: Block can move half-way into the wall
 */

class MiniL extends Piece {
    //declaring properties for starting position of block, all blocks will fall from the same spot
    private _startingPosition;      //TO-DO: require type for array
    private _startingRotation : number;     //sets L upright
    private _depth : number;
    private flipCounter : number;

    //properties specific to miniL
    private _color : string;     //small cubes will always be color: red
    private _miniL;     //holds physical block
    private _miniLMaterial;     //stores material

    constructor(name : string, isActive : boolean, offsetW : boolean, offsetH : boolean, ground : any) {
        super(name, isActive, offsetW, offsetH, ground);

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
        this.flipCounter = 0; 

        //properties specific to MiniL
        this._color = "green";
        this._depth = 1;

        //creating physical piece, MiniL
        //need BABYLON.Mesh.DOUBLESIDE to have solid block
        this._miniL = BABYLON.MeshBuilder.CreatePolygon("miniL", {shape: this._startingPosition, depth: this._depth, updatable: true, sideOrientation: BABYLON.Mesh.DOUBLESIDE}, scene);
        this._miniL.position.z -=  this._shift;
        if(offsetH) {
            this._miniL.position.y -= this._shift;
        }

        //sets L upright
        this._startingRotation = (3*Math.PI)/2;
        this._miniL.rotation.x = this._startingRotation;

        //adding green to material of box
        this._miniLMaterial = new BABYLON.StandardMaterial("miniLMat", scene);
        this._miniLMaterial.diffuseColor = new BABYLON.Color3(0, 1, 0);     //r: 0, g: 1, b: 0
        //this._miniLMaterial.wireframe = true;
        this._miniL.material = this._miniLMaterial;

    }

    //accesor
    get piece() {
        return this._miniL;
    }

    /*
     *  Instead of allowing users to rotate by axes, we have defined set rotations that the block can 
     *  cycle through. For MiniL, there are four rotations for the protruding cube: right, back, left,
     *  and front. Since the protruding cube can be on top or bottom, there are 8 total unique
     *  rotations.
     * 
     *  Protruding cube cases:
     *      0.) lower -- L shaped
     *      1.) higher -- upside L
     * 
     *  All rotations and translations are done based on the local axes to simplify the code. Essentially,
     *  the shifts (to stay locked into the grid) are all the same because it depends on the rotation of the
     *  piece as opposed to its relative position to the world axes.
     * 
     *  I don't really understand the vectors as they don't coordinate to (x, y, z), but they work so...
     */
    rotate(mesh : any) {
        if (this.flipCounter === 0) {       //L shaped
            mesh.rotation.y -= this._rotation;
            mesh.locallyTranslate(new BABYLON.Vector3(this._shift, this._shift, 0));
        } else {        //upside down L
            mesh.rotation.y -= this._rotation;
            mesh.locallyTranslate(new BABYLON.Vector3(-this._shift, this._shift, 0));
        }
    }

    flip(mesh : any) {
        //case 0: protruding cube is lower --> flips down
        if (this.flipCounter === 0) {
            mesh.rotation.x += Math.PI;
            mesh.locallyTranslate(new BABYLON.Vector3(0, 1, -1));
            
            this.flipCounter = 1;
        
        //case 1: protruding cube is higher --> flips up
        } else {
            mesh.rotation.x -= Math.PI;
            mesh.locallyTranslate(new BABYLON.Vector3(0, 1, -1));

            this.flipCounter = 0;
        }
    }
}