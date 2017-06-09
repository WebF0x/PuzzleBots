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
  
  if(!is_every_highlighter_indexes_valid())
  {
    reset_highlighter_index();
    return;
  }

  let left = get_highlighter_select("left");
  let right = get_highlighter_select("right");
  
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

  if(!is_every_highlighter_indexes_valid())
  {
    reset_highlighter_index();
    return;
  }
  
  let left = get_highlighter_select("left");
  let right = get_highlighter_select("right");

  right.selectedIndex--;
  if(!is_valid_highlighter_index("right") || right.selectedIndex == left.selectedIndex)
  {
    left.selectedIndex--;
    if(!is_valid_highlighter_index("left"))
    {
      left.selectedIndex = get_max_highlighter_index("left");
      right.selectedIndex = get_max_highlighter_index("right");
      highlightNumber();
      return;
    }
    right.selectedIndex = get_max_highlighter_index("right");
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

function is_every_highlighter_indexes_valid()
{
  const left_index = get_highlighter_select("left").selectedIndex;
  const right_index = get_highlighter_select("right").selectedIndex;
  return is_valid_highlighter_index("left") && is_valid_highlighter_index("right") && (right_index > left_index );
}

function reset_highlighter_index()
{
  console.log("Resetting the highlighter");
  
  get_highlighter_select("left").selectedIndex = get_min_highlighter_index("left");
  get_highlighter_select("right").selectedIndex = get_min_highlighter_index("right");
  highlightNumber();
}
