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

function get_neighbors_count(board, x, y, b)
{
  const min_x = 0
  const min_y = 0
  const max_x = board.length
  const max_y = board.length - 1
  let count = 0
  if (x > min_x && get_number(board, x - 1, y) == b) count++
  if (x < max_x && get_number(board, x + 1, y) == b) count++
  if (y > min_y && get_number(board, x, y - 1) == b) count++
  if (y < max_y && get_number(board, x, y + 1) == b) count++
  return count
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
