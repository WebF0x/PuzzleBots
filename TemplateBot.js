var SOLVE_KEY_CODE = 83 //s

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
  let board = []
  return board
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
