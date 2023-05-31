{
	/**
	 * variables
	 */
	var welcomeMessage;
	var playlists;
	var playlistForm;
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

	function Playlists(alertContainer, playlistsContainer, playlistsContainerBody) {
		this.alertContainer = alertContainer;
		this.playlistsContainer = playlistsContainer;
		this.playlistsContainerBody = playlistsContainerBody;

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
								self.alertContainer.textContent = "";

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
			if (div.id === "homepage" || div.id === "logout") {
				div.style.display = "block";
			} else {
				div.style.display = "none";
			}
		}
	}

	function playlistsUpdate(playlistToShow) {
		var table = document.getElementById("playlistsContainer");
		var tbody = document.getElementById("playlistsContainerBody");

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

	function PlaylistForm() {
		this.show = function() {
			var checkBoxContainer = document.getElementById("checkBoxContainer");

			makeCall("GET", "GetSongs", null,
				function(request) {
					if (request.readyState == XMLHttpRequest.DONE) {

						switch (request.status) {
							case 200:
								let songsToShow = JSON.parse(request.responseText);

								if (songsToShow.length == 0) {
									document.getElementById("songsToAddError").textContent = "No songs yet";
									return;
								}
								songsToShow.forEach(function(song) {
									var label = document.createElement("label");
									var checkbox = document.createElement("input");
									checkbox.type = "checkbox";
									checkbox.value=song;	
									checkbox.name="selectedSongs";
									checkbox.id="song";
									label.appendChild(checkbox);
									label.appendChild(document.createTextNode(song));
									checkBoxContainer.appendChild(label);
								})

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

	/**
	 * handle the entire page
	 */
	function PageHandler() {
		this.start = function() {
			showHomepage();

			welcomeMessage = new WelcomeMessage(sessionStorage.getItem("currentUser"), document.getElementById("currentUser"));
			welcomeMessage.show();

			playlists = new Playlists(document.getElementById("alertContainer"),
				document.getElementById("playlistsContainer"), document.getElementById("playlistsContainerBody"));
			playlists.show();

			playlistForm = new PlaylistForm(document.getElementById("checkBoxContainer"));
			playlistForm.show();
		}
	}
}