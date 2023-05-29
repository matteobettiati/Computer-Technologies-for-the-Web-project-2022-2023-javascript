{
	// variables
	var personalMessage;
	var pageHandler = new PageHandler();


	window.addEventListener("load", () => {
		if (sessionStorage.getItem("currentUser") == null) {
			window.location.href = "login.html";
		} else {
			pageHandler.start();
			//PageHandler.refresh();
		}
	}, false);







	function PersonalMessage(currentUser, messageContainer) {
		this.currentUser = currentUser;
		this.messageContainer = messageContainer;

		this.show = function() {
			this.messageContainer.textContent = this.currentUser;
		}

	}
	function PageHandler() {
		this.start = function() {
			personalMessage = new PersonalMessage(sessionStorage.getItem("currentUser"), document.getElementById("currentUser"));
			personalMessage.show();
		}

	}

}

