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
  console.log("All tests passed")
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
