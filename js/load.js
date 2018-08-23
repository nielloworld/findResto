
$('.sidebar')
  .sidebar('attach events', '.open.button', 'toggle')
  .sidebar('setting', 'onShow', function() {})
  // second call swaps in setting without re-init
  .sidebar('setting', 'dimPage', false)
  
;

function getDirection(){
    console.log("direction");
}