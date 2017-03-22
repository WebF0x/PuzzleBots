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
D = -2; //Dot tile

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
  test_when_numbers_touch_by_corner_then_mark_inbetween_tiles_black();
  test_when_black_tile_touches_only_one_white_tile_and_no_black_tiles_mark_it_black();
  test_when_number_tile_touches_only_one_white_tile_and_no_dots_tile_then_mark_it_dot();
  test_when_white_tile_has_no_white_dot_or_number_neighbors_then_mark_as_black();
  test_when_white_tile_could_complete_illegal_black_square_then_mark_it_as_dot();
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

function test_when_numbers_touch_by_corner_then_mark_inbetween_tiles_black()
{
   var board = [
      [2, W, W],
      [W, 2, W],
      [2, W, W]
    ];
  
  var expected_solved_board = [
      [2, B, W],
      [B, 2, W],
      [2, B, W]
    ];
  
  var solved_board = solve_numbers_touching_by_corners(board);
  
  assert(are_arrays_equal(expected_solved_board, solved_board), "Tiles between numbers touching by corner should be marked as black");
}

function test_when_black_tile_touches_only_one_white_tile_and_no_black_tiles_mark_it_black()
{
   var board = [
      [2, W, B],
      [B, W, B],
      [1, B, 1]
    ];
  
  var expected_solved_board = [
      [2, W, B],
      [B, B, B],
      [1, B, 1]
    ];
  
  var solved_board = solve_black_tiles_touching_only_one_white_tile_and_no_black_tiles(board);
  
  assert(are_arrays_equal(expected_solved_board, solved_board), "When black tile touches only one white tile, it should be marked as black");
}

function test_when_number_tile_touches_only_one_white_tile_and_no_dots_tile_then_mark_it_dot()
{
  var board = [
      [B, W, W],
      [3, W, W],
      [B, B, B]
    ];
  
  var expected_solved_board = [
      [B, W, W],
      [3, D, W],
      [B, B, B]
    ];
  
  var solved_board = solve_number_tile_touching_only_one_white_tile_and_no_dots(board);
  
  assert(are_arrays_equal(expected_solved_board, solved_board), "When number tile touches only one white tile and no dots, it should be marked as dot");
}

function test_when_white_tile_has_no_white_dot_or_number_neighbors_then_mark_as_black()
{
  var board = [
      [B, D, W],
      [W, B, W],
      [B, 2, W]
    ];
  
  var expected_solved_board = [
      [B, D, W],
      [B, B, W],
      [B, 2, W]
    ];
  
  var solved_board = solve_tiles_without_white_dot_or_number_neighbors(board);
  
  assert(are_arrays_equal(expected_solved_board, solved_board), "When white tile has no white, dot or number neighbors, it should be marked as black");
}

function test_when_white_tile_could_complete_illegal_black_square_then_mark_it_as_dot()
{
  var board = [
      [W, B, B],
      [W, W, B],
      [W, W, W]
    ];
  
  var expected_solved_board = [
      [W, B, B],
      [W, D, B],
      [W, W, W]
    ];
  
  var solved_board = solve_white_tiles_that_could_complete_illegal_black_square(board);
  
  assert(are_arrays_equal(expected_solved_board, solved_board), "When a white could complete an illegal black square, it should be marked as dot");
}

///////////
// Board //
///////////

