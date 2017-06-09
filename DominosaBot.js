var CYCLE_HIGHLIGHTER_KEY_CODE = 70;
var RESET_HIGHLIGHTER_KEY_CODE = 82;

if(!has_run_before)
{
  var has_run_before = false;
}

(function main()
{
  if(!has_run_before)
    document.addEventListener("keyup", key_up, false);
  has_run_before = true;
  
  reset_highlighter_index();
})();

function get_highlighter_select(left_or_right)
{
  let name = (left_or_right === "left") ? "selectNumber" : "selectNumberG";
  return document.getElementById(name);
}

function key_up(event)
{
  if(event.keyCode == CYCLE_HIGHLIGHTER_KEY_CODE)
  {
    cycle_highlighter();
  }
  else if(event.keyCode == RESET_HIGHLIGHTER_KEY_CODE)
  {
    reset_highlighter_index();
  } 
}

function cycle_highlighter()
{
  console.log("Incrementing the highlighter");
  
  let left = get_highlighter_select("left")
  let right = get_highlighter_select("right")
  
  const right_max_index = left.length - 1;
  const left_max_index = right_max_index - 1;
  
  function is_valid_left_index()
  {
    return (1 <= left.selectedIndex) && (left.selectedIndex <= left_max_index);
  }
  
  function is_valid_right_index()
  {
    return (1 <= right.selectedIndex) && (right.selectedIndex <= right_max_index);
  }

  const both_indexes_at_max = (left.selectedIndex == left_max_index) && (right.selectedIndex == right_max_index);
  const right_is_greater_than_left = (right.selectedIndex > left.selectedIndex );
  const need_to_reset_index = !is_valid_left_index() || !is_valid_right_index() || both_indexes_at_max || !right_is_greater_than_left;
  if(need_to_reset_index)
  {
    reset_highlighter_index();
    return;
  }

  right.selectedIndex++;
  if(!is_valid_right_index())
  {
    left.selectedIndex++;
    if(!is_valid_left_index())
    {
      reset_highlighter_index();
      return;
    }
    right.selectedIndex = left.selectedIndex + 1;
  }
  highlightNumber();
}

function reset_highlighter_index()
{
  console.log("Resetting the highlighter");
  
  get_highlighter_select("left").selectedIndex = 1;
  get_highlighter_select("right").selectedIndex = 2;
  highlightNumber();
}
