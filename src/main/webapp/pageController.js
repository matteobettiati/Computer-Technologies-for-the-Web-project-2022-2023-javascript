{
	/**
	 * variables
	 */
	var personalMessage;
	var pageHandler = new PageHandler();



	/**
	 *  starts the pageHandler
	 */
	window.addEventListener("load", () => {
		if (sessionStorage.getItem("currentUser") == null) {
			window.location.href = "login.html";
		} else {
			pageHandler.start();
			//pageHandler.refresh();
		}
	}, false);


	/**
	 * personal message for the welcome text
	 */
	function PersonalMessage(currentUser, messageContainer) {
		this.currentUser = currentUser;
		this.messageContainer = messageContainer;

		this.show = function() {
			this.messageContainer.textContent = this.currentUser;
		}

	}



	/**
	 * handle the entire page
	 */
	function PageHandler() {
		this.start = function() {
			personalMessage = new PersonalMessage(sessionStorage.getItem("currentUser"), document.getElementById("currentUser"));
			personalMessage.show();
				
			}

	}

}