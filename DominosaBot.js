var REVERSE_CYCLE_HIGHLIGHTER_KEY_CODE = 68; //d
var CYCLE_HIGHLIGHTER_KEY_CODE = 70; //f
var RESET_HIGHLIGHTER_KEY_CODE = 82; //r

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
  else if(event.keyCode == REVERSE_CYCLE_HIGHLIGHTER_KEY_CODE)
  {
    reverse_cycle_highlighter();
  }
  else if(event.keyCode == RESET_HIGHLIGHTER_KEY_CODE)
  {
    reset_highlighter_index();
  } 
}

function get_max_highlighter_index(left_or_right)
{
  const left_highlighter_select = get_highlighter_select("left");
  const index_of_max_number = left_highlighter_select.length - 1;
  return (left_or_right === "left") ? index_of_max_number - 1 : index_of_max_number; 
}

function get_min_highlighter_index(left_or_right)
{
  return (left_or_right === "left") ? 1 : 2; 
}

function cycle_highlighter()
{
  console.log("Incrementing the highlighter");
  
  let left = get_highlighter_select("left")
  let right = get_highlighter_select("right")
  
  const right_max_index = get_max_highlighter_index("right");
  const left_max_index = get_max_highlighter_index("left");

  const both_indexes_at_max = (left.selectedIndex == left_max_index) && (right.selectedIndex == right_max_index);
  const right_is_greater_than_left = (right.selectedIndex > left.selectedIndex );
  const need_to_reset_index = !is_valid_highlighter_index("left") || !is_valid_highlighter_index("right") || both_indexes_at_max || !right_is_greater_than_left;
  if(need_to_reset_index)
  {
    reset_highlighter_index();
    return;
  }

  right.selectedIndex++;
  if(!is_valid_highlighter_index("right"))
  {
    left.selectedIndex++;
    if(!is_valid_highlighter_index("left"))
    {
      reset_highlighter_index();
      return;
    }
    right.selectedIndex = left.selectedIndex + 1;
  }
  highlightNumber();
}

function reverse_cycle_highlighter()
{
  console.log("Decrementing the highlighter");
  
  let left = get_highlighter_select("left")
  let right = get_highlighter_select("right")
  
  const right_max_index = get_max_highlighter_index("right");
  const left_max_index = get_max_highlighter_index("left");
  const right_min_index = get_min_highlighter_index("right");
  const left_min_index = get_min_highlighter_index("left");
  
  const right_is_greater_than_left = (right.selectedIndex > left.selectedIndex );
  const need_to_reset_index = !is_valid_highlighter_index("left") || !is_valid_highlighter_index("right") || !right_is_greater_than_left;
  if(need_to_reset_index)
  {
    reset_highlighter_index();
    return;
  }

  right.selectedIndex--;
  if(!is_valid_highlighter_index("right") || right.selectedIndex == left.selectedIndex)
  {
    left.selectedIndex--;
    if(!is_valid_highlighter_index("left"))
    {
      left.selectedIndex = left_max_index;
      right.selectedIndex = right_max_index;
      highlightNumber();
      return;
    }
    right.selectedIndex = right_max_index;
  }
  highlightNumber();
}

function is_valid_highlighter_index(left_or_right)
{
  const index = get_highlighter_select(left_or_right).selectedIndex;
  const min = get_min_highlighter_index(left_or_right);
  const max = get_max_highlighter_index(left_or_right);
  return (1 <= index) && (index <= max);
}

function reset_highlighter_index()
{
  console.log("Resetting the highlighter");
  
  get_highlighter_select("left").selectedIndex = get_min_highlighter_index("left");
  get_highlighter_select("right").selectedIndex = get_min_highlighter_index("right");
  highlightNumber();
}
