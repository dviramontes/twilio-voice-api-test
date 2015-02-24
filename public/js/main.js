$("#btn").on('click', function(e){
	e.preventDefault();
	$.get('/makecall',{
			msg: $('#msg').val()
		})
		.then(function(res){
			alert(res)
			console.log(res);
		});
})