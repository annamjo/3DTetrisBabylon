/*
 *  Superclass for all game pieces; has movement and rotate functions
 *  TO-DO: Figure out how to import and export
 */

class Piece {
    //declaring properties
    private _name : string;
    public _isActive : boolean;      //state to keep track of selected blocks
    private _offsetW : boolean;
    private _offsetH : boolean;
    public _shift : number = 0;
    public _ground: any;

    //When intance of piece is created, requires name and isActive boolean
    constructor(name : string, isActive : boolean, offsetW : boolean, offsetH : boolean, ground : any) {
        this._name = name; 
        this._isActive = isActive;
        this._offsetW = offsetW;
        this._offsetH = offsetH;
        this._ground = ground;
        if(this._offsetW || this._offsetH) {
            this._shift = 0.5;
        }
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

    movement(mesh : any) {
        var movement : number = 1;
        var rotation : number = Math.PI/2;
        var collided : boolean = false;
        var colpt;

        mesh.checkCollisions = true;
        // mesh.ellipsoid = new BABYLON.Vector3(0.5, 0.5, 0.5);
        // mesh.ellipsoidOffset = new BABYLON.Vector3(0, 0, 0);
        mesh.computeWorldMatrix(true); //update world matrix before every frame; must have for registerBeforeRender

        /***** Anna's Code for Collisions with Ground and Sides of Gameboard *****/
        scene.registerAfterRender(() => {
            if (mesh.intersectsMesh(this._ground, false)) { //box collision
                mesh.emissiveColor = new BABYLON.Color3(0.5, 0, 0);
                //get position block collides at:
                if (!collided) {
                    colpt = mesh.position;
                    collided = true;
                }
            } else {
                mesh.emissiveColor = new BABYLON.Color3(1, 1, 1);
            }
        });


        scene.onKeyboardObservable.add( (kbInfo) => {
            if (collided) {
                colpt = mesh.position;
            } else {
                switch(kbInfo.type) {   //keyboard info
                    case BABYLON.KeyboardEventTypes.KEYDOWN:    //if key is down
                            switch (kbInfo.event.key) {     //is key = to...
                                case "w":
                                case "W":
                                    // mesh.position.z += movement;
                                    mesh.moveWithCollisions(new BABYLON.Vector3(0, 0, 1));    //resets moveWithCollisions
                                    break;
                                case "s":
                                case "S":
                                    //mesh.position.z -= movement;
                                    mesh.moveWithCollisions(new BABYLON.Vector3(0, 0, -1));
                                    break;
                                case "a":
                                case "A":
                                    // mesh.position.x -= movement;
                                    mesh.moveWithCollisions(new BABYLON.Vector3(-1, 0, 0));
                                    break;
                                case "d":
                                case "D":
                                    // mesh.position.x += movement;
                                    mesh.moveWithCollisions(new BABYLON.Vector3(1, 0, 0));
                                    break;
                                case " ":
                                    mesh.position.y -= movement;
                                    break;
                                /** Rotations are about world axes as opposed to local axes; will always rotate the same way **/
                                //TO-DO: Rotations of odd grid make it so that some blocks aren't locked to grid anymore; see TO-DO in specific classes
                                case "r":
                                case "R" :
                                    mesh.rotate(BABYLON.Axis.Z, rotation, BABYLON.Space.WORLD);
                                    break;
                                case "e":
                                case "E":
                                    mesh.rotate(BABYLON.Axis.X, rotation, BABYLON.Space.WORLD);
                                    break;
                                case "y":
                                case "Y":
                                    mesh.rotate(BABYLON.Axis.Y, rotation, BABYLON.Space.WORLD);
                                    break;
                            }   //switch
                    break;  //case  
                }  //switch          
            }   //if-else
        }); //scene
    }   //movement()
}   //class