function solve(board)
{
  var solved_board = board;

  solved_board = solve_tiles_numbered_1(solved_board);
  solved_board = solve_white_tiles_between_numbers(solved_board);
  solved_board = solve_numbers_touching_by_corners(solved_board);
  solved_board = solve_black_tiles_touching_only_one_white_tile_and_no_black_tiles(solved_board);
  solved_board = solve_number_tile_touching_only_one_white_tile_and_no_dots(solved_board);
  solved_board = solve_tiles_without_white_dot_or_number_neighbors(solved_board);
  solved_board = solve_white_tiles_that_could_complete_illegal_black_square(solved_board);

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
        set_all_neighbors_black(board, i, j);
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

function solve_numbers_touching_by_corners(board)
{
  for(var i=0; i<board.length; i++)
  {
    for(var j=0; j<board.length; j++)
    {
      if(!is_number_tile(board, i, j))
      {
        continue;
      }
      
      var is_bottom_left_tile_a_number = is_number_tile(board, i-1, j+1);
      var is_bottom_right_tile_a_number = is_number_tile(board, i+1, j+1);
      
      if(is_bottom_left_tile_a_number)
      {
        set_board_tile_black(board, i-1, j);
        set_board_tile_black(board, i, j+1);
      }
      
      if(is_bottom_right_tile_a_number)
      {
        set_board_tile_black(board, i+1, j);
        set_board_tile_black(board, i, j+1);
      }
    }
  }
  
  return board;
}

function solve_black_tiles_touching_only_one_white_tile_and_no_black_tiles(board)
{
  for(var i=0; i<board.length; i++)
  {
    for(var j=0; j<board.length; j++)
    {
      if(!is_black_tile(board, i, j))
      {
        continue;
      }
      
      if(get_number_of_white_neighbors(board, i, j) != 1)
      {
        continue;
      }
      
      if(get_number_of_black_neighbors(board, i, j) != 0)
      {
        continue;
      }
      
      set_all_neighbors_black(board, i, j);
    }
  }
  
  return board;
}

function solve_number_tile_touching_only_one_white_tile_and_no_dots(board)
{
  for(var i=0; i<board.length; i++)
  {
    for(var j=0; j<board.length; j++)
    {
      if(!is_number_tile(board, i, j))
      {
        continue;
      }
      
      if(get_number_of_dot_neighbors(board, i, j) != 0)
      {
        continue;
      }
      
      if(get_number_of_white_neighbors(board, i, j) != 1)
      {
        continue;
      }
      
      set_all_neighbors_dot(board, i, j);
    }
  }
  
  return board;
}

function solve_tiles_without_white_dot_or_number_neighbors(board)
{
  for(var i=0; i<board.length; i++)
  {
    for(var j=0; j<board.length; j++)
    {
      if(!is_white_tile(board, i, j))
      {
        continue;
      }
      
      if(get_number_of_white_neighbors(board, i, j) != 0)
      {
        continue;
      }
      
      if(get_number_of_dot_neighbors(board, i, j) != 0)
      {
        continue;
      }
      
      if(get_number_of_number_neighbors(board, i, j) != 0)
      {
        continue;
      }
      
      set_board_tile_black(board, i, j);
    }
  }
  
  return board;
}

function solve_white_tiles_that_could_complete_illegal_black_square(board)
{
  for(var i=0; i<board.length; i++)
  {
    for(var j=0; j<board.length; j++)
    {
      if(!is_white_tile(board, i, j))
      {
        continue;
      }
      
      if(!white_tile_could_complete_illegal_black_square(board, i, j))
      {
        continue;
      }
      
      set_board_tile_dot(board, i, j);
    }
  }
  
  return board;
}

function set_board_tile_black(board, x, y)
{
  if(is_white_tile(board, x, y))
  {
    board[x][y] = B;
  }
  
  return board;
}

function set_board_tile_dot(board, x, y)
{
  if(is_white_tile(board, x, y))
  {
    board[x][y] = D;
  }
  
  return board;
}

function set_all_neighbors_black(board, x, y)
{
  set_board_tile_black(board, x-1, y);
  set_board_tile_black(board, x+1, y);
  set_board_tile_black(board, x, y-1);
  set_board_tile_black(board, x, y+1);
}

function set_all_neighbors_dot(board, x, y)
{
  set_board_tile_dot(board, x-1, y);
  set_board_tile_dot(board, x+1, y);
  set_board_tile_dot(board, x, y-1);
  set_board_tile_dot(board, x, y+1);
}

function is_valid_tile(board, x , y)
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

function is_white_tile(board, x , y)
{
  if(!is_valid_tile(board, x , y))
  {
    return false;
  }
  
  return board[x][y] == W;
}

function is_black_tile(board, x , y)
{
  if(!is_valid_tile(board, x , y))
  {
    return false;
  }
  
  return board[x][y] == B;
}

function is_dot_tile(board, x , y)
{
  if(!is_valid_tile(board, x , y))
  {
    return false;
  }
  
  return board[x][y] == D;
}

function is_number_tile(board, x ,y)
{
  if(!is_valid_tile(board, x , y))
  {
    return false;
  }
  
  return board[x][y] >= 1;
}

function white_tile_could_complete_illegal_black_square(board, x, y)
{
  if(!is_white_tile(board, x, y))
  {
    return false;
  }
  
  //Would complete top left corner?
  if(is_black_tile(board, x+1, y+1) &&
     is_black_tile(board, x+1, y) &&
     is_black_tile(board, x, y+1))
  {
    return true;
  }
  
  //Would complete top right corner?
  if(is_black_tile(board, x-1, y+1) &&
     is_black_tile(board, x-1, y) &&
     is_black_tile(board, x, y+1))
  {
    return true;
  }
  
  //Would complete bot left corner?
  if(is_black_tile(board, x+1, y-1) &&
     is_black_tile(board, x+1, y) &&
     is_black_tile(board, x, y-1))
  {
    return true;
  }
  
  //Would complete bot right corner?
  if(is_black_tile(board, x-1, y-1) &&
     is_black_tile(board, x-1, y) &&
     is_black_tile(board, x, y-1))
  {
    return true;
  }
    
  return false;
}

function get_number_of_black_neighbors(board, x , y)
{
  var count = 0;
  if(is_black_tile(board, x-1, y)) count++;
  if(is_black_tile(board, x+1, y)) count++;
  if(is_black_tile(board, x, y-1)) count++;
  if(is_black_tile(board, x, y+1)) count++;
  return count;
}

function get_number_of_white_neighbors(board, x , y)
{
  var count = 0;
  if(is_white_tile(board, x-1, y)) count++;
  if(is_white_tile(board, x+1, y)) count++;
  if(is_white_tile(board, x, y-1)) count++;
  if(is_white_tile(board, x, y+1)) count++;
  return count;
}

function get_number_of_dot_neighbors(board, x , y)
{
  var count = 0;
  if(is_dot_tile(board, x-1, y)) count++;
  if(is_dot_tile(board, x+1, y)) count++;
  if(is_dot_tile(board, x, y-1)) count++;
  if(is_dot_tile(board, x, y+1)) count++;
  return count;
}

function get_number_of_number_neighbors(board, x , y)
{
  var count = 0;
  if(is_number_tile(board, x-1, y)) count++;
  if(is_number_tile(board, x+1, y)) count++;
  if(is_number_tile(board, x, y-1)) count++;
  if(is_number_tile(board, x, y+1)) count++;
  return count;
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
  
  if(html_board_tile.innerHTML.includes("nux.gif"))
  {
    return D;
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
      
      if(board[i][j] == D)
      {
        set_html_board_dot_tile(html_board, i, j)
      }
    }
  }
}

function set_html_board_black_tile(html_board, x, y)
{
  var html_board_tile = get_html_board_tile(html_board, x, y)
  html_board_tile.innerHTML = html_board_tile.innerHTML.replace("nun.gif", "nuy.gif");
}

function set_html_board_dot_tile(html_board, x, y)
{
  var html_board_tile = get_html_board_tile(html_board, x, y)
  html_board_tile.innerHTML = html_board_tile.innerHTML.replace("nun.gif", "nux.gif");
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
