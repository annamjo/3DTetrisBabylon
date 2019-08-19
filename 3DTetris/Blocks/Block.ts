class Block {
    private _isActive: boolean;
    public positions: BABYLON.Vector3[];
    public parentCube: BABYLON.Mesh;
    public cubes: BABYLON.Mesh[]; //BABYLON.InstancedMesh[]; //child cubes - for uncoupling/recoupling
    public type: string; //type or name of block

    constructor(cubeNum: number) {
        this._isActive = true; //true when block is falling (1st contructed), false when locked in
        //or false if block not in grid (when first being spawned), true if in grid and falling
        this.positions = new Array(cubeNum);
        this.cubes = new Array(cubeNum - 1); //excluding parent cube
    }

    public createCube(ypos: number, xpos:number): BABYLON.Mesh {
        var cube = BABYLON.MeshBuilder.CreateBox("box", {size: 1}, scene); //will scene need to be stored?
        cube.position.y = ypos; //5.5 or 6.5?, or higher, above grid?
        cube.position.x = xpos;
        cube = this.createEdges(cube);

        return cube;
    }

    private createEdges(cube: any): any { //for meshes && instanced meshes
        cube.enableEdgesRendering();
        cube.edgesWidth = 5.0;
        cube.edgesColor = new BABYLON.Color4(0, 0, 0, 1); //black edges
        return cube;
    }

    public get position(): BABYLON.Vector3 { //position of block based on parent block, used for moving
        return this.parentCube.position; //may not be accurate for pivoted blocks - specific to each class?
    }

    public rotate(axis: string): void  { //if hasPivot - rotate around pivot instead (parent sphere)
        var rotation = Math.PI / 2;
        if (this.type !== "big cube") {
            switch(axis) {
                case "x":
                    this.parentCube.rotate(BABYLON.Axis.X, rotation, BABYLON.Space.WORLD);
                    break;
                case "y":
                    this.parentCube.rotate(BABYLON.Axis.Y, -rotation, BABYLON.Space.WORLD);
                    break;
                case "z":
                    this.parentCube.rotate(BABYLON.Axis.Z, -rotation, BABYLON.Space.WORLD);
                    break;
            }
        }      
    }

    public becomeChild(cube: BABYLON.Mesh /*BABYLON.InstancedMesh*/): BABYLON.Mesh /*BABYLON.InstancedMesh*/ {
        //cube = this.parentCube.createInstance("cube");
        cube = this.parentCube.clone();
        cube = this.createEdges(cube);
        // cube.parent = this.parentCube;
        return cube;
    }

    public uncouple(): void { //use for loop? in block class? based on pos.length? use for getpositions
        //remove link between child and parent
        for (var i = 0; i < this.cubes.length; i++) {
            this.cubes[i].setParent(null); // example: this._cube2.setParent(null);
        }
    }

    public recouple(): void { //only use to track positions and active (if inactive doesnt need to recouple)
        //restore link between child and parent
        for (var i = 0; i < this.cubes.length; i++) {
            this.cubes[i].setParent(this.parentCube); //parent back
        }
    }

    // public split(position: BABYLON.Vector3): void { //break apart a single cube from block
    //     //each cube that makes up block will uncouple - setParent(null)
    //     //detatch part of block
    //     //use this.positions
    // }

    // public removePosition() {} //for cascade method?^

    //public removeCube() {}

    public set isActive(state: boolean) {
        this._isActive = state; //used to turn off, set to false
    }
    
    public get isActive(): boolean { //to access and set
        return this._isActive;
    }

    public getPositions() { //will be overrided in sub classes
        return this.positions;
    }
}