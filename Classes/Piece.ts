/*
 *  Superclass for all game pieces; has movement and rotate functions
 *  TO-DO: Figure out how to import and export
 */

class Piece {
    //declaring properties
    private _name : string;
    private _offsetW : boolean;     //false if base is even, true if base is odd
    private _offsetH : boolean;     //false if height is evem, true if base is odd

    public _isActive : boolean;     //state to keep track of selected blocks
    public _ground: any;        //needed to detect collisions

    public _shift : number;     //will store shift needed for differences in odd/even board
    public _rotation : number = Math.PI/2;  //constant rotation

    //When intance of piece is created, requires name and isActive boolean
    constructor(name : string, isActive : boolean, offsetW : boolean, offsetH : boolean, ground : any) {
        this._name = name; 
        this._isActive = isActive;
        this._offsetW = offsetW;
        this._offsetH = offsetH;
        this._ground = ground;
        this._shift = 0.5;
    }

    //accessor for name
    get name() {
        return this._name;
    }

    //accessor for state
    get isActive() {
        return this._isActive;
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

    movement(block : any) {
        //TO-DO: Log spot of piece in 3D array

        var movement : number = 1;
        var collided : boolean = false;
        var colpt;
        var mesh = block.piece;

        mesh.checkCollisions = true;
        mesh.computeWorldMatrix(true); //update world matrix before every frame; must have for registerBeforeRender

        /***** Anna's Code for Collisions with Ground and Sides of Gameboard *****/
        scene.registerAfterRender(() => {
            if (mesh.intersectsMesh(this._ground, true)) {      //if box collides with ground, then...
                if (!collided) {        //set collided to true AND set colpt to where the piece currently is
                    colpt = mesh.position;
                    collided = true;
                }
            }
        });

        scene.onKeyboardObservable.add( (kbInfo) => {
            if (collided) {     //if collided is true (from above code), then...
                mesh.position = colpt;      //set position of block to colpt
            } else {        //allows for block to keep moving when hitting side planes
                switch(kbInfo.type) {   //keyboard info
                    case BABYLON.KeyboardEventTypes.KEYDOWN:    //if key is down, then...
                            switch (kbInfo.event.key) {     //is key = to...
                                case "w":
                                case "W":
                                    mesh.moveWithCollisions(new BABYLON.Vector3(0, 0, 1));    //resets moveWithCollisions
                                    break;
                                case "s":
                                case "S":
                                    mesh.moveWithCollisions(new BABYLON.Vector3(0, 0, -1));
                                    break;
                                case "a":
                                case "A":
                                    mesh.moveWithCollisions(new BABYLON.Vector3(-1, 0, 0));
                                    break;
                                case "d":
                                case "D":
                                    mesh.moveWithCollisions(new BABYLON.Vector3(1, 0, 0));
                                    break;
                                case " ":
                                    mesh.position.y -= movement;
                                    break;
                                /** Set rotations for each unique piece **/
                                case "r":
                                case "R" :
                                    //implemented in each subclass
                                    block.rotate(mesh);     //note: does nothing in SmallCube and LargeCube since symmetrical
                                    break;
                                case "f":
                                case "F":
                                    //implemented in each subclass
                                    block.flip(mesh);       //note that some classes don't have code with it
                                    break;
                            }
                    break;  
                }       
            }
        });
    }
} 