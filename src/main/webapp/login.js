/**
 * Login
 */
(function () {
	document.getElementById("loginForm").onsubmit = (e) =>{
		e.preventDefault();
		console.log("Login event!");
		
		
		let form = document.getElementById("loginForm");
		
	
		//Check if the form is valid -> every field is been filled
		if (form.checkValidity()) {
	
			//Make the call to the server
			makeCall("POST", 'CheckLogin', form,
				function(x) {
	
					if (x.readyState == XMLHttpRequest.DONE) {
						let user = x.responseText;
						switch (x.status) {
							//If ok -> set the userName in the session
							case 200:
								sessionStorage.setItem('currentUser', user);
								window.location.href = "homepage.html";
								break;
							//If ko -> show the error
							default:
								document.getElementById("error").textContent = user;
								break;
						}
					}
				}
			);
		} else {
			form.reportValidity();
			
		};
	};
})();