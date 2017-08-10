var REVERSE_CYCLE_HIGHLIGHTER_KEY_CODE = 68 //d
var CYCLE_HIGHLIGHTER_KEY_CODE = 70 //f
var RESET_HIGHLIGHTER_KEY_CODE = 82 //r
var SOLVE_UNIQUE_PAIRS_KEY_CODE = 83 //s

if(!has_run_before)
{
  var has_run_before = false
}

(function main()
{
  run_all_tests()
  if(!has_run_before)
    document.addEventListener("keyup", key_up, false)
  has_run_before = true
  
  reset_highlighter_index()
})()

function run_all_tests()
{
  test_get_number()
  test_get_neighbors_count()
  test_get_neighbors()
  test_get_pairs_count()
  console.log("All tests passed")
}

function test_get_number()
{
  const board = [
    [1, 2],
    [3, 4]
  ]
  assert(1 == get_number(board, 0, 0))
  assert(2 == get_number(board, 1, 0))
  assert(3 == get_number(board, 0, 1))
  assert(4 == get_number(board, 1, 1))
}

function test_get_neighbors_count()
{
  const board = [
    [0, 1, 2, 0],
    [1, 0, 1, 1],
    [1, 1, 0, 1]
  ]
  assert(0 == get_neighbors_count(board, 0, 0, 9))
  assert(1 == get_neighbors_count(board, 3, 0, 1))
  assert(2 == get_neighbors_count(board, 0, 0, 1))
  assert(3 == get_neighbors_count(board, 2, 2, 1))
  assert(4 == get_neighbors_count(board, 1, 1, 1))
}

function test_get_neighbors()
{
  const board = [
    [0, 1, 2, 0],
    [1, 0, 1, 1],
    [1, 1, 0, 1]
  ]
  assert(get_neighbors(board, 0, 0, 9).length == 0)

  assert(array_contains(get_neighbors(board, 3, 0, 1), [3, 1]))

  assert(array_contains(get_neighbors(board, 0, 0, 1), [0, 1]))
  assert(array_contains(get_neighbors(board, 0, 0, 1), [1, 0]))

  assert(array_contains(get_neighbors(board, 2, 2, 1), [1, 2]))
  assert(array_contains(get_neighbors(board, 2, 2, 1), [2, 1]))
  assert(array_contains(get_neighbors(board, 2, 2, 1), [3, 2]))

  assert(array_contains(get_neighbors(board, 1, 1, 1), [1, 0]))
  assert(array_contains(get_neighbors(board, 1, 1, 1), [0, 1]))
  assert(array_contains(get_neighbors(board, 1, 1, 1), [1, 2]))
  assert(array_contains(get_neighbors(board, 1, 1, 1), [2, 1]))
}

function test_get_pairs_count()
{
  const board_0_pairs_of_0_1 = [
    [0, 2],
    [2, 0]
  ]
  const board_1_pairs_of_0_1 = [
    [0, 1],
    [0, 2]
  ]
  const board_2_pairs_of_0_1 = [
    [0, 1],
    [0, 0]
  ]
  const board_0_pairs_of_1_1 = [
    [0, 1],
    [2, 3]
  ]
  const board_1_pairs_of_1_1 = [
    [0, 1],
    [2, 1]
  ]
  const board_2_pairs_of_1_1 = [
    [0, 1],
    [1, 1]
  ]
  const board_4_pairs_of_1_1 = [
    [1, 1],
    [1, 1]
  ]
  assert(0 == get_pairs_count(board_0_pairs_of_0_1, 0, 1))
  assert(1 == get_pairs_count(board_1_pairs_of_0_1, 0, 1))
  assert(2 == get_pairs_count(board_2_pairs_of_0_1, 0, 1))
  assert(0 == get_pairs_count(board_0_pairs_of_1_1, 1, 1))
  assert(1 == get_pairs_count(board_1_pairs_of_1_1, 1, 1))
  assert(2 == get_pairs_count(board_2_pairs_of_1_1, 1, 1))
  assert(4 == get_pairs_count(board_4_pairs_of_1_1, 1, 1))
}

function get_highlighter_select(left_or_right)
{
  let name = (left_or_right === "left") ? "selectNumber" : "selectNumberG"
  return document.getElementById(name)
}

function key_up(event)
{
  if(event.keyCode == CYCLE_HIGHLIGHTER_KEY_CODE)
  {
    cycle_highlighter()
  }
  else if(event.keyCode == REVERSE_CYCLE_HIGHLIGHTER_KEY_CODE)
  {
    reverse_cycle_highlighter()
  }
  else if(event.keyCode == RESET_HIGHLIGHTER_KEY_CODE)
  {
    reset_highlighter_index()
  }
  else if(event.keyCode == SOLVE_UNIQUE_PAIRS_KEY_CODE)
  {
    solve_unique_pair()
  } 
}

