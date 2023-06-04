/**
 * create playlist form
 */
(function() {
	document.getElementById("createPlaylistButton").onclick = function(e) {

		console.log("Creating a new playlist!");

		//Take the closest form
		let form = e.target.closest("form");

		if (form.checkValidity()) {

			//Check if the title specified is valid
			var playlistTitle = document.getElementById("playlistTitle").value;
			var playlistRows = document.querySelectorAll("#playlistsContainerBody tr");

			for (var i = 0; i < playlistRows.length - 1; i++) {
				var playlistTitleCell = playlistRows[i].querySelector("td:first-child");

				if (playlistTitleCell.textContent === playlistTitle) {
					document.getElementById("createPlaylistError").textContent = "Playlist name already used";
					return;
				}
			}
			
			//Make the call to the server
			makeCall("POST", "CreatePlaylistjs", form,
				function(x) {

					if (x.readyState == XMLHttpRequest.DONE) {
						pageHandler.resetErrors();

						switch (x.status) {
							case 200:
								//Update the playlist list
								
								playlists.show();
								break;

							case 403:
								sessionStorage.removeItem("currentUser");
								window.location.href = "login.html";
								break;

							default:
								document.getElementById("createPlaylistError").textContent = x.responseText;
								break;
						}
					}
				}
			);
			//form.reset();
		} else {
			form.reportValidity();
		}
	};
})();