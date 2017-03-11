/*
  Nurikabe
  =================================
  Goal:
   - Mark all the black tiles
  
  Rules:
   - All black squares must be contiguous (diagonally doesn't count)
   - A tile numbered N must be in a pool of N contiguous white tiles
   - Two numbers cannot be in the same pool
*/

W = 0; //White tile
B = -1; //Black tile

(function main()
{
  run_all_tests();
  
  var html_board = get_html_board();
  solve_html_board(html_board);
})();

function run_all_tests()
{
  test_when_number_is_1_then_mark_all_sides_as_black();
  test_when_white_tile_between_two_numbers_then_mark_black();
}

function test_when_number_is_1_then_mark_all_sides_as_black()
{
  var board = [
      [W, W, W],
      [W, 1, W],
      [W, W, W]
    ];
  
  var expected_solved_board = [
      [W, B, W],
      [B, 1, B],
      [W, B, W]
    ];
  
  var solved_board = solve_tiles_numbered_1(board);
  
  assert(are_arrays_equal(expected_solved_board, solved_board), "Tiles touching a '1' should be marked as black");
}

function test_when_white_tile_between_two_numbers_then_mark_black()
{
  var board = [
      [2, W, 2],
      [W, W, W],
      [2, W, W]
    ];
  
  var expected_solved_board = [
      [2, B, 2],
      [B, W, W],
      [2, W, W]
    ];
  
  var solved_board = solve_white_tiles_between_numbers(board);
  
  assert(are_arrays_equal(expected_solved_board, solved_board), "Tiles between numbers should be marked as black");
}

///////////
// Board //
///////////

function solve(board)
{
  var solved_board = board;

  solved_board = solve_tiles_numbered_1(solved_board);
  solved_board = solve_white_tiles_between_numbers(solved_board);
  
  return solved_board;
}

function solve_tiles_numbered_1(board)
{
  for(var i=0; i<board.length; i++)
  {
    for(var j=0; j<board.length; j++)
    {
      if(board[i][j] == 1)
      {
        board = set_board_tile_black(board, i, j-1);
        board = set_board_tile_black(board, i, j+1);
        board = set_board_tile_black(board, i-1, j);
        board = set_board_tile_black(board, i+1, j);
      }
    }
  }
  
  return board;
}

function solve_white_tiles_between_numbers(board)
{
  for(var i=0; i<board.length; i++)
  {
    for(var j=0; j<board.length; j++)
    {
      if(board[i][j] != W)
      {
        continue;
      }
      
      var is_between_numbers_horizontally =  is_number_tile(board, i-1, j) && is_number_tile(board, i+1, j);
      var is_between_numbers_vertically =  is_number_tile(board, i, j-1) && is_number_tile(board, i, j+1);
      var is_between_numbers = is_between_numbers_horizontally || is_between_numbers_vertically;
      
      if(is_between_numbers)
      {
        board = set_board_tile_black(board, i, j);
      }
    }
  }
  
  return board;
}

function set_board_tile_black(board, x, y)
{
  if(is_valid_board_tile(board, x, y))
  {
    board[x][y] = B;
  }
  
  return board;
}

function is_valid_board_tile(board, x , y)
{
  if(x < 0 || x >= board.length)
  {
    return false;
  }
  
  if(y < 0 || y >= board.length)
  {
    return false;
  }
  
  return true;
}

function is_white_board_tile(board, x , y)
{
  if(!is_valid_board_tile(board, x , y))
  {
    return false;
  }
  
  return board[x][y] == W;
}

function is_number_tile(board, x ,y)
{
  if(!is_valid_board_tile(board, x , y))
  {
    return false;
  }
  
  return board[x][y] >= 1;
}

////////////////
// HTML board //
////////////////

function solve_html_board(html_board)
{
    var board = get_board_from_html_board(html_board);
    var solved_board = solve(board);
    update_html_board(html_board, solved_board);
}

function get_board_from_html_board(html_board)
{
  var board_dimension = get_html_board_dimension(html_board);
  
  var board = new Array(board_dimension);
  for(var i=0; i<board_dimension; i++)
  {
    board[i] = new Array(board_dimension);
    for(var j=0; j<board_dimension; j++)
    {
      board[i][j] = get_html_board_tile_value(html_board, i, j);
    }
  }
  
  return board;
}

function get_html_board_tile_value(html_board, x, y)
{
  var html_board_tile = get_html_board_tile(html_board, x, y)
  
  if(html_board_tile.innerHTML.includes("nun.gif"))
  {
    return W;
  }
  
  if(html_board_tile.innerHTML.includes("nuy.gif"))
  {
    return B;
  }
  
  return Number(html_board_tile.innerHTML);
}

function get_html_board_dimension(html_board)
{
  return html_board.getElementsByTagName("tr").length;
}

function get_html_board()
{
  var table_element = document.getElementById("NurikabeTable");
  var table_body = table_element.getElementsByTagName("tbody")[0];
  return table_body;
}

function update_html_board(html_board, board)
{
  for(var i=0; i<board.length; i++)
  {
    for(var j=0; j<board.length; j++)
    {
      if(board[i][j] == B)
      {
        set_html_board_black_tile(html_board, i, j)
      }
    }
  }
}

function set_html_board_black_tile(html_board, x, y)
{
  var html_board_tile = get_html_board_tile(html_board, x, y)
  html_board_tile.innerHTML = html_board_tile.innerHTML.replace("nun.gif", "nuy.gif");
}

function get_html_board_tile(html_board, x, y)
{
  var html_board_rows = html_board.getElementsByTagName("tr");
  var html_board_tiles = html_board_rows[y].getElementsByTagName("td");
  var html_board_tile = html_board_tiles[x];
  return html_board_tile;
}

/////////////
// Utility //
/////////////

function assert(condition, message) 
{
  if(!condition)
  {
    alert(message); 
  }
};

function are_arrays_equal(array1, array2)
{
    if (!array1 || !array2)
        return false;

    if (array1.length != array2.length)
        return false;

    for (var i = 0; i < array1.length; i++) {
        // Check if we have nested arrays
        if (array1[i] instanceof Array && array2[i] instanceof Array) {
            // recurse into the nested arrays
            if (!are_arrays_equal(array1[i], array2[i]))
                return false;
        }
        else if (array1[i] != array2[i]) {
            // Warning - two different object instances will never be equal: {x:20} != {x:20}
            return false;
        }
    }
    return true;
}
