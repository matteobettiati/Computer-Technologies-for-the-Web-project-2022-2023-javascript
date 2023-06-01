/**
 * Add a song in a playList
 */
(function() {
	document.getElementById("addSongButton").onclick = function(e) {

		//Take the closest form
		let form = e.target.closest("form");

		//Reset the error
		document.getElementById("addSongMessage").textContent = "";

		if (form.checkValidity()) {
			makeCall("POST", "AddSongToPlaylist?playlistId=" + songsNotInPlaylist.playlistId, form,
				function(request) {

					if (request.readyState == XMLHttpRequest.DONE) {

						switch (request.status) {
							case 200:
								
								//Update the view
								songsInPlaylist.show(songsNotInPlaylist.playlistId);
								songsNotInPlaylist.show(songsNotInPlaylist.playlistId);
								break;

							case 403:
								sessionStorage.removeItem("userName");
								window.location.href = "login.html";
								break;

							default:
								document.getElementById("addSongMessage").textContent = request.responseText;
								break;
						}
					}
				}
			);
		} else {
			form.reportValidity();
		}
	};
})();