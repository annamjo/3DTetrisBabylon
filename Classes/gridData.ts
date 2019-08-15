/*
 *  The grid data is separate from the 3D aspect of the game. This would be considered the backend of the
 *  game. This file will house a 3D array that stores boolean values of whether the index has an object or
 *  does not have an object.
 * 
 *  In order for this to work, what do we need to happen?
 *  The board needs to have a 3D array that keeps track of all pieces on the board. DONE
 *  Each individual piece needs to have a 3D array that stores the location of the piece. DONE
 *  Before the block moves, we need to check if the move is possible. DONE
 *  The piece array should update meaning the new spot is true and the old spot if false. 
 *  The piece array and grid array should merge. 
 */

//generates 3d array, size: width x height x width; boolean values are defaulted to false (empty)
function generateArray(width : number, height : number) { 
    let array = new Array(width);
    for(let x = 0; x < array.length; x++) {     //loop for x
        array[x] = new Array(height);       //2d array
        for(let y = 0; y < array[x].length; y++) {      //loop for y
            array[x][y] = new Array (width);     //3d array
            for(let z = 0; z < array[x][y].length; z++) {       //loop for z
                array[x][y][z] = false;
            }
        }
    }
    return array;
}

function generateArrayCollisions(width : number, height : number) {
    //+2 bc adding border around
    let w = width + 2;
    let h = height + 2; 

    let array = new Array(w);
    for(let x = 0; x < array.length; x++) {     //loop for x
        array[x] = new Array(h);       //2d array
        for(let y = 0; y < array[x].length; y++) {      //loop for y
            array[x][y] = new Array (w);     //3d array
            for(let z = 0; z < array[x][y].length; z++) {       //loop for z
                if(x === 0 || x === w - 1 || y === h - 1 || z === 0 || z === w - 1) {  
                    array[x][y][z] = true;  
                } else {
                    array[x][y][z] = false;
                }
            }
        }
    }
    return array;
}

function generateObjectArray(width : number, height : number) {
    let array = new Array(width);
    for(let x = 0; x < array.length; x++) {     //loop for x
        array[x] = new Array(height);       //2d array
        for(let y = 0; y < array[x].length; y++) {      //loop for y
            array[x][y] = new Array (width);     //3d array
            for(let z = 0; z < array[x][y].length; z++) {       //loop for z
                array[x][y][z] = null;
            }
        }
    }
    return array;
}

//TO-DO: won't work on other blocks besides SmallCube
//find location of block and place it into grid
function placeBlock(mesh : any, array : any[]) {    
    //coordinates of piece on grid (x, y, z)
    let xPos : number = mesh.position.x;
    let yPos : number = mesh.position.y;
    let zPos : number = mesh.position.z;
    // console.log("x: " + xPos + " y: " + yPos + " z: " + zPos);

    //coodinates of piece in array [x][y][z]
    let xArr : number = gridToArray("X", xPos);
    let yArr : number = gridToArray("Y", yPos);
    let zArr : number = gridToArray("Z", zPos);

    // console.log("x: " + xArr + " y: " + yArr + " z: " + zArr);
    //sets spot in array to true because that's the spot in the grid that the cube occupies
    array[xArr][yArr][zArr] = true;
}

//opposite of placeBlock(); sets position to false
function removeBlock(mesh : any, grid : boolean[], piece : boolean[]) {
    //coordinates of piece on grid (x, y, z)
    let xPos : number = mesh.position.x;
    let yPos : number = mesh.position.y;
    let zPos : number = mesh.position.z;

    //coodinates of piece in array [x][y][z]
    let xArr : number = gridToArray("X", xPos);
    let yArr : number = gridToArray("Y", yPos);
    let zArr : number = gridToArray("Z", zPos);

    grid[xArr][yArr][zArr] = false;
    piece[xArr][yArr][zArr] = false;
}

//function that convert point in grid (x, y, z) to point in array [x][y][z]
function gridToArray(coord : string, point : number) {
    //for gridArrayCollisions
    let w = width + 2;
    let h = height + 2;

    switch (coord.toUpperCase()) {
        case "X":
            return point + ((w - 1)/2);           //x + width/2
            break;
        case "Y":
            return (point - (h - 1)/2) * -1;    //-(y-(width/2))
            break;
        case "Z":   
            return point + ((w - 1)/2);           //z + width/2
            break;
    }
}

function meshCollisionCheck(xPos : number, yPos :  number, zPos : number, grid : boolean[]) {
    //coodinates of piece in array [x][y][z]
    let xArr : number = gridToArray("X", xPos);
    let yArr : number = gridToArray("Y", yPos);
    let zArr : number = gridToArray("Z", zPos);

    if(grid[xArr][yArr][zArr] === false) {      //if spot on grid is empty, return true (mesh can move there)
        return true;
    }

    return false;
}

/*
 *  Basic functionality:
 *  - Compare each element in grid array to each element in piece array
 *  - Overlay piece array to grid array; combine
 *  - If true && true of both grids, block can't move there
 */
function mergeArrays(grid : Array<any>, piece : Array<any>) {
    // console.log("grid array");
    // console.log(grid);
    // console.log("piece array");
    // console.log(piece);
    // console.log();
    for(let x = 0; x < grid.length; x++) {     //loop for x
        for(let y = 0; y < grid[x].length; y++) {      //loop for y
            for(let z = 0; z < grid[x][y].length; z++) {       //loop for z
                //if spot on grid is empty but spot on piece is occupied (block is there)...
                if(grid[x][y][z] === false && piece[x][y][z] === true) {
                    grid[x][y][z] = true;   //set grid spot to true
                } 
            }
        }
    }
}

function checkLayer(layer : number, grid : Array<any>) {
    let tracker = true;     //any discrepancies on the level at all will set tracker to false; layer is not full

    for(let x = 0; x < width; x++) {
        for(let z = 0; z < width; z++) {
            if(grid[x][layer][z] === false) {
                tracker = false;
            }
        }
    }
    
    return tracker;
}

function clearLayer(y : number) {
    for(let x = 0; x < width; x++) {
        for(let z = 0; z < width; z++) {
            //TO-DO: Could figure out how to delete blocks...
            blockAt(x, y, z, objectData).isVisible = false;     //makes object invisible
            gridData[x][y][z] = false;      //sets spot as empty
        }
    }
}

//get the object in that position
function blockAt(x : number, y : number, z : number, objectArray : Array<any>) {
    let mesh = objectArray[x][y][z];
    return mesh;
}

//place object in object array
function placeObject(mesh : BABYLON.Mesh, array : Array<any>) {
    let xPos : number = mesh.position.x;
    let yPos : number = mesh.position.y;
    let zPos : number = mesh.position.z;

    //coodinates of piece in array [x][y][z]
    let xArr : number = gridToArray("X", xPos);
    let yArr : number = gridToArray("Y", yPos);
    let zArr : number = gridToArray("Z", zPos);

    //sets spot in array to true because that's the spot in the grid that the cube occupies
    array[xArr][yArr][zArr] = mesh;
}

//remove object in object array
function removeObject(mesh : BABYLON.Mesh, array : Array<any>) {
    let xPos : number = mesh.position.x;
    let yPos : number = mesh.position.y;
    let zPos : number = mesh.position.z;

    //coodinates of piece in array [x][y][z]
    let xArr : number = gridToArray("X", xPos);
    let yArr : number = gridToArray("Y", yPos);
    let zArr : number = gridToArray("Z", zPos);

    //sets spot in array to null because that's the spot in the grid that the cube occupies
    array[xArr][yArr][zArr] = null;
}