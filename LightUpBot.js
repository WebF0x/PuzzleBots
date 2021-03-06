/*
  LightUp
  =================================
  Goal: 
   - All cells must be lit
  
  Rules:
   - N-numbered walls must touch N light bulbs
   - Light bulbs can only be placed in unlit cells
*/

(function main()
{  
  initCells2DArray();
  initParseHTML();
  
  do
  {
    initCells();
  } while( solve() );
})();

function initParseHTML()
{
  var tableElement = document.getElementById("LightUpTable");
  var tableBody = tableElement.getElementsByTagName("tbody")[0];
  tableRows = tableBody.getElementsByTagName("tr");
}

function initCells2DArray()
{
  DIMENSION = Number(h);
  
  cells = new Array(DIMENSION);
  for(var i=0; i<DIMENSION; i++)
  {
    cells[i] = new Array(DIMENSION);
  }
}

function initCells()
{
  for(var y=0; y<DIMENSION; y++)
  {
    var tableCells = tableRows[y].getElementsByTagName("td");
    
    for(var x=0; x<DIMENSION; x++)
    {
      var imageSourceURL = tableCells[x].firstChild.src;
      var imageBaseName = baseNameFromURL(imageSourceURL);
      cells[x][y] = imageBaseName;
    }
  }
}

function initNonWallCell(x,y)
{
  var cellImageName = "l" + "_" + y + "_" + x;
  var cellImage = document.getElementsByName(cellImageName)[0];
  var imageBaseName = baseNameFromURL(cellImage.src);
  cells[x][y] = imageBaseName;
}
//Solve as much as possible of the lightUp puzzle
//Return true if progress was made
function solve()
{
  return solveNonFreeCells() || solveFreeCells();
}

function solveNonFreeCells()
{
  for(var x=0; x<DIMENSION; x++)
  {
    for(var y=0; y<DIMENSION; y++)
    {
      if(solveNonFreeCell(x,y)) return true;
    }
  }
}

function solveFreeCells()
{
  for(var x=0; x<DIMENSION; x++)
  {
    for(var y=0; y<DIMENSION; y++)
    {
      if(solveFreeCell(x,y)) return true;
    }
  }
}

//Return true is progress was made
function solveNonFreeCell(x,y)
{
  if(!isValid(x,y)) return false;
  
  if( isDarkX(x,y) ) return solveDarkXCell(x,y);
  
  var numberOfAdditionalBulbsRequired = getNumberOfAdditionalBulbsRequired(x,y);
  if( !isNaN(numberOfAdditionalBulbsRequired) ) return solveNumberedCell(x,y,numberOfAdditionalBulbsRequired);
  
  return false;
}

//On dark empty cell at position x,y,
//if placing a bulb would make another cell impossible to solve,
//mark the cell as X
//Return true if progress was made
function ifCannotBeBulbMarkAsX(x,y)
{
  if(!isDarkEmpty(x,y)) return false;
  
  setBulb(x,y);
  initCellsOfSameRowOrColumn(x,y);
  
  if(anotherCellIsUnsolvable(x,y))
  {
    forceSetX(x,y);
    return true;
  }
  else
  {
    setEmpty(x,y);
    initCellsOfSameRowOrColumn(x,y);
    return false;
  }
}

function initCellsOfSameRowOrColumn(x,y)
{
  //Self
  initNonWallCell(x,y);
  
  //Check left
  for(var i=x-1; !isWall(i,y); i--)
  {
    initNonWallCell(i,y);
  }
  
  //Check right
  for(var i=x+1; !isWall(i,y); i++)
  {
    initNonWallCell(i,y);
  }
  
  //Check up
  for(var j=y-1; !isWall(x,j); j--)
  {
    initNonWallCell(x,j);
  }
  
  //Check down
  for(var j=y+1; !isWall(x,j); j++)
  {
    initNonWallCell(x,j);
  }
}

function forceSetX(x,y)
{
  var sender = document.getElementsByName("l_"+y+"_"+x)[0];
  if(!sender) return false;
  
  setImg(sender, "x");  
  return true;
}

function anotherCellIsUnsolvable(x,y)
{
  for(var i=0; i<DIMENSION; i++)
  {
    for(var j=0; j<DIMENSION; j++)
    {
      if(i!=x && j!=y && isDarkX(i,j) && !isReachable(i,j))
      {
        return true;
      }
    }
  }
  
  return false;
}

function getImg(x,y)
{
  return document.getElementsByName("l_"+x+"_"+y)[0]["src"];
}

