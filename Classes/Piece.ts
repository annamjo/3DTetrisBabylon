/*
 *  Superclass for all game pieces; has movement and rotate functions
 */

class Piece {
    //declaring properties
    private _name : string;
    public _isActive : boolean;      //state to keep track of selected blocks
    public _offset : boolean;
    public _shift : number;

    //When intance of piece is created, requires name and isActive boolean
    constructor(name : string, isActive : boolean, offset : boolean) {
        this._name = name; 
        this._isActive = isActive;
        this._offset = offset;
        if(this._offset) {
            this._shift = 0.5;
        } else {
            this._shift = 0;
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

        scene.onKeyboardObservable.add( (kbInfo) => {
            switch(kbInfo.type) {   //keyboard info
                case BABYLON.KeyboardEventTypes.KEYDOWN:    //if key is down
                        switch (kbInfo.event.key) {     //is key = to...
                            case "w":
                            case "W":
                                mesh.position.z += movement;
                                break;
                            case "s":
                            case "S":
                                mesh.position.z -= movement;
                                break;
                            case "a":
                            case "A":
                                mesh.position.x -= movement;
                                break;
                            case "d":
                            case "D":
                                mesh.position.x += movement;
                                break;
                            case " ":
                                mesh.position.y -= movement;
                                break;
                            /** Rotations are about world axes as opposed to local axes; will always rotate the same way **/
                            //TO-DO: Rotations make it so that blocks aren't in squares anymore
                            case "r":
                            case "R" :
                                //mesh.rotation.z += rotation;    //rotation on z-axis, add Math.PI/2 each time   
                                mesh.rotate(BABYLON.Axis.Z, Math.PI / 2, BABYLON.Space.WORLD);
                                break;
                            case "e":
                            case "E":
                                //mesh.rotation.x += rotation;
                                mesh.rotate(BABYLON.Axis.X, Math.PI / 2, BABYLON.Space.WORLD);
                                break;
                            case "y":
                            case "Y":
                                //mesh.rotation.y += rotation;
                                mesh.rotate(BABYLON.Axis.Y, Math.PI / 2, BABYLON.Space.WORLD);
                                break;
                        }
                    break;
                }
        });
    }
}