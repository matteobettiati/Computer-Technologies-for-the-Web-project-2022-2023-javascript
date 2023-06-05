(function() {
    document.getElementById("confirmSortingButton").addEventListener("click", (e) => {
        let rows = Array.from(document.getElementById("sortPlaylistTable").querySelectorAll('tbody > tr'));
        // Fill sortingToSend with the id of the songs
        let sortingToSend = [];

        for (let i = 0; i < rows.length; i++) {
            // Add just the id of the song
            sortingToSend.push(rows[i].getAttribute("songId"));
        }

        makeCall("POST", "SaveSorting?playlistId=" + playlistSongsToOrder.playlistId, null,
            function(request) {
                if (request.readyState == XMLHttpRequest.DONE) {
                    switch (request.status) {
                        case 200:
                            // Come back to the playlistpage
                            songsInPlaylist.show(songsInPlaylist.playlistId);
                            showPage("playlistpage");
                            break;

                        case 403:
                            sessionStorage.removeItem("currentUser");
                            window.location.href = "login.html";
                            break;

                        default:
                            document.getElementById("sortingError").textContent = request.responseText;
                            break;
                    }
                }
            }, sortingToSend
        );
    });
})();
