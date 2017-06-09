var CYCLE_HIGHLIGHTER_KEY_CODE = 70;

if(!has_run_before)
{
  var has_run_before = false;
}

(function main()
{
  if(!has_run_before)
    document.addEventListener("keyup", key_up, false);
  has_run_before = true;
})();

function key_up(event)
{
  if(event.keyCode == CYCLE_HIGHLIGHTER_KEY_CODE)
  {
    cycle_highlighter();
  } 
}

function cycle_highlighter()
{
  console.log("Incrementing the highlighter");
  
  let left_select = document.getElementById('selectNumber');
  let right_select = document.getElementById('selectNumberG');
  
  const right_max_index = left_select.length - 1;
  const left_max_index = right_max_index - 1;
  
  function is_valid_left_index()
  {
    return (1 <= left_select.selectedIndex) && (left_select.selectedIndex <= left_max_index);
  }
  
  function is_valid_right_index()
  {
    return (1 <= right_select.selectedIndex) && (right_select.selectedIndex <= right_max_index);
  }

  const both_indexes_at_max = (left_select.selectedIndex == left_max_index) && (right_select.selectedIndex == right_max_index);
  const right_is_greater_than_left = (right_select.selectedIndex > left_select.selectedIndex );
  const need_to_reset_index = !is_valid_left_index() || !is_valid_right_index() || both_indexes_at_max || !right_is_greater_than_left;
  if(need_to_reset_index)
  {
    reset_highlighter_index();
    return;
  }

  right_select.selectedIndex++;
  if(!is_valid_right_index())
  {
    left_select.selectedIndex++;
    if(!is_valid_left_index())
    {
      reset_highlighter_index();
      return;
    }
    right_select.selectedIndex = left_select.selectedIndex + 1;
  }
  highlightNumber();
}

function reset_highlighter_index()
{
  let left_select = document.getElementById('selectNumber');
  let right_select = document.getElementById('selectNumberG');
  left_select.selectedIndex = 1;
  right_select.selectedIndex = 2;
  highlightNumber();
}
