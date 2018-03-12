const sg = require('@sendgrid/mail');

exports.send = function(req, res){
	let returnEmail = req.body.email;
	let emailContents = req.body.message;
	sg.setApiKey('redacted');
	
	const msg = {
	  to: 'redacted',
	  from: 'redacted',
	  subject: 'Message received from ' + returnEmail,
	  text: emailContents,
	};
	
	sg.send(msg, function(error, result){
		if(error){
			
		}
		else{
			res.send(`
				<!DOCTYPE html>
					<html>
						<head>
							<script>
								setTimeout(function(){window.location.href = '/';}, 3000);
							</script>
						</head>
						<body>
							<h1>Message successfully sent</h1>
							<p>Click 
								<a href="/">here</a>
							   if you have not been redirected to the homepage within three seconds.
							 </p>
						</body>
					</html>
			`);
		}
	});
}