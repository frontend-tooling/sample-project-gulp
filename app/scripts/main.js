var entryNo = $('#todos li').length;

$('form').on('submit', function(e) {
	e.preventDefault();
	var todo = $('#todo').val();
	var str = [];
	str.push('<li><input type="checkbox" id="cb');
	entryNo++;
	str.push(entryNo);
	str.push('"><label for="cb');
	str.push(entryNo);
	str.push('">');
	str.push(todo);
	str.push('</li>');
	$('#todos').append(str.join(''));
	$('#todo').val('');
	return false;
});
