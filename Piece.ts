/*
 *  Superclass for all game pieces; has movement and rotate functions
 */

class Piece {
    //declaring properties
    private _name : string;
    public _isActive : boolean;      //state to keep track of selected blocks
        //static _isActive: boolean;      //static? idk man

    //When intance of piece is created, requires name and isActive boolean
    constructor(name : string, isActive : boolean) {
        this._name = name; 
        this._isActive = isActive;
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

        console.log("Inside static Piece movement function");

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
                            case "r":
                            case "R" :
                                mesh.rotation.z += rotation;    //rotation on z-axis, add Math.PI/2 each time   
                                break;
                        }
                    break;
                }
        });
    }
}