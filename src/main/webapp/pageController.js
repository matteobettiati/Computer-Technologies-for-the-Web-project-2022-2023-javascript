{
	/**
	 * variables
	 */
	var welcomeMessage;
	var pageHandler = new PageHandler();

	/**
	 *  starts the pageHandler
	 */
	window.addEventListener("load", () => {
		if (sessionStorage.getItem("currentUser") == null) {
			window.location.href = "login.html";
		} else {
			pageHandler.start();
		}
	}, false);


	/**
	 * personal message for the welcome text
	 */
	function WelcomeMessage(currentUser, messageContainer) {
		this.currentUser = currentUser;
		this.messageContainer = messageContainer;

		this.show = function() {
			this.messageContainer.textContent = this.currentUser;
		}

	}

	function Playlists(playlistsError, playlistBox, playlistsBody) {
		this.playlistsError = playlistsError;
		this.playlistBox = playlistBox;
		this.playlistsBody = playlistsBody;

		this.reset = function() {
			this.listContainer.style.disply = "none";
			this.alertContainer.textContent = "";
		}

		this.setVisible = function() {
			this.listContainer.style.display = "";
		}

		this.show = function() {
			let self = this;

			//Ask the playList table to the server
			makeCall("GET", "GetPlaylists", null,
				function(request) {

					if (request.readyState == XMLHttpRequest.DONE) {

						switch (request.status) {
							case 200:
								let playlistsToShow = JSON.parse(request.responseText);

								if (playlistsToShow.length == 0) {
									document.getElementById("playListTableMessage").textContent = "No playList yet";
									self.listContainer.style.display = "none";
									return;
								}
								document.getElementById("playListTableMessage").textContent = "";
								self.playlistsError.textContent = "";

								playlistsUpdate(playlistsToShow);

								break;

							case 403:
								//Redirect to login.html and remove the username from the session
								window.location.href = request.getResponseHeader("Location");
								window.sessionStorage.removeItem("userName");
								break;

							default:
								alert("Default");
								self.alertContainer.textContent = request.responseText;
						}
					}
				}
			);
		}
	}

	function showHomepage() {
		var divs = document.getElementsByTagName("div");
		for (var i = 0; i < divs.length; i++) {
			var div = divs[i];
			if (div.id === "homepage") {
				div.style.display = "block";
			} else {
				div.style.display = "none";
			}
		}
	}

	function playlistsUpdate(playlistToShow) {
		var table = document.getElementById("playlistBox");
		var tbody = document.getElementById("playlistsBody");

		var newRow = document.createElement("tr");

		tbody.innerHTML = "";


		playlistToShow.forEach(function(playlist) {
			var newRow = document.createElement("tr");

			var cell1 = document.createElement("td");
			cell1.textContent = playlist.title;
			newRow.appendChild(cell1);

			var cell2 = document.createElement("td");
			cell2.textContent = playlist.creationDate;
			newRow.appendChild(cell2);

			tbody.appendChild(newRow);
		});

		tbody.appendChild(newRow);

	}


	/**
	 * handle the entire page
	 */
	function PageHandler() {
		this.start = function() {
			showHomepage();

			welcomeMessage = new WelcomeMessage(sessionStorage.getItem("currentUser"), document.getElementById("currentUser"));
			welcomeMessage.show();

			playlists = new Playlists(document.getElementById("playlistsError"),
				document.getElementById("playlistBox"), document.getElementById("playlistsBody"));

			playlists.show();



		}


	}

}