function get_max_highlighter_index(left_or_right)
{
  const left_highlighter_select = get_highlighter_select("left")
  const index_of_max_number = left_highlighter_select.length - 1
  return (left_or_right === "left") ? index_of_max_number - 1 : index_of_max_number 
}

function get_min_highlighter_index(left_or_right)
{
  return (left_or_right === "left") ? 1 : 2 
}

function get_min_number(board)
{
  return 0
}

function get_max_number(board)
{
  return board.length- 1
}

function cycle_highlighter()
{
  console.log("Incrementing the highlighter")
  
  if(!is_every_highlighter_indexes_valid())
  {
    reset_highlighter_index()
    return
  }

  let left = get_highlighter_select("left")
  let right = get_highlighter_select("right")
  
  right.selectedIndex++
  if(!is_valid_highlighter_index("right"))
  {
    left.selectedIndex++
    if(!is_valid_highlighter_index("left"))
    {
      reset_highlighter_index()
    }
    right.selectedIndex = left.selectedIndex + 1
  }
  highlightNumber()
}

function reverse_cycle_highlighter()
{
  console.log("Decrementing the highlighter")

  if(!is_every_highlighter_indexes_valid())
  {
    reset_highlighter_index()
    return
  }
  
  let left = get_highlighter_select("left")
  let right = get_highlighter_select("right")

  right.selectedIndex--
  if(!is_valid_highlighter_index("right") || right.selectedIndex <= left.selectedIndex)
  {
    left.selectedIndex--
    if(!is_valid_highlighter_index("left"))
    {
      left.selectedIndex = get_max_highlighter_index("left")
      right.selectedIndex = get_max_highlighter_index("right")
    }
    right.selectedIndex = get_max_highlighter_index("right")
  }
  highlightNumber()
}

function is_valid_highlighter_index(left_or_right)
{
  const index = get_highlighter_select(left_or_right).selectedIndex
  const min = get_min_highlighter_index(left_or_right)
  const max = get_max_highlighter_index(left_or_right)
  return (min <= index) && (index <= max)
}

function is_every_highlighter_indexes_valid()
{
  const left_index = get_highlighter_select("left").selectedIndex
  const right_index = get_highlighter_select("right").selectedIndex
  return is_valid_highlighter_index("left") && is_valid_highlighter_index("right") && (right_index > left_index )
}

function reset_highlighter_index()
{
  console.log("Resetting the highlighter")
  
  get_highlighter_select("left").selectedIndex = get_min_highlighter_index("left")
  get_highlighter_select("right").selectedIndex = get_min_highlighter_index("right")
  highlightNumber()
}

function solve_unique_pair()
{
  console.log("Solving unique pairs")
}

function get_pairs_count(board, a, b)
{
  let count = 0
  for(let y = 0; y < board.length; y++)
  {
    const row = board[y]
    for(let x = 0; x < row.length; x++)
    {
      const number = get_number(board, x, y)
      if(number == a)
      {
        count += get_neighbors_count(board, x, y, b)
      }
    }
  }
  if(a == b)
  {
    count /= 2
  }
  return count
}

function get_neighbors_count(board, x, y, b)
{
  return get_neighbors(board, x, y, b).length
}

function get_neighbors(board, x, y, b)
{
  const min_x = 0
  const min_y = 0
  const max_x = board.length
  const max_y = board.length - 1
  let neighbors = []
  if (x > min_x && get_number(board, x - 1, y) == b) neighbors.push([x - 1, y])
  if (x < max_x && get_number(board, x + 1, y) == b) neighbors.push([x + 1, y])
  if (y > min_y && get_number(board, x, y - 1) == b) neighbors.push([x, y - 1])
  if (y < max_y && get_number(board, x, y + 1) == b) neighbors.push([x, y + 1])
  return neighbors
}

function get_number(board, x, y)
{
  return board[y][x]
}

function get_html_board()
{
  return document.getElementById("DominosaTable")
}

function get_board(html_board)
{
  const html_tbody = html_board.getElementsByTagName("tbody")[0]
  const html_rows = html_tbody.getElementsByTagName("tr")
  let board = []
  for(const html_row of html_rows)
  {
    const html_cells = html_row.getElementsByTagName("td")
    let row = []
    for(const html_cell of html_cells)
    {
      const number = parseInt(html_cell.getElementsByTagName("div")[0].getElementsByTagName("div")[0].innerText)
      row.push(number)
    }
    board.push(row)
  }
  return board
}

function place_domino(x1, y1, x2, y2)
{
  placeHelper(x1, y1, x2, y2)
  removeHelper()
  placePiece()
}

/////////////
// Utility //
/////////////

function assert(condition, message)
{
  if(!condition)
  {
    alert(message)
  }
}

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
