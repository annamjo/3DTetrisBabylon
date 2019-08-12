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

    private _largeCube : BABYLON.Mesh;     //holds physical block
    private _largeCubeMaterial;
    private _startingPosition : any[];
    private _depth : number; 
    private _largeCubeData : boolean[];

    //constructor calls Parent class Piece
    constructor(name : string, isActive : boolean, offsetW : boolean, offsetH : boolean, ground : any) {
        super(name, isActive, offsetW, offsetH, ground);

        this._xStartPosition = 0;
        this._yStartPosition = 2;
        this._zStartPosition = 0;
        if(offsetH) {
            this._yStartPosition -= this._shift;
        }
        if(offsetW) {
            this._xStartPosition -= this._shift;
            this._zStartPosition -= this._shift;
        }

        //properties specific to LargeCube
        this._size = 2;
        this._color = "green";

        //X0Y
        this._startingPosition = [
            new BABYLON.Vector3(0, 0, 0),  //botton left corner
            new BABYLON.Vector3(0, 0, 2),  //top left corner
            new BABYLON.Vector3(2, 0, 2),  //high right corner
            new BABYLON.Vector3(2, 0, 0)   //bottom right corner
        ];
        this._depth = 2;

        //creating physical box
        this._largeCube = BABYLON.MeshBuilder.CreatePolygon("largeCube", {
            shape: this._startingPosition, 
            depth: this._depth, 
            updatable: true, 
            sideOrientation: BABYLON.Mesh.DOUBLESIDE
        }, scene);

        //setting start position
        this._largeCube.position.x = this._xStartPosition;
        this._largeCube.position.y = this._yStartPosition;
        this._largeCube.position.z = this._zStartPosition;

        //adding color
        this._largeCubeMaterial = new BABYLON.StandardMaterial("largeCubeMat", scene);
        this._largeCubeMaterial.diffuseColor = new BABYLON.Color3(0, 1, 0);
        this._largeCube.material = this._largeCubeMaterial;

        this._largeCubeData = generateArray(width, height);

    }

    //accessor for getting physical box; needed for getting properties
    get piece() {
        return this._largeCube;
    }

    placeBlock() {
        //coordinates of piece on grid (x, y, z)
        let xPos : number = this._largeCube.position.x;
        let yPos : number = this._largeCube.position.y;
        let zPos : number = this._largeCube.position.z;;

        if (offsetW) {
            xPos += 0.5;
            zPos += 0.5;
        }
        if(offsetH) {
            yPos -= 0.5;
        }
        console.log("Original coordinates = x: " + xPos + " y: " + yPos + " z: " + zPos);

        let xArr : number = gridToArray("X", xPos);
        let yArr : number = gridToArray("Y", yPos);
        let zArr : number = gridToArray("Z", zPos);
    
        console.log("Index of Array = x: " + xArr + " y: " + yArr + " z: " + zArr);
        //sets spot in array (top right corner of block) to true
        this._largeCubeData[xArr][yArr][zArr] = true;           //front top left
        this._largeCubeData[xArr + 1][yArr][zArr] = true;       //front top right
        this._largeCubeData[xArr][yArr + 1][zArr] = true;       //front bottom left
        this._largeCubeData[xArr + 1][yArr + 1][zArr] = true;   //front bottom right

        this._largeCubeData[xArr][yArr][zArr + 1] = true;           //back top left
        this._largeCubeData[xArr + 1][yArr][zArr + 1] = true;       //back top right
        this._largeCubeData[xArr][yArr + 1][zArr + 1] = true;       //back bottom left
        this._largeCubeData[xArr + 1][yArr + 1][zArr + 1] = true;   //back bottom right
        console.log(this._largeCubeData);
    }

    mergeArrays() {
        for(let i = 0; i < gridData.length; i++) {     //loop for x
            for(let j = 0; j < gridData[i].length; j++) {      //loop for y
                for(let k = 0; k < gridData[i][j].length; k++) {       //loop for z
                    //if spot on grid is empty but spot on piece is occupied (block is there)...
                    if(gridData[i][j][k] === false && this._largeCubeData[i][j][k] === true) {
                        gridData[i][j][k] = true;   //set grid spot to true
                    } 
                }
            }
        }
    }

    meshCollisionCheck(xPos : number, yPos :  number, zPos : number, grid : boolean[]) {
        //coodinates of piece in array [x][y][z]
        let xArr : number = gridToArray("X", xPos);
        let yArr : number = gridToArray("Y", yPos);
        let zArr : number = gridToArray("Z", zPos);

        if(grid[xArr][yArr][zArr] === false) {      //if spot on grid is empty, return true (mesh can move there)
            return true;
        }

        return false;
    }

    rotate(mesh : any) {
        //do nothing because symmetrical
    }

    flip(mesh : any) {
        //do nothing because symmetrical
    }

 }