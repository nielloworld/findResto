
$('.sidebar')
.sidebar('attach events', '.open.button', 'show')
.sidebar('setting', 'onShow', function() {})
// second call swaps in setting without re-init
.sidebar('setting', 'dimPage', false)
;