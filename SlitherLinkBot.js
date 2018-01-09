var SOLVE_KEY_CODE = 83 //s
var NUMBER_NONE = "None"
var CellSideEnum = Object.freeze({None: "None", Line: "Line", Cross: "Cross"});

var BoardCell = class BoardCell
{
  constructor(number, top, bottom, right, left)
  {
    this.number = number;
    this.top = top;
    this.bottom = bottom;
    this.right = right;
    this.left = left;
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
  set_bottom(x, y, cell_side_type)
  {
    this.get_cell(x, y).bottom = cell_side_type
    if (y < this.height - 1)
    {
      this.get_cell(x, y + 1).top = cell_side_type
    }
  }
  set_top(x, y, cell_side_type)
  {
    this.get_cell(x, y).top = cell_side_type
    if (y > 0)
    {
      this.get_cell(x, y - 1).bottom = cell_side_type
    }
  }
  set_right(x, y, cell_side_type)
  {
    this.get_cell(x, y).right = cell_side_type
    if (x < this.width - 1)
    {
      this.get_cell(x + 1, y).left = cell_side_type
    }
  }
  set_left(x, y, cell_side_type)
  {
    this.get_cell(x, y).left = cell_side_type
    if (x > 0)
    {
      this.get_cell(x - 1, y).right = cell_side_type
    }
  }
  set_all_sides(x, y, cell_side_type)
  {
    this.set_bottom(x, y, cell_side_type)
    this.set_top(x, y, cell_side_type)
    this.set_right(x, y, cell_side_type)
    this.set_left(x, y, cell_side_type)
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
  test_get_board_size()
  test_get_cell()
  test_set_sides_on_board_extremities()
  test_setting_a_cells_side_also_updates_the_implicated_neighbor()
  test_set_all_sides_of_board_cell()
  test_compare_cells()
  test_compare_boards()
  test_mark_sides_of_zero_cells_with_cross()
  test_get_html_cell_side_name()
  console.log("All tests passed")
}

function test_get_board_size()
{
  const left_cell = new BoardCell(1, CellSideEnum.None, CellSideEnum.None, CellSideEnum.None, CellSideEnum.None)
  const right_cell = new BoardCell(2, CellSideEnum.None, CellSideEnum.None, CellSideEnum.None, CellSideEnum.None)
  const board = new Board([[left_cell, right_cell]])
  assert(2 == board.width, "Should be able to get the board width")
  assert(1 == board.height, "Should be able to get the board height")
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

function test_set_sides_on_board_extremities()
{
  const unique_cell = new BoardCell(1, CellSideEnum.None, CellSideEnum.None, CellSideEnum.None, CellSideEnum.None)
  const board = new Board([[unique_cell]])
  board.set_top(0, 0, CellSideEnum.Line)
  assert(board.get_cell(0, 0).top == CellSideEnum.Line, "Top line should be set")
  board.set_bottom(0, 0, CellSideEnum.Line)
  assert(board.get_cell(0, 0).bottom == CellSideEnum.Line, "Bottom line should be set")
  board.set_right(0, 0, CellSideEnum.Line)
  assert(board.get_cell(0, 0).right == CellSideEnum.Line, "Right line should be set")
  board.set_left(0, 0, CellSideEnum.Line)
  assert(board.get_cell(0, 0).left == CellSideEnum.Line, "Left line should be set")
}

function test_setting_a_cells_side_also_updates_the_implicated_neighbor()
{
  const top_left = new BoardCell(1, CellSideEnum.None, CellSideEnum.None, CellSideEnum.None, CellSideEnum.None)
  const top_right = new BoardCell(2, CellSideEnum.None, CellSideEnum.None, CellSideEnum.None, CellSideEnum.None)
  const bottom_left = new BoardCell(3, CellSideEnum.None, CellSideEnum.None, CellSideEnum.None, CellSideEnum.None)
  const bottom_right = new BoardCell(4, CellSideEnum.None, CellSideEnum.None, CellSideEnum.None, CellSideEnum.None)
  const top_row = [top_left, top_right]
  const bottom_row = [bottom_left, bottom_right]
  const board = new Board([top_row, bottom_row])
  board.set_bottom(0, 0, CellSideEnum.Line)
  assert(board.get_cell(0, 1).top == CellSideEnum.Line, "Top should be updated when setting the above cell's bottom")
  board.set_top(0, 1, CellSideEnum.Cross)
  assert(board.get_cell(0, 0).bottom == CellSideEnum.Cross, "Bottom should be updated when setting the below cell's top")
  board.set_right(0, 0, CellSideEnum.Line)
  assert(board.get_cell(1, 0).left == CellSideEnum.Line, "Left should be updated when setting the left cell's right")
  board.set_left(1, 0, CellSideEnum.Cross)
  assert(board.get_cell(0, 0).right == CellSideEnum.Cross, "Right should be updated when setting the right cell's left")
}

function test_set_all_sides_of_board_cell()
{
  const cell = new BoardCell(
    1,
    CellSideEnum.None,
    CellSideEnum.None,
    CellSideEnum.None,
    CellSideEnum.None)
  const expected_cell = new BoardCell(
    1,
    CellSideEnum.Cross,
    CellSideEnum.Cross,
    CellSideEnum.Cross,
    CellSideEnum.Cross)
  const board = new Board([[cell]])
  board.set_all_sides(0, 0, CellSideEnum.Cross)
  assert(
    are_cells_equal(expected_cell, board.get_cell(0, 0)),
    "All the sides of the cell should be set"
  )
}

function test_compare_cells()
{
  const cell = new BoardCell(
    1,
    CellSideEnum.None,
    CellSideEnum.None,
    CellSideEnum.None,
    CellSideEnum.None)
  const cell_copy = new BoardCell(
    1,
    CellSideEnum.None,
    CellSideEnum.None,
    CellSideEnum.None,
    CellSideEnum.None)
  const different_cell_number = new BoardCell(
    2,
    CellSideEnum.None,
    CellSideEnum.None,
    CellSideEnum.None,
    CellSideEnum.None)
  const different_cell_side = new BoardCell(
    1,
    CellSideEnum.Cross,
    CellSideEnum.None,
    CellSideEnum.None,
    CellSideEnum.None)
  assert(are_cells_equal(cell, cell_copy),
         "Identical cells should be equal");
  assert(!are_cells_equal(cell, different_cell_number),
         "Cells with a different number should not be equal");
  assert(!are_cells_equal(cell, different_cell_side),
         "Cells with a different side should not be equal");
}

function test_compare_boards()
{
  const cell_1 = new BoardCell(
    1,
    CellSideEnum.None,
    CellSideEnum.None,
    CellSideEnum.None,
    CellSideEnum.None)
  const board_1 = new Board([[cell_1]])

  const cell_1_copy = new BoardCell(
    1,
    CellSideEnum.None,
    CellSideEnum.None,
    CellSideEnum.None,
    CellSideEnum.None)
  const board_1_copy = new Board([[cell_1_copy]])

  const different_cell_number = new BoardCell(
    2,
    CellSideEnum.None,
    CellSideEnum.None,
    CellSideEnum.None,
    CellSideEnum.None)
  const different_board_number = new Board([[different_cell_number]])

  const different_cell_side = new BoardCell(
    1,
    CellSideEnum.Cross,
    CellSideEnum.None,
    CellSideEnum.None,
    CellSideEnum.None)
  const different_board_side = new Board([[different_cell_side]])

  assert(are_boards_equal(board_1, board_1_copy),
         "Boards should be equal");
  assert(!are_boards_equal(board_1, different_board_number),
         "Boards should not be equal if a cell's number is not equal");
  assert(!are_boards_equal(board_1, different_board_side),
         "Boards should not be equal if a cell's side is not equal");
}

function test_mark_sides_of_zero_cells_with_cross()
{
  const initial_zero_cell = new BoardCell(
    0,
    CellSideEnum.None,
    CellSideEnum.None,
    CellSideEnum.None,
    CellSideEnum.None)
  const board = new Board([[initial_zero_cell]])

  const expected_zero_cell = new BoardCell(
    0,
    CellSideEnum.Cross,
    CellSideEnum.Cross,
    CellSideEnum.Cross,
    CellSideEnum.Cross)
  const expected_board = new Board([[expected_zero_cell]])

  mark_sides_of_zero_cells_with_cross(board);

  assert(are_boards_equal(expected_board, board),
         "The sides of '0' cells should be marked with a cross");
}

function test_get_html_cell_side_name()
{
  assert("h_0_0" == get_html_cell_side_name(0, 0, "top"), "HTML cell name should be 'h_0_0'")
  assert("v_0_0" == get_html_cell_side_name(0, 0, "left"), "HTML cell name should be 'v_0_0'")
  assert("h_1_0" == get_html_cell_side_name(0, 0, "bottom"), "HTML cell name should be 'h_1_0'")
  assert("h_1_0" == get_html_cell_side_name(0, 1, "top"), "HTML cell name should be 'h_1_0'")
  assert("h_3_1" == get_html_cell_side_name(1, 2, "bottom"), "HTML cell name should be 'h_3_1'")
  assert("h_3_1" == get_html_cell_side_name(1, 3, "top"), "HTML cell name should be 'h_3_1'")
}

function mark_sides_of_zero_cells_with_cross(board)
{
  for(let x = 0; x < board.width; ++x)
  {
    for(let y = 0; y < board.height; ++y)
    {
      if(0 == board.get_cell(x, y).number)
      {
        board.set_all_sides(x, y, CellSideEnum.Cross)
      }
    }
  }
}

function get_html_cell_side_name(x, y, side_string)
{
  let direction = null
  if(side_string == "top" || side_string == "bottom")
  {
    direction = "h"
  }
  else if(side_string == "left" || side_string == "right")
  {
    direction = "v"
  }
  else
  {
    assert(false && "side_string must be a valid side")
  }

  let x_corrected = x
  if("right" == side_string)
  {
    x_corrected += 1
  }

  let y_corrected = y
  if("bottom" == side_string)
  {
    y_corrected += 1
  }

  const html_cell_side_name = direction + "_" + y_corrected + "_" + x_corrected
  return html_cell_side_name
}

function set_html_cell_side(x, y, side_string, side_type)
{
  const html_cell_side_name = get_html_cell_side_name(x, y, side_string)
  const sender = document.getElementsByName(html_cell_side_name)[0]
  let side_type_html = null
  switch(side_type)
  {
    case CellSideEnum.None:
      side_type_html = "n"
      break
    case CellSideEnum.Line:
      side_type_html = "y"
      break
    case CellSideEnum.Cross:
      side_type_html = "x"
      break
    default:
      assert(false && "Should pass a valid side type")
      break
  }
  setImg(sender, side_type_html);
}

function set_html_cell(x, y, cell)
{
  set_html_cell_side(x, y, "top", cell.top)
  set_html_cell_side(x, y, "bottom", cell.bottom)
  set_html_cell_side(x, y, "left", cell.left)
  set_html_cell_side(x, y, "right", cell.right)
}

function set_html_board(board)
{
  for(let x = 0; x < board.width; ++x)
  {
    for(let y = 0; y < board.height; ++y)
    {
      cell = board.get_cell(x, y)
      set_html_cell(x, y, cell)
    }
  }
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
  solve_board(board)
  set_html_board(board)
}

function solve_board(board)
{
  mark_sides_of_zero_cells_with_cross(board)
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
  let board_rows = []
  for (y = 1; y < nb_html_rows; y += 2)
  {
    const board_cells_row = get_html_row(html_board_tbody, y)
    board_rows.push(board_cells_row)
  }
  return new Board(board_rows)
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
  const number = html_cell_text ? parseInt(html_cell_text) : NUMBER_NONE
  const top = get_cell_side_from_html_element(html_rows[y - 1].cells[x])
  const bottom = get_cell_side_from_html_element(html_rows[y + 1].cells[x])
  const left = get_cell_side_from_html_element(html_rows[y].cells[x - 1])
  const right = get_cell_side_from_html_element(html_rows[y].cells[x + 1])
  const boardCell = new BoardCell(number, top, bottom, right, left)
  return boardCell
}

function get_cell_side_from_html_element(html_cell_side)
{
  const html_image_element = html_cell_side.childNodes[0]
  const image_url = html_image_element.src
  if (image_url.includes("yh.gif") || image_url.includes("yv.gif"))
  {
    return CellSideEnum.Line
  }
  if (image_url.includes("xh.gif") || image_url.includes("xv.gif"))
  {
    return CellSideEnum.Cross
  }
  return CellSideEnum.None
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

function are_cells_equal(cell_1, cell_2)
{
  return (
    cell_1.number == cell_2.number &&
    cell_1.top == cell_2.top &&
    cell_1.bottom == cell_2.bottom &&
    cell_1.right == cell_2.right &&
    cell_1.left == cell_2.left)
}

function are_boards_equal(board_1, board_2)
{
  if(
    board_1.height != board_2.height ||
    board_1.width != board_2.width)
  {
    return false
  }
  for(let x = 0; x < board_1.width; ++x)
  {
    for(let y = 0; y < board_1.height; ++y)
    {
      cell_1 = board_1.get_cell(x, y)
      cell_2 = board_2.get_cell(x, y)
      if(!are_cells_equal(cell_1, cell_2))
      {
        return false
      }
    }
  }
  return true
}
