/*
  Nurikabe
  =================================
  Goal:
   - Mark all the black tiles
  
  Rules:
   - All black squares must be contiguous (diagonally doesn't count)
   - A tile numbered N must be in a white pool of N contiguous tiles
   - Two numbers cannot be in the same white pool
   - There can be no square of 4 black tiles
*/

var W = 0; //White tile
var B = -1; //Black tile
var D = -2; //Dot tile

(function main()
{
  run_all_tests();
  
  const html_board = get_html_board();
  
  const number_solve_functions = [
    solve_tiles_numbered_1,
    solve_numbers_touching_by_corners,
    solve_number_tile_touching_only_one_white_tile_and_no_dots,
    surround_complete_white_pools_with_black_tiles,
    extend_uncomplete_white_pools_with_one_white_neighbor
  ];
  
  const white_solve_functions = [
    solve_white_tiles_between_numbers,
    solve_tiles_without_white_dot_or_number_neighbors,
    solve_white_tiles_that_could_complete_illegal_black_square
  ];
  
  const black_solve_functions = [
    solve_black_tiles_touching_only_one_white_tile_and_no_black_tiles,
    extend_black_pools_with_one_white_neighbor
  ];
  
  const dot_solve_functions = [
    solve_dot_tiles_touching_one_white_no_dot_and_no_number_tiles
  ];
  
  solve_html_board(html_board, 
                   number_solve_functions,
                   white_solve_functions,
                   black_solve_functions,
                   dot_solve_functions);
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
  test_when_dot_tile_touches_one_white_no_dot_and_no_number_tiles_then_mark_dot();
  test_get_white_pool_size();
  test_when_white_pool_is_complete_then_surround_with_black_tiles();
  test_get_black_pool_size();
  test_when_black_pool_has_only_one_white_neighbor_then_mark_it_black();
  test_when_uncomplete_white_pool_has_only_one_white_neighbor_then_mark_dot();
  test_when_solving_board_then_keep_trying_as_long_as_you_progress();
  test_when_solving_board_then_call_solve_number_functions_on_each_number_tile();
  test_when_solving_board_then_call_solve_white_functions_on_each_white_tile();
  test_when_solving_board_then_call_solve_black_functions_on_each_black_tile();
  test_when_solving_board_then_call_solve_dot_functions_on_each_dot_tile();
}

function test_when_number_is_1_then_mark_all_sides_as_black()
{
  const board = [
    [W, W, W],
    [W, 1, W],
    [W, W, W]
  ];
  
  const expected_board = [
    [W, B, W],
    [B, 1, B],
    [W, B, W]
  ];
  
  solve_tiles_numbered_1(board, 1, 1);
  
  assert(are_arrays_equal(expected_board, board), 
         "Tiles touching a '1' should be marked as black");
}

function test_when_white_tile_between_two_numbers_then_mark_black()
{
  const board = [
    [2, W, 2],
    [W, W, W],
    [2, W, W]
  ];
  
  const expected_board = [
    [2, B, 2],
    [B, W, W],
    [2, W, W]
  ];
  
  solve_white_tiles_between_numbers(board, 0, 1);
  solve_white_tiles_between_numbers(board, 1, 0);
  
  assert(are_arrays_equal(expected_board, board), 
         "Tiles between numbers should be marked as black");
}

function test_when_numbers_touch_by_corner_then_mark_inbetween_tiles_black()
{
   const board = [
     [2, W, W],
     [W, 2, W],
     [2, W, W]
   ];
  
  const expected_board = [
    [2, B, W],
    [B, 2, W],
    [2, B, W]
  ];
  
  solve_numbers_touching_by_corners(board, 0, 0);
  solve_numbers_touching_by_corners(board, 1, 1);
  solve_numbers_touching_by_corners(board, 2, 0);
  
  assert(are_arrays_equal(expected_board, board), 
         "Tiles between numbers touching by corner should be marked as black");
}

function test_when_black_tile_touches_only_one_white_tile_and_no_black_tiles_mark_it_black()
{
   const board = [
     [2, W, B],
     [B, W, B],
     [1, B, 1]
   ];
  
  const expected_board = [
    [2, W, B],
    [B, B, B],
    [1, B, 1]
  ];
  
  solve_black_tiles_touching_only_one_white_tile_and_no_black_tiles(board, 1, 0);
  
  assert(are_arrays_equal(expected_board, board), 
         "When black tile touches only one white tile, it should be marked as black");
}

function test_when_number_tile_touches_only_one_white_tile_and_no_dots_tile_then_mark_it_dot()
{
  const board = [
    [B, W, W],
    [3, W, W],
    [B, B, B]
  ];
  
  const expected_board = [
    [B, W, W],
    [3, D, W],
    [B, B, B]
  ];
  
  solve_number_tile_touching_only_one_white_tile_and_no_dots(board, 1, 0);
  
  assert(are_arrays_equal(expected_board, board), 
         "When number tile touches only one white tile and no dots, " +
         "it should be marked as dot");
}

function test_when_white_tile_has_no_white_dot_or_number_neighbors_then_mark_as_black()
{
  const board = [
    [B, D, W],
    [W, B, W],
    [B, 2, W]
  ];
  
  const expected_board = [
    [B, D, W],
    [B, B, W],
    [B, 2, W]
  ];
  
  solve_tiles_without_white_dot_or_number_neighbors(board, 1, 0);
  
  assert(are_arrays_equal(expected_board, board), 
         "When white tile has no white, dot or number neighbors, " + 
         "it should be marked as black");
}

function test_when_white_tile_could_complete_illegal_black_square_then_mark_it_as_dot()
{
  const board = [
    [W, B, B],
    [W, W, B],
    [W, W, W]
  ];
  
  const expected_board = [
    [W, B, B],
    [W, D, B],
    [W, W, W]
  ];
  
  solve_white_tiles_that_could_complete_illegal_black_square(board, 1, 1);
  
  assert(are_arrays_equal(expected_board, board), 
         "When a white could complete an illegal black square, it should be marked as dot");
}

function test_when_dot_tile_touches_one_white_no_dot_and_no_number_tiles_then_mark_dot()
{
  const board = [
    [D, W, W],
    [2, W, W],
    [B, B, D]
  ];
  
  const expected_board = [
    [D, W, W],
    [2, W, D],
    [B, B, D]
  ];
  
  solve_dot_tiles_touching_one_white_no_dot_and_no_number_tiles(board, 2, 2);
  solve_dot_tiles_touching_one_white_no_dot_and_no_number_tiles(board, 0, 0);
  
  assert(are_arrays_equal(expected_board, board), 
         "When a dot touches a single white tile and no dot tiles and no number tiles, " + 
         "then the white tile should be marked as dot");
}

function test_get_white_pool_size()
{
  const board = [
    [D, W, B],
    [5, D, B],
    [W, D, B]
  ];
  
  const expected_pool_size = 4;
  const pool_size = get_white_pool_size(board, 0, 0);
  
  assert((expected_pool_size == pool_size), 
         "White pool size should include the number tile and " +
         "all the dot tiles in the same pool");
}

function test_when_white_pool_is_complete_then_surround_with_black_tiles()
{
  const board = [
    [2, W, W],
    [D, W, W],
    [W, W, W]
  ];
  
  const expected_board = [
    [2, B, W],
    [D, B, W],
    [B, W, W]
  ];
  
  surround_complete_white_pools_with_black_tiles(board, 0, 0);
  
  assert(are_arrays_equal(expected_board, board), 
         "When a white pool is complete, the surrounding tiles should be marked as black");
}

function test_get_black_pool_size()
{
  const board = [
    [D, W, B],
    [5, D, B],
    [W, D, B]
  ];
  
  const expected_pool_size = 3;
  const pool_size = get_black_pool_size(board, 2, 2);
  
  assert((expected_pool_size == pool_size), 
         "Black pool size should include the number of black tiles");
}

function test_when_black_pool_has_only_one_white_neighbor_then_mark_it_black()
{
  const board = [
    [B, W, W],
    [D, W, W],
    [W, B, B]
  ];
  
  const expected_board = [
    [B, B, W],
    [D, W, W],
    [W, B, B]
  ];
  
  extend_black_pools_with_one_white_neighbor(board, 0, 0);
  
  assert(are_arrays_equal(expected_board, board), 
         "When a black pool touches only one white tile, that tile should be marked as black");
}

function test_when_uncomplete_white_pool_has_only_one_white_neighbor_then_mark_dot()
{
  const board = [
    [B, B, B],
    [D, W, W],
    [3, B, B]
  ];
  
  const expected_board = [
    [B, B, B],
    [D, D, W],
    [3, B, B]
  ];
  
  extend_uncomplete_white_pools_with_one_white_neighbor(board, 2, 0);
  
  assert(are_arrays_equal(expected_board, board), 
         "When an uncomplete white pool touches only one white tile, " + 
         "that tile should be marked as dot");
}

function test_when_solving_board_then_keep_trying_as_long_as_you_progress()
{
  let mock_solve_function_has_been_called_before = false;
  function mock_solve_function_requiring_two_runs(board, x, y)
  {
    if(!mock_solve_function_has_been_called_before)
    {
      set_board_tile_black(board, 0, 1);
      set_board_tile_black(board, 1, 0);
    }
    else
    {
      set_board_tile_black(board, 1, 1);
    }
    mock_solve_function_has_been_called_before = true;
  }
  
  const board = [
    [1, W],
    [W, W]
  ];
  
  const expected_board = [
    [1, B],
    [B, B]
  ];
  
  solve(board, [mock_solve_function_requiring_two_runs], [], [], []);
  
  assert(are_arrays_equal(expected_board, board), 
         "When solving the board, keep solving as long as there is progress");
}

function test_when_solving_board_then_call_solve_number_functions_on_each_number_tile()
{
  let mock_solve_function_has_been_called_before = false;
  function mock_solve_function(board, x, y)
  {
    assert(is_number_tile(board, x, y), 
           "When attempting to solve a number tile, it should actually be a number");
    mock_solve_function_has_been_called_before = true;
  }
  
  const board = [
    [1, W],
    [D, B]
  ];
  
  solve(board, [mock_solve_function], [], [], []);
  
  assert(mock_solve_function_has_been_called_before, 
         "When solving the board, we should attempt to solve each number tile");
}

function test_when_solving_board_then_call_solve_white_functions_on_each_white_tile()
{
  let mock_solve_function_has_been_called_before = false;
  function mock_solve_function(board, x, y)
  {
    assert(is_white_tile(board, x, y), 
           "When attempting to solve a white tile, it should actually be white");
    mock_solve_function_has_been_called_before = true;
  }
  
  const board = [
    [1, W],
    [D, B]
  ];
  
  solve(board, [], [mock_solve_function], [], []);
  
  assert(mock_solve_function_has_been_called_before, 
         "When solving the board, we should attempt to solve each white tile");
}

function test_when_solving_board_then_call_solve_black_functions_on_each_black_tile()
{
  let mock_solve_function_has_been_called_before = false;
  function mock_solve_function(board, x, y)
  {
    assert(is_black_tile(board, x, y), 
           "When attempting to solve a black tile, it should actually be black");
    mock_solve_function_has_been_called_before = true;
  }
  
  const board = [
    [1, W],
    [D, B]
  ];
  
  solve(board, [], [], [mock_solve_function], []);
  
  assert(mock_solve_function_has_been_called_before, 
         "When solving the board, we should attempt to solve each black tile");
}

function test_when_solving_board_then_call_solve_dot_functions_on_each_dot_tile()
{
  let mock_solve_function_has_been_called_before = false;
  function mock_solve_function(board, x, y)
  {
    assert(is_dot_tile(board, x, y), 
           "When attempting to solve a dot tile, it should actually be a dot");
    mock_solve_function_has_been_called_before = true;
  }
  
  const board = [
    [1, W],
    [D, B]
  ];
  
  solve(board, [], [], [], [mock_solve_function]);
  
  assert(mock_solve_function_has_been_called_before, 
         "When solving the board, we should attempt to solve each dot tile");
}

///////////
// Board //
///////////

function solve(board, 
                number_solve_functions, 
                white_solve_functions, 
                black_solve_functions, 
                dot_solve_functions)
{
  let initial_board = [];
  
  while(!are_arrays_equal(board, initial_board))
  {    
    initial_board = copy_array(board);
    solve_all_tiles(
      board, 
      number_solve_functions, 
      white_solve_functions, 
      black_solve_functions, 
      dot_solve_functions);
  }
}

function solve_all_tiles(board,
                         number_solve_functions, 
                         white_solve_functions, 
                         black_solve_functions, 
                         dot_solve_functions)
{
  for(let i=0; i<board.length; i++)
  {
    for(let j=0; j<board.length; j++)
    {
      solve_tile(board, 
                 i, 
                 j, 
                 number_solve_functions, 
                 white_solve_functions, 
                 black_solve_functions, 
                 dot_solve_functions);
    }
  }
}

function solve_tile(board, 
                     x, 
                     y, 
                     number_solve_functions, 
                     white_solve_functions,
                     black_solve_functions,
                     dot_solve_functions)
{
  if(is_number_tile(board, x, y))
  {
    solve_with_each_function(board, x, y, number_solve_functions);
  }
  else if(is_white_tile(board, x, y))
  {
    solve_with_each_function(board, x, y, white_solve_functions);
  }
  else if(is_black_tile(board, x, y))
  {
    solve_with_each_function(board, x, y, black_solve_functions);
  }
  else if(is_dot_tile(board, x, y))
  {
    solve_with_each_function(board, x, y, dot_solve_functions);
  }
}

function solve_with_each_function(board, x, y, solve_functions)
{
  for(const solve_function of solve_functions)
  {
    solve_function(board, x, y);
  }
}

function solve_tiles_numbered_1(board, x, y)
{
  if(board[x][y] == 1)
  {
    set_all_neighbors_black(board, x, y);
  }
}

function solve_white_tiles_between_numbers(board, x, y)
{
  const is_between_numbers_horizontally = is_number_tile(board, x-1, y) && 
                                        is_number_tile(board, x+1, y);
  const is_between_numbers_vertically = is_number_tile(board, x, y-1) && 
                                      is_number_tile(board, x, y+1);
  const is_between_numbers = is_between_numbers_horizontally || 
                           is_between_numbers_vertically;
  if(is_between_numbers)
  {
    set_board_tile_black(board, x, y);
  }
}

function solve_numbers_touching_by_corners(board, x, y)
{
  const is_bottom_left_tile_a_number = is_number_tile(board, x-1, y+1);
  const is_bottom_right_tile_a_number = is_number_tile(board, x+1, y+1);
  const is_top_left_tile_a_number = is_number_tile(board, x-1, y-1);
  const is_top_right_tile_a_number = is_number_tile(board, x+1, y-1);

  if(is_bottom_left_tile_a_number)
  {
    set_board_tile_black(board, x-1, y);
    set_board_tile_black(board, x, y+1);
  }

  if(is_bottom_right_tile_a_number)
  {
    set_board_tile_black(board, x+1, y);
    set_board_tile_black(board, x, y+1);
  }
  
  if(is_top_left_tile_a_number)
  {
    set_board_tile_black(board, x-1, y);
    set_board_tile_black(board, x, y-1);
  }

  if(is_top_right_tile_a_number)
  {
    set_board_tile_black(board, x+1, y);
    set_board_tile_black(board, x, y-1);
  }
}

function solve_black_tiles_touching_only_one_white_tile_and_no_black_tiles(board, x, y)
{
  if(get_number_of_white_neighbors(board, x, y) == 1 && 
     get_number_of_black_neighbors(board, x, y) == 0)
  {
    set_all_neighbors_black(board, x, y);
  }
}

function solve_number_tile_touching_only_one_white_tile_and_no_dots(board, x, y)
{
  if(get_number_of_dot_neighbors(board, x, y) == 0 &&
     get_number_of_white_neighbors(board, x, y) == 1)
  {
    set_all_neighbors_dot(board, x, y);
  }
}

function solve_tiles_without_white_dot_or_number_neighbors(board, x, y)
{
  if(get_number_of_white_neighbors(board, x, y) == 0 &&
     get_number_of_dot_neighbors(board, x, y) == 0 &&
     get_number_of_number_neighbors(board, x, y) == 0)
  {
    set_board_tile_black(board, x, y);
  }
}

function solve_white_tiles_that_could_complete_illegal_black_square(board, x, y)
{
  if(white_tile_could_complete_illegal_black_square(board, x, y))
  {
    set_board_tile_dot(board, x, y);
  }
}

function solve_dot_tiles_touching_one_white_no_dot_and_no_number_tiles(board, x, y)
{
  if(get_number_of_white_neighbors(board, x, y) == 1 &&
     get_number_of_dot_neighbors(board, x, y) == 0 &&
     get_number_of_number_neighbors(board, x, y) == 0)
  {
    set_all_neighbors_dot(board, x, y);
  }
}

function surround_complete_white_pools_with_black_tiles(board, x, y)
{
  if(board[x][y] == get_white_pool_size(board, x, y))
  {
    set_all_white_pool_neighbors_black(board, x, y);
  }  
}

function extend_black_pools_with_one_white_neighbor(board, x, y)
{
  if(get_black_pool_white_neighbors(board, x, y).length == 1)
  {
    set_all_black_pool_neighbors_black(board, x, y);
  }
}

function extend_uncomplete_white_pools_with_one_white_neighbor(board, x, y)
{
  if(get_white_pool_white_neighbors(board, x, y).length == 1)
  {
    set_all_white_pool_neighbors_dot(board, x, y);
  }
}

function set_board_tile_black(board, x, y)
{
  if(is_white_tile(board, x, y))
  {
    board[x][y] = B;
  }
}

function set_board_tile_dot(board, x, y)
{
  if(is_white_tile(board, x, y))
  {
    board[x][y] = D;
  }
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
  return x >= 0 &&
         y >= 0 &&
         x < board.length &&
         y < board.length;
}

function is_white_tile(board, x , y)
{
  return is_valid_tile(board, x , y) &&
         board[x][y] == W;
}

function is_black_tile(board, x , y)
{
  return is_valid_tile(board, x , y) &&
         board[x][y] == B;
}

function is_dot_tile(board, x , y)
{
  return is_valid_tile(board, x , y) &&
         board[x][y] == D;
}

function is_number_tile(board, x ,y)
{
  return is_valid_tile(board, x , y) &&
         board[x][y] >= 1;
}

function is_white_pool_tile(board, x, y)
{
  return is_dot_tile(board, x ,y) || 
         is_number_tile(board, x ,y);
}

function white_tile_could_complete_illegal_black_square(board, x, y)
{  
  const would_complete_top_left_corner = is_black_tile(board, x+1, y+1) &&
                                       is_black_tile(board, x+1, y) &&
                                       is_black_tile(board, x, y+1);
  const would_complete_top_right_corner = is_black_tile(board, x-1, y+1) &&
                                        is_black_tile(board, x-1, y) &&
                                        is_black_tile(board, x, y+1);
  const would_complete_bot_left_corner = is_black_tile(board, x+1, y-1) &&
                                       is_black_tile(board, x+1, y) &&
                                       is_black_tile(board, x, y-1);
  const would_complete_bot_right_corner = is_black_tile(board, x-1, y-1) &&
                                        is_black_tile(board, x-1, y) &&
                                        is_black_tile(board, x, y-1);
  
  return would_complete_top_left_corner ||
         would_complete_top_right_corner ||
         would_complete_bot_left_corner ||
         would_complete_bot_right_corner;
}

function get_neighbors(x, y)
{
  return [[x, y+1], 
          [x, y-1], 
          [x+1, y], 
          [x-1, y]];
}

function get_white_pool_neighbors(board, x, y)
{
  const white_pool_neighbors = [];
  for(const neighbor of get_neighbors(x, y))
  {
    if(is_white_pool_tile(board, neighbor[0], neighbor[1]))
    {
      white_pool_neighbors.push(neighbor);
    }
  }
  return white_pool_neighbors;
}

function get_black_neighbors(board, x, y)
{
  const black_neighbors = [];
  for(const neighbor of get_neighbors(x, y))
  {
    if(is_black_tile(board, neighbor[0], neighbor[1]))
    {
      black_neighbors.push(neighbor);
    }
  }
  return black_neighbors;
}

function get_white_neighbors(board, x, y)
{
  const white_neighbors = [];
  for(const neighbor of get_neighbors(x, y))
  {
    if(is_white_tile(board, neighbor[0], neighbor[1]))
    {
      white_neighbors.push(neighbor);
    }
  }
  return white_neighbors;
}

function get_black_pool_white_neighbors(board, x, y)
{
  black_pool_white_neighbors = [];
  for(const black_tile of get_black_pool(board, x, y))
  {
    for(const white_neighbor of get_white_neighbors(board, black_tile[0], black_tile[1]))
    {
      add_to_array_if_unique(black_pool_white_neighbors, white_neighbor);
    }
  }
  return black_pool_white_neighbors;
}

function get_white_pool_white_neighbors(board, x, y)
{
  white_pool_white_neighbors = [];
  for(const white_tile of get_white_pool(board, x, y))
  {
    for(const white_neighbor of get_white_neighbors(board, white_tile[0], white_tile[1]))
    {
      add_to_array_if_unique(white_pool_white_neighbors, white_neighbor);
    }
  }
  return white_pool_white_neighbors;
}

function get_number_of_black_neighbors(board, x , y)
{
  let count = 0;
  if(is_black_tile(board, x-1, y)) count++;
  if(is_black_tile(board, x+1, y)) count++;
  if(is_black_tile(board, x, y-1)) count++;
  if(is_black_tile(board, x, y+1)) count++;
  return count;
}

function get_number_of_white_neighbors(board, x , y)
{
  let count = 0;
  if(is_white_tile(board, x-1, y)) count++;
  if(is_white_tile(board, x+1, y)) count++;
  if(is_white_tile(board, x, y-1)) count++;
  if(is_white_tile(board, x, y+1)) count++;
  return count;
}

function get_number_of_dot_neighbors(board, x , y)
{
  let count = 0;
  if(is_dot_tile(board, x-1, y)) count++;
  if(is_dot_tile(board, x+1, y)) count++;
  if(is_dot_tile(board, x, y-1)) count++;
  if(is_dot_tile(board, x, y+1)) count++;
  return count;
}

function get_number_of_number_neighbors(board, x , y)
{
  let count = 0;
  if(is_number_tile(board, x-1, y)) count++;
  if(is_number_tile(board, x+1, y)) count++;
  if(is_number_tile(board, x, y-1)) count++;
  if(is_number_tile(board, x, y+1)) count++;
  return count;
}

function get_white_pool(board, x, y)
{
  const white_pool = [[x, y]];
  let previous_size = 0;
  while(white_pool.length != previous_size)
  {
    previous_size = white_pool.length;
    for(const tile of white_pool)
    {
      for(const pool_neighbor of get_white_pool_neighbors(board, tile[0], tile[1]))
      {
        add_to_array_if_unique(white_pool, pool_neighbor);
      }
    }
  }
  return white_pool;
}

function get_white_pool_size(board, x, y)
{
  return get_white_pool(board, x, y).length;
}

function set_all_white_pool_neighbors_black(board, x, y)
{
  for(const white_pool_tile of get_white_pool(board, x, y))
  {
    set_all_neighbors_black(board, white_pool_tile[0], white_pool_tile[1]);
  }
}

function set_all_black_pool_neighbors_black(board, x, y)
{
  for(const black_pool_tile of get_black_pool(board, x, y))
  {
    set_all_neighbors_black(board, black_pool_tile[0], black_pool_tile[1]);
  }
}

function set_all_white_pool_neighbors_dot(board, x, y)
{
  for(const white_pool_tile of get_white_pool(board, x, y))
  {
    set_all_neighbors_dot(board, white_pool_tile[0], white_pool_tile[1]);
  }
}

function get_black_pool(board, x, y)
{
  const black_pool = [[x, y]];
  let previous_size = 0;
  while(black_pool.length != previous_size)
  {
    previous_size = black_pool.length;
    for(const tile of black_pool)
    {
      for(const pool_neighbor of get_black_neighbors(board, tile[0], tile[1]))
      {
        add_to_array_if_unique(black_pool, pool_neighbor);
      }
    }
  }
  return black_pool;
}

function get_black_pool_size(board, x, y)
{
  return get_black_pool(board, x, y).length;
}

////////////////
// HTML board //
////////////////

function solve_html_board(html_board, 
                          solve_number_functions,
                          solve_white_functions,
                          solve_black_functions,
                          solve_dot_functions)
{
    const board = get_board_from_html_board(html_board);
    solve(board, 
          solve_number_functions,
          solve_white_functions,
          solve_black_functions,
          solve_dot_functions);
    update_html_board(board);
}

function get_board_from_html_board(html_board)
{
  const board_dimension = get_html_board_dimension(html_board);
  
  const board = new Array(board_dimension);
  for(let i=0; i<board_dimension; i++)
  {
    board[i] = new Array(board_dimension);
    for(let j=0; j<board_dimension; j++)
    {
      board[i][j] = get_html_board_tile_value(html_board, i, j);
    }
  }
  
  return board;
}

function get_html_board_tile_value(html_board, x, y)
{
  const html_board_tile = get_html_board_tile(html_board, x, y)
  
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
  const table_element = document.getElementById("NurikabeTable");
  const table_body = table_element.getElementsByTagName("tbody")[0];
  return table_body;
}

function update_html_board(board)
{
  for(let i=0; i<board.length; i++)
  {
    for(let j=0; j<board.length; j++)
    {
      if(board[i][j] == B)
      {
        set_html_board_black_tile(i, j)
      }
      
      if(board[i][j] == D)
      {
        set_html_board_dot_tile(i, j)
      }
    }
  }
}

function set_html_board_black_tile(x, y)
{
  const sender = document.getElementsByName("i_"+y+"_"+x)[0];  
  setImg(sender, "y");
}

function set_html_board_dot_tile(x, y)
{
  const sender = document.getElementsByName("i_"+y+"_"+x)[0];  
  setImg(sender, "x");
}

function set_html_board_white_tile(x, y)
{
  const sender = document.getElementsByName("i_"+y+"_"+x)[0];  
  setImg(sender, "n");
}

function get_html_board_tile(html_board, x, y)
{
  const html_board_rows = html_board.getElementsByTagName("tr");
  const html_board_tiles = html_board_rows[y].getElementsByTagName("td");
  const html_board_tile = html_board_tiles[x];
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
  if(!array1 || !array2)
  {
    return false;
  }
  
  if(array1.length != array2.length)
  {
    return false;
  }
  
  for(let i = 0; i<array1.length; i++) 
  {
    // Check if we have nested arrays
    if(array1[i] instanceof Array && array2[i] instanceof Array) 
    {
      // recurse into the nested arrays
      if(!are_arrays_equal(array1[i], array2[i]))
      {
        return false;
      }
    }
    else if(array1[i] != array2[i])
    {
      // Warning - two different object instances will never be equal: {x:20} != {x:20}
      return false;
    }
  }
  return true;
}

function array_contains(array, element)
{
  for(const array_element of array)
  {
    if(are_arrays_equal(array_element, element))
    {
      return true;
    }
  }
  return false;
}

function add_to_array_if_unique(array, element)
{
  if(!array_contains(array, element))
  {
    array.push(element);      
  }
}

function copy_array(array)
{
  return array.map(
    function(arr)
    {
      return arr.slice();
    });
}