//Return true if progress was made
function solveNumberedCell(x,y,numberOfAdditionalBulbsRequired)
{
  var progressWasMade = false;
  
  if(numberOfAdditionalBulbsRequired == 3)
  {
    progressWasMade = setX(x-1, y-1)   || progressWasMade;
    progressWasMade = setX(x-1, y+1)   || progressWasMade;
    progressWasMade = setX(x+1, y-1)   || progressWasMade;
    progressWasMade = setX(x+1, y+1)   || progressWasMade;
  }
  
  switch(numberOfAdditionalBulbsRequired)
  {
    case 0:
      progressWasMade = setX(x-1, y)   || progressWasMade;
      progressWasMade = setX(x+1, y)   || progressWasMade;
      progressWasMade = setX(x,   y-1) || progressWasMade;
      progressWasMade = setX(x,   y+1) || progressWasMade;
      break;    

    default:
      if(numberOfAdditionalBulbsRequired != freeNeighborCount(x,y)) break;

      progressWasMade = setBulb(x-1, y)   || progressWasMade;
      progressWasMade = setBulb(x+1, y)   || progressWasMade;
      progressWasMade = setBulb(x,   y-1) || progressWasMade;
      progressWasMade = setBulb(x,   y+1) || progressWasMade;
      break;  
  }
  
  return progressWasMade || markCornersOfNumberedCellThatCannotBeBulbAsX(x,y);
}

//For a numbered cell at position x,y
//If it cannot be a bulb, mark it as X
//Return true if progress was made
function markCornersOfNumberedCellThatCannotBeBulbAsX(x,y)
{
  if(freeNeighborCount(x,y) != getNumberOfAdditionalBulbsRequired(x,y) + 1)
    return false;
  
  return markFreeCornersWithX(x,y);
}

//Mark all free corners that are part of a free corner trio
//Return true if at least one valid free corner was found and marked
//Return false otherwise
//Example: The bottom left corner is a free corner trio.
//The "?" cell would be marked as X
// _x_|_x_|_x_
// ___|_1_|_x_
//  ? |   | x
function markFreeCornersWithX(x,y)
{
  var progressWasMade = false;
  
  if(isFree(x-1,y-1) && isFree(x-1,y) && isFree(x,y-1))
  {
    progressWasMade = setX(x-1,y-1) || progressWasMade;
  }
  if(isFree(x+1,y-1) && isFree(x+1,y) && isFree(x,y-1))
  {
    progressWasMade = setX(x+1,y-1) || progressWasMade;
  }
  if(isFree(x-1,y+1) && isFree(x-1,y) && isFree(x,y+1))
  {
    progressWasMade = setX(x-1,y+1) || progressWasMade;
  }
  if(isFree(x+1,y+1) && isFree(x+1,y) && isFree(x,y+1))
  {
    progressWasMade = setX(x+1,y+1) || progressWasMade;
  }
  
  return progressWasMade;
}

//Return true if progress was made
function solveFreeCell(x,y)
{  
  if(!isReachable(x,y))
  {
    if(setBulb(x,y))
    {
      return true;
    }
  }

  return ifCannotBeBulbMarkAsX(x,y);
}

function setXifBulbBlocksNumber(x,y)
{
  if(!isFree(x,y)) return false;
    
  var sender = document.getElementsByName("l_"+y+"_"+x)[0];
  if(!sender) return false;
  
  setImg(sender, "y");
  initCells();
  
  if(freeNeighborCount(x,y) < getNumberOfAdditionalBulbsRequired(x,y)) return true;
  
  if(unsolvableNumberedCellFound() == 1)//cell has too few free neighbors
  {
    setImg(sender, "x");
    initCells();
    return true;
  }
  else if(unsolvableNumberedCellFound() == 2)// cell has too many bulbed neighbors
  {
    setImg(sender, "x");
    initCells();
    return true;
  }
  else //all numbered cells are solvable
  {
    setImg(sender, "n");
    initCells();
    return false;
  }
}

// return 0 if all numbered cells are solvable
// return 1 if a cell has too few free neighbors
// return 2 if a cell has too many bulbed neighbors
function unsolvableNumberedCellFound()
{
  for(var x=0; x<DIMENSION; x++)
  {
    for(var y=0; y<DIMENSION; y++)
    {
      var numberOfAdditionalBulbsRequired = getNumberOfAdditionalBulbsRequired(x,y);
      if( isNaN(numberOfAdditionalBulbsRequired) ) continue;
    
      if(freeNeighborCount(x,y) < numberOfAdditionalBulbsRequired) return 1;
      if(numberOfAdditionalBulbsRequired < 0) return 2;
    }
  }
  
  return 0;
}

function solveDarkXCell(x,y)
{
  var reachableCell = findSingleReachable(x,y);
  if(reachableCell == null) return false;
  
  var reachableCellX = Number(reachableCell[0]);
  var reachableCellY = Number(reachableCell[1]);
  return setBulb(reachableCellX, reachableCellY);
}

//Return number of free neighbors around cell
function freeNeighborCount(x,y)
{
  if(!isValid(x,y)) return 0;
  
  var count = 0;
  
  if( isFree(x-1, y)   ) count++;
  if( isFree(x+1, y)   ) count++;
  if( isFree(x,   y-1) ) count++;
  if( isFree(x,   y+1) ) count++;
  
  return count;
}

