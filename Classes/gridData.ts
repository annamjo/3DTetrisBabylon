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
    for(let i = 0; i < array.length; i++) {     //loop for x
        array[i] = new Array(height);       //2d array
        for(let j = 0; j < array[i].length; j++) {      //loop for y
            array[i][j] = new Array (width);     //3d array
            for(let k = 0; k < array[i][j].length; k++) {       //loop for z
                array[i][j][k] = false;
            }
        }
    }
    return array;
}

//TO-DO: won't work on other blocks besides SmallCube
//find location of block and place it into grid
function placeBlock(mesh : any, array : boolean[]) {    
    //coordinates of piece on grid (x, y, z)
    let xPos : number = mesh.position.x;
    let yPos : number = mesh.position.y;
    let zPos : number = mesh.position.z;

    //coodinates of piece in array [x][y][z]
    let xArr : number = gridToArray("X", xPos);
    let yArr : number = gridToArray("Y", yPos);
    let zArr : number = gridToArray("Z", zPos);

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
    switch (coord.toUpperCase()) {
        case "X":
            return point + 1;            //x + 1
            break;
        case "Y":
            return (point - 1) * -1;    //-(y-1)
            break;
        case "Z":
            return point + 1;           //z - 1
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
    for(let i = 0; i < grid.length; i++) {     //loop for x
        for(let j = 0; j < grid[i].length; j++) {      //loop for y
            for(let k = 0; k < grid[i][j].length; k++) {       //loop for z
                //if spot on grid is empty but spot on piece is occupied (block is there)...
                if(grid[i][j][k] === false && piece[i][j][k] === true) {
                    grid[i][j][k] = true;   //set grid spot to true
                } 
            }
        }
    }
}

function booleanSwitch (grid : Array<any>) {

}