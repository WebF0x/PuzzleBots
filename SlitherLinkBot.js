var SOLVE_KEY_CODE = 83 //s
var NUMBER_EMPTY = -1

var BoardCell = class BoardCell
{
  constructor(number, top_line, bottom_line, right_line, left_line)
  {
    this.number = number;
    this.top_line = top_line;
    this.bottom_line = bottom_line;
    this.right_line = right_line;
    this.left_line = left_line;
  }
}

var Board = class Board
{
  constructor(board_rows)
  {
    this.rows = board_rows;
    this.height = this.rows.length
    this.width = this.rows[0].length
  }
  get_cell(x, y)
  {
    return this.rows[y][x]
  }
  set_bottom_line(x, y, is_line_drawn)
  {
    this.get_cell(x, y).bottom_line = is_line_drawn
    if (y < this.height - 1)
    {
      this.get_cell(x, y + 1).top_line = is_line_drawn
    }
  }
  set_top_line(x, y, is_line_drawn)
  {
    this.get_cell(x, y).top_line = is_line_drawn
    if (y > 0)
    {
      this.get_cell(x, y - 1).bottom_line = is_line_drawn
    }
  }
  set_right_line(x, y, is_line_drawn)
  {
    this.get_cell(x, y).right_line = is_line_drawn
    if (x < this.width - 1)
    {
      this.get_cell(x + 1, y).left_line = is_line_drawn
    }
  }
  set_left_line(x, y, is_line_drawn)
  {
    this.get_cell(x, y).left_line = is_line_drawn
    if (x > 0)
    {
      this.get_cell(x - 1, y).right_line = is_line_drawn
    }
  }
}

if(!has_run_before)
{
  document.addEventListener("keyup", key_up, false)
  var has_run_before = true
}

(function main()
{
  run_all_tests()
})()

function run_all_tests()
{
  test_get_cell()
  test_set_lines_on_extremities()
  test_setting_a_cells_line_also_updates_the_implicated_neighbor()
  console.log("All tests passed")
}

function test_get_cell()
{
  const top_row = ["top_left", "top_right"]
  const bottom_row = ["bottom_left", "bottom_right"]
  const board = new Board([top_row, bottom_row])
  assert(board.get_cell(0, 0) == "top_left", "Should return the top left cell")
  assert(board.get_cell(1, 0) == "top_right", "Should return the top right cell")
  assert(board.get_cell(0, 1) == "bottom_left", "Should return the bottom left cell")
  assert(board.get_cell(1, 1) == "bottom_right", "Should return the bottom right cell")
}

function test_set_lines_on_extremities()
{
  const unique_cell = new BoardCell(1, false, false, false, false)
  const board = new Board([[unique_cell]])
  board.set_top_line(0, 0, true)
  assert(board.get_cell(0, 0).top_line == true, "Top line should be set")
  board.set_bottom_line(0, 0, true)
  assert(board.get_cell(0, 0).bottom_line == true, "Bottom line should be set")
  board.set_right_line(0, 0, true)
  assert(board.get_cell(0, 0).right_line == true, "Right line should be set")
  board.set_left_line(0, 0, true)
  assert(board.get_cell(0, 0).left_line == true, "Left line should be set")
}

function test_setting_a_cells_line_also_updates_the_implicated_neighbor()
{
  const top_left = new BoardCell(1, false, false, false, false)
  const top_right = new BoardCell(2, false, false, false, false)
  const bottom_left = new BoardCell(3, false, false, false, false)
  const bottom_right = new BoardCell(4, false, false, false, false)
  const top_row = [top_left, top_right]
  const bottom_row = [bottom_left, bottom_right]
  const board = new Board([top_row, bottom_row])
  board.set_bottom_line(0, 0, true)
  assert(board.get_cell(0, 1).top_line == true, "Top line should be updated when setting the above cell's bottom line")
  board.set_top_line(0, 1, false)
  assert(board.get_cell(0, 0).bottom_line == false, "Bottom line should be updated when setting the below cell's top line")
  board.set_right_line(0, 0, true)
  assert(board.get_cell(1, 0).left_line == true, "Left line should be updated when setting the left cell's right line")
  board.set_left_line(1, 0, false)
  assert(board.get_cell(0, 0).right_line == false, "Right line should be updated when setting the right cell's left line")
}

function key_up(event)
{
  if(event.keyCode == SOLVE_KEY_CODE)
  {
    console.log("Solving")
    solve()
  }
}

function solve()
{
  const html_board = get_html_board()
  const board = get_board(html_board)
}

function get_html_board()
{
  return document.getElementById("LoopTable")
}

function get_board(html_board)
{
  const html_board_tbody = html_board.tBodies[0]
  const nb_html_rows = html_board_tbody.rows.length
  // Numbers are in the odd rows only
  let board = []
  for (y = 1; y < nb_html_rows; y += 2)
  {
    const board_cells_row = get_html_row(html_board_tbody, y)
    board.push(board_cells_row)
  }
  return board
}

function get_html_row(html_board_tbody, y)
{
  const nb_html_columns = html_board_tbody.rows[y].cells.length
  let board_cells_row = []
  // Numbers are in the odd columns only
  for (x = 1; x < nb_html_columns; x += 2)
  {
    boardCell = html_to_board_cell(html_board_tbody, x, y)
    board_cells_row.push(boardCell)
  }
  return board_cells_row
}

function html_to_board_cell(html_board_tbody, x, y)
{
  const html_rows = html_board_tbody.rows
  const html_cell = html_rows[y].cells[x]
  const html_cell_text = html_cell.innerText
  const number = html_cell_text ? parseInt(html_cell_text) : NUMBER_EMPTY
  const top_line = is_html_line_drawn(html_rows[y - 1].cells[x])
  const bottom_line = is_html_line_drawn(html_rows[y + 1].cells[x])
  const left_line = is_html_line_drawn(html_rows[y].cells[x - 1])
  const right_line = is_html_line_drawn(html_rows[y].cells[x + 1])
  const boardCell = new BoardCell(number, top_line, bottom_line, right_line, left_line)
  return boardCell
}

function is_html_line_drawn(html_line_cell)
{
  const html_image_element = html_line_cell.childNodes[0]
  const image_url = html_image_element.src
  const is_line_drawn = image_url.includes("yh.gif") || image_url.includes("yv.gif")
  return is_line_drawn
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

function add_to_array_if_unique(array, element)
{
  if(!array_contains(array, element))
  {
    array.push(element);
  }
}