//Return number of bulbed neighbors around cell
function getBulbCount(x,y)
{
  if(!isValid(x,y)) return 0;
  
  var count = 0;
  
  if( isBulb(x-1, y) )   count++;
  if( isBulb(x+1, y) )   count++;
  if( isBulb(x,   y-1) ) count++;
  if( isBulb(x,   y+1) ) count++;
  
  return count;
}

//Strip the image's basename out of an URL
//Example
// Input: http://www.puzzle-light-up.com/nd.gif?light
// Output: nd
function baseNameFromURL(URL)
{
  var splittedURL = URL.split('/');
  var endOfURL = splittedURL[splittedURL.length-1];
  var baseName = endOfURL.split('.',1)[0];
  return baseName;
}

function setBulb(x,y)
{
  if(!isFree(x,y)) return false;
  
  var sender = document.getElementsByName("l_"+y+"_"+x)[0];
  if(!sender) return false;
  
  setImg(sender, "y");
  
  return true;
}

function setX(x,y)
{
  if(!isFree(x,y)) return false;
  
  var sender = document.getElementsByName("l_"+y+"_"+x)[0];
  if(!sender) return false;
  
  setImg(sender, "x");  
  return true;
}

function setEmpty(x,y)
{
  if(isFree(x,y)) return false;
  
  var sender = document.getElementsByName("l_"+y+"_"+x)[0];
  if(!sender) return false;
  
  setImg(sender, "n");  
  return true;
}

//Return cell number or Number.NaN
function getNumber(x,y)
{
  if(!isValid(x,y)) return Number.NaN;
  
  var cellValue = cells[x][y];
  if(cellValue.length != 3) return Number.NaN;
  
  var number = Number( cells[x][y][2] );
  if( isNaN(number) ) return Number.NaN;
  
  return number
}

//Return number of additional bulbs required around a number
//If cell is not a number, return Number.NaN
function getNumberOfAdditionalBulbsRequired(x,y)
{  
  return getNumber(x,y) - getBulbCount(x,y);
}

//Return true if cell is free, false otherwise
function isFree(x,y)
{
  if(!isValid(x,y)) return false;
  
  return ( cells[x][y] == "nd" );
}

//Return true if cell is a bulb, false otherwise
function isBulb(x,y)
{
  if(!isValid(x,y)) return false;
  
  return ( cells[x][y] == "yl" );
}

function isDarkX(x,y)
{
  if(!isValid(x,y)) return false;
  
  return ( cells[x][y] == "xd" );
}

function isDarkEmpty(x,y)
{
  if(!isValid(x,y)) return false;
  
  return isDark(x,y) && isFree(x,y)
}

function isDark(x,y)
{
  if(!isValid(x,y)) return false;
  
  return ( cells[x][y][1] == "d" );
}

//True if cell exists inside board dimension
function isValid(x,y)
{
  return (x>=0 && x<DIMENSION && y>=0 && y<DIMENSION);
}

function isWall(x,y)
{
  if(!isValid(x,y)) return true;
  
  return (wall[y][x]==true);
}

//True if cell can be lit from a bulb on another cell
//Return false if it is only reachable by itself
function isReachable(x,y)
{
  //Check left
  for(var i=x-1; !isWall(i,y); i--)
  {
    if(isFree(i,y)) return true;
  }
  
  //Check right
  for(var i=x+1; !isWall(i,y); i++)
  {
    if(isFree(i,y)) return true;
  }
  
  //Check up
  for(var j=y-1; !isWall(x,j); j--)
  {
    if(isFree(x,j)) return true;
  }
  
  //Check down
  for(var j=y+1; !isWall(x,j); j++)
  {
    if(isFree(x,j)) return true;
  }
  
  return false;
}

//If reachable by 1 cell, return cell's position: [x,y]
//Otherwise, return null
function findSingleReachable(x,y)
{
  var position = null;
  
  //Check left
  for(var i=x-1; !isWall(i,y); i--)
  {
    if(isFree(i,y)) 
    {
      if(position == null)
      {
        position = [i,y];
      }
      else
      {
        return null;
      }
    }
  }
  
  //Check right
  for(var i=x+1; !isWall(i,y); i++)
  {
    if(isFree(i,y)) 
    {
      if(position == null)
      {
        position = [i,y];
      }
      else
      {
        return null;
      }
    }
  }
  
  //Check up
  for(var j=y-1; !isWall(x,j); j--)
  {
    if(isFree(x,j)) 
    {
      if(position == null)
      {
        position = [x,j];
      }
      else
      {
        return null;
      }
    }
  }
  
  //Check down
  for(var j=y+1; !isWall(x,j); j++)
  {
    if(isFree(x,j)) 
    {
      if(position == null)
      {
        position = [x,j];
      }
      else
      {
        return null;
      }
    }
  }
  
  return position;
}