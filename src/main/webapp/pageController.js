{
	/**
	 * variables
	 */
	var welcomeMessage;
	var playlistMessage;
	var playlistForm;
	var playlistSongsToOrder;
	var songsInPlaylist;
	var songsNotInPlaylist;
	var nextButton;
	var previousButton;
	var sortingList;
	var song;
	var songInfos;
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

	


	function PlaylistMessage(messageContainer) {
		this.playlistName = "";
		this.messageContainer = messageContainer;

		this.setPlaylistName = function(playlistName) {
			this.playlistName = playlistName;

		}

		this.show = function() {
			this.messageContainer.textContent = "playlist: " + this.playlistName;
			this.messageContainer.style.display = "";
		}


		this.reset = function() {
			this.messageContainer.style.display = "none";
		}
	}



	function PlaylistSongsToOrder() {
		this.playlistId = null;
		this.songs = new Array();


		this.reset = function() {
			this.songs = [];
		}


		this.addSong = function(song) {
			this.songs.push(song);
		}
	}

	function NextButton(next) {
		this.next = next;

		this.show = function() {
			this.next.style.display = "";
		}

		this.hide = function() {
			this.next.style.display = "none";
		}
	}

	function PreviousButton(previous) {
		this.previous = previous;

		this.show = function() {
			this.previous.style.display = "";
		}

		this.hide = function() {
			this.previous.style.display = "none";
		}
	}


	function Song(id, title) {
		this.id = id;
		this.title = title;
	}
	
	function SongInfos(alertContainer, listContainer, listBodyContainer){
		this.alertContainer = alertContainer;
        this.listContainer = listContainer;
        this.listBodyContainer = listBodyContainer;
        this.songId = null;
        this.playlistId = null;

        this.reset = function() {
            this.listContainer.style.display = "none";
        }
        
        this.setVisible = function() {
        	this.listContainer.style.display = "";
        }
        
        this.show = function(songId , playlistId) {
            this.songId = songId;
            this.playlistId = playlistId;

            let self = this;

            makeCall("GET" , "GetSongInfos?songId=" + this.songId + "&playlistId=" + this.playlistId , null ,
                function(request) {
                    if(request.readyState == XMLHttpRequest.DONE){
                    	
                        switch(request.status){
                            case 200:
                                let songDetails = JSON.parse(request.responseText);
                                self.update(songDetails);
                                break;

                            case 403:
                                //Redirect to login.html and remove the username from the session
                                window.location.href = request.getResponseHeader("Location");
                                window.sessionStorage.removeItem("userName");
                                break;

                            default:
                                self.alertContainer.textContent = request.responseText;
                                break;
                        }
                    }
                }
            );
        }
        
        
        this.update = function(songInfos) {
            let row , titleCell , singerCell , albumTitleCell , publicationYearCell , genreCell , playCell;

            this.listBodyContainer.innerHTML = "";

            row = document.createElement("tr");

            titleCell = document.createElement("td");
            titleCell.appendChild(document.createTextNode(songInfos.songTitle));
            row.appendChild(titleCell);

            singerCell = document.createElement("td");
            singerCell.appendChild(document.createTextNode(songInfos.author));
            row.appendChild(singerCell);

            albumTitleCell = document.createElement("td");
            albumTitleCell.appendChild(document.createTextNode(songInfos.albumTitle));
            row.appendChild(albumTitleCell);

            publicationYearCell = document.createElement("td");
            publicationYearCell.appendChild(document.createTextNode(songInfos.publicationYear));
            row.appendChild(publicationYearCell);

            genreCell = document.createElement("td");
            genreCell.appendChild(document.createTextNode(songInfos.genre));
            row.appendChild(genreCell);

            playCell = document.createElement("audio");
            playCell.type = "audio/mpeg";
            playCell.controls = "controls"
            playCell.src = songInfos.base64String;
            row.appendChild(playCell);

            this.listBodyContainer.appendChild(row);
            this.listContainer.style.display = "";
        }
		
		
		
	}

	function SongsInPlaylist(alertContainer, listContainer, listBodyContainer) {
		this.alertContainer = alertContainer;
		this.listContainer = listContainer;
		this.listBodyContainer = listBodyContainer;
		this.playlistId = null;
		this.songs = null;
		this.block = 0;

		this.reset = function() {
			this.listContainer.style.display = "none";
			this.alertContainer.textContent = "";
		}

		this.show = function(playlistId) {
			this.playlistId = playlistId;
			let self = this;

			makeCall("GET", "GetSongsInPlaylist?playlistId=" + playlistId, null,
				function(request) {
					if (request.readyState == XMLHttpRequest.DONE) {



						switch (request.status) {
							case 200:
								let songsReceived = JSON.parse(request.responseText);

								if (songsReceived.length > 1) {
									document.getElementById("goToSortingPageButton").style.display = "";
								}
								else {
									document.getElementById("goToSortingPageButton").style.display = "none";
								}


								if (songsReceived.length == 0) {
									//Empty the body of the table
									self.listContainer.style.display = "none";
									self.listBodyContainer.innerHTML = "";
									handleButtons.hideBefore();
									handleButtons.hideNext();
									document.getElementById("songTableMessage").textContent = "No songs yet";
									return;
								}
								document.getElementById("songTableMessage").textContent = "";
								self.songs = songsReceived;


								//Set the playlistId
								playlistSongsToOrder.playlistId = self.playlistId;
								//Reset the array
								playlistSongsToOrder.reset();

								//Save song titles and ids
								self.songs.forEach(function(songToOrder) {
									//Create a new song object
									let song = new Song(songToOrder.songId, songToOrder.songTitle);
									//Add it to playlistSongsToOrder
									playlistSongsToOrder.addSong(song);
								});


								self.update(0);

								//Launch the autoClick to select a song to show
								//if (self.playlistId !== songInfos.playlistId) {
								//	self.autoClick();
								//}
								break;

							case 403:
								//Redirect to login.html and remove the username from the session
								window.location.href = request.getResponseHeader("Location");
								window.sessionStorage.removeItem("currentUser");
								break;

							default:
								self.alertContainer.textContent = request.responseText;
								break;
						}
					}
				}
			);
		}



		// creating the song in the html
		this.update = function(block) {
			this.block = block;
			//Elements of the table
			let row, internalTableCell, imageRow, imageCell, songNameRow, songNameCell, internalTable, anchor, linkText, image;
			//Save this to make it visible in the function
			let self = this;

			//Empty the body of the table
			this.listBodyContainer.innerHTML = "";

			let next = false;
			//Check block and set next
			if (block < 0 || !block) {
				block = 0;
			}

			/*if (block * 5 + 5 > this.songs.length) {       
				block = (this.songs.length / 5);

				//Save the integer
				this.block = parseInt(block.toString().split(".")[0]); */

			//}
			if ((block * 5 + 5) < this.songs.length) {
				next = true;
			}

			//Set the current block


			if (next)
				nextButton.show();
			else
				nextButton.hide();



			if (block > 0)
				previousButton.show();
			else
				previousButton.hide();


			let songsToShow;

			if (this.songs.length >= block * 5 + 5) {
				songsToShow = this.songs.slice(block * 5, block * 5 + 5); // [)     
			}

			else {
				songsToShow = this.songs.slice(block * 5, this.songs.length); // [)
			}

			//Create the main row of the external table
			row = document.createElement("tr");

			songsToShow.forEach(function(songToShow) {
				internalTableCell = document.createElement("td");
				internalTable = document.createElement("table");

				internalTableCell.appendChild(internalTable);

				//Row for the image
				imageRow = document.createElement("tr");
				//Row for the song title
				songNameRow = document.createElement("tr");

				internalTable.appendChild(imageRow);
				internalTable.appendChild(songNameRow);

				imageCell = document.createElement("td");
				songNameCell = document.createElement("td");

				imageRow.appendChild(imageCell);
				songNameRow.appendChild(songNameCell);

				image = document.createElement("img");
				imageCell.appendChild(image);

				image.src = songToShow.base64String;
				
				image.classList.add("songsImage");

				anchor = document.createElement("a");
				songNameCell.appendChild(anchor);
				linkText = document.createTextNode(songToShow.songTitle);
				anchor.appendChild(linkText);
				anchor.setAttribute("idSong", songToShow.songId);
				anchor.href = "#";
				anchor.onclick = function(e) {
					showPage("playerpage");
					songInfos.show(e.target.getAttribute("idSong"), songsInPlaylist.playlistId);
				}

				row.appendChild(internalTableCell);
			});
			this.listBodyContainer.appendChild(row);
			this.listContainer.style.display = "";
		}


	}
	
	function SongsNotInPlaylist(alertContainer, listFieldset, listContainer, select) {
		this.alertContainer = alertContainer;
		this.listFieldset = listFieldset;
		this.listContainer = listContainer;
		this.select = select;
		this.playlistId = null;

		this.reset = function() {
			this.listContainer.style.display = "none";
			this.alertContainer.textContent = "";
		}

		this.setVisible = function() {
			this.listContainer.style.display = ""
		}

		this.show = function(playlistId) {
			this.playlistId = playlistId;
			let self = this;

			makeCall("GET", "GetSongsNotInPlaylist?playlistId=" + playlistId, null,
				function(request) {
					if (request.readyState == XMLHttpRequest.DONE) {

						switch (request.status) {
							case 200:
								let songs = JSON.parse(request.responseText);
								console.log(songs);
								if (songs.length == 0) {
									self.listFieldset.style.display = "none";
									document.getElementById("addSongMessage").textContent = "All songs already in this playList";
									return;
								}
								document.getElementById("addSongMessage").textContent = "";
								self.update(songs);
								break;

							case 403:
								//Redirect to login.html and remove the username from the session
								window.location.href = request.getResponseHeader("Location");
								window.sessionStorage.removeItem("userName");
								break;

							default:
								self.alertContainer.textContent = request.responseText;
								break;
						}
					}
				}
			);
		}

		this.update = function(songsToShow) {

			let option;

			this.select.innerHTML = "";

			let self = this;

			//Add an option for each song
			songsToShow.forEach(function(songToShow) {
				option = document.createElement("option");
				option.setAttribute("value", songToShow.idSong);
				option.appendChild(document.createTextNode(songToShow.title));
				self.select.appendChild(option);
			});
			this.listFieldset.style.display = "";
			this.listContainer.style.display = "";
		}
	}
	
	
	
	


	function SortingList(alertContainer, divContainer, listContainer, listBodyContainer) {
		this.alertContainer = alertContainer;
		this.divContainer = divContainer;
		this.listContainer = listContainer;
		this.listBodyContainer = listBodyContainer;
		this.playlistId = null;

		this.setPlaylistId = function(playlistId) {
			this.playlistId = playlistId;
		}

		this.reset = function() {
			this.divContainer.style.display = "none";
			this.alertContainer.textContent = "";
		}

		this.show = function() {
			let self = this;

			// Empty the table
			while (this.listBodyContainer.firstChild) {
				this.listBodyContainer.removeChild(this.listBodyContainer.firstChild);
			}

			for (let i = 0; i < playlistSongsToOrder.songs.length; i++) {
				let song = playlistSongsToOrder.songs[i];

				let row = document.createElement("tr");
				row.className = "draggable";
				row.setAttribute("songId", song.id);
				row.draggable = true;

				let dataCell = document.createElement("td");
				let nameCell = document.createTextNode(song.title);
				dataCell.appendChild(nameCell);
				row.appendChild(dataCell);

				self.listBodyContainer.appendChild(row);
			}

			this.divContainer.style.display = "";

			// Add drag and drop event listeners
			const rows = document.querySelectorAll(".draggable");

			rows.forEach((row) => {
				row.addEventListener("dragstart", handleDragStart, false);
				row.addEventListener("dragenter", handleDragEnter, false);
				row.addEventListener("dragover", handleDragOver, false);
				row.addEventListener("dragleave", handleDragLeave, false);
				row.addEventListener("drop", handleDrop, false);
				row.addEventListener("dragend", handleDragEnd, false);
			});
		}

		let dragSrcElement = null;

		function handleDragStart(e) {
			dragSrcElement = this;
			e.dataTransfer.effectAllowed = "move";
			e.dataTransfer.setData("text/html", this.outerHTML);
			this.classList.add("dragging");
		}

		function handleDragOver(e) {
			if (e.preventDefault) {
				e.preventDefault();
			}
			e.dataTransfer.dropEffect = "move";
			return false;
		}

		function handleDragEnter() {
			this.classList.add("over");
		}

		function handleDragLeave() {
			this.classList.remove("over");
		}

		function handleDrop(e) {
			if (e.stopPropagation) {
				e.stopPropagation();
			}
			if (dragSrcElement !== this) {
				const isDraggedFromAbove = Array.from(this.parentNode.children).indexOf(dragSrcElement) < Array.from(this.parentNode.children).indexOf(this);

				const dropPosition = isDraggedFromAbove ? this.nextSibling : this;

				if (dropPosition !== dragSrcElement) {
					this.parentNode.removeChild(dragSrcElement);
					this.parentNode.insertBefore(dragSrcElement, dropPosition);
				}

				const dropElem = isDraggedFromAbove ? this.nextSibling : this.previousSibling;
				
			}
			this.classList.remove("over");
			return false;
		}

		function handleDragEnd() {
			this.classList.remove("dragging");
		}

		
	}



	function Playlists(alertContainer, playlistContainer, playlistsContainerBody) {
		this.alertContainer = alertContainer;
		this.playlistContainer = playlistContainer;
		this.playlistsContainerBody = playlistsContainerBody;

		this.reset = function() {
			this.listContainer.style.disply = "none";
			this.alertContainer.textContent = "";
		}

		this.setVisible = function() {
			this.listContainer.style.display = "";
		}

		this.show = function() {
			let self = this;

			//Ask the playlist table to the server
			makeCall("GET", "GetPlaylists", null,
				function(request) {

					if (request.readyState == XMLHttpRequest.DONE) {

						switch (request.status) {
							case 200:
								let playlistsToShow = JSON.parse(request.responseText);

								if (playlistsToShow.length == 0) {
									document.getElementById("playlistTableMessage").textContent = "No playlist yet";
									self.listContainer.style.display = "none";
									return;
								}
								document.getElementById("playlistTableMessage").textContent = "";
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



	function playlistsUpdate(playlistToShow) {
		var table = document.getElementById("playlistContainer");
		var tbody = document.getElementById("playlistsContainerBody");

		tbody.innerHTML = "";

		playlistToShow.forEach(function(playlist) {
			var newRow = document.createElement("tr");

			var cell1 = document.createElement("td");
			var anchor = document.createElement("a");
			anchor.textContent = playlist.title;
			anchor.setAttribute("playlistId", playlist.idPlaylist);
			cell1.appendChild(anchor);
			newRow.appendChild(cell1);

			anchor.onclick = function(e) {

				// setting empty array for the songs in the playlist
				playlistSongsToOrder.reset();

				songsInPlaylist.show(e.target.getAttribute("playlistId"));

				songsNotInPlaylist.show(e.target.getAttribute("playlistId"));


				let targetRow = e.target.closest("tr");       //Row of the event
				let targetTitles = targetRow.getElementsByTagName("a");
				let targetTitle = targetTitles[0].innerHTML;  //Take the first td -> the title
				playlistMessage.setPlaylistName(targetTitle);
				showPage("playlistpage");
				document.getElementById("addSongToPlaylistDiv").style.display = "block";
				playlistMessage.show();



			}
			//Disable the href of the anchor
			anchor.href = "#";


			var cell2 = document.createElement("td");
			cell2.textContent = playlist.creationDate;
			newRow.appendChild(cell2);

			tbody.appendChild(newRow);
		});
	}


	function showPage(divToView) {

		var divs = document.getElementsByTagName("div");
		for (var i = 0; i < divs.length; i++) {

			if (divs[i].id === divToView || divs[i].id === "logout") {
				divs[i].style.display = "block";
			} else {
				divs[i].style.display = "none";
			}
		}
	}


	/*
	 * handle the entire page
	 */
	function PageHandler() {
		this.start = function() {
			showPage("homepage");
			playlistForm = new PlaylistForm(document.getElementById("checkBoxContainer"));
			playlistForm.show();

			playlistSongsToOrder = new PlaylistSongsToOrder();
			playlistMessage = new PlaylistMessage(document.getElementById("playlistNameMessage"));
			songsInPlaylist = new SongsInPlaylist(document.getElementById("songTableError"), document.getElementById("songTable"), document.getElementById("songTableBody"));
			songsNotInPlaylist = new SongsNotInPlaylist(document.getElementById("addSongError"), document.getElementById("addSongToPlaylistFieldset"),
				document.getElementById("addSongToPlaylistDiv"), document.getElementById("addSongToPlaylist"))

			nextButton = new NextButton(document.getElementById("next"));
			document.getElementById("next").onclick = function() {
				songsInPlaylist.update(songsInPlaylist.block + 1);
			}
			previousButton = new PreviousButton(document.getElementById("previous"))
			document.getElementById("previous").onclick = function() {
				songsInPlaylist.update(songsInPlaylist.block - 1);
			}

			sortingList = new SortingList(document.getElementById("sortingError"), document.getElementById("sortingpage"),
				document.getElementById("sortPlaylistTable"), document.getElementById("sortPlaylistBody"));
				
			 songInfos = new SongInfos(document.getElementById("songInfosError") ,
                                        document.getElementById("songpage") , document.getElementById("songInfosTableBody"));	
				


			document.getElementById("goToSortingPageButton").onclick = function() {
				showPage("sortingpage");
				sortingList.show();
			}
			document.getElementById("goToMainPageButton").onclick = function(){
				showPage("homepage");
			}
			document.getElementById("goToPlaylistPageButton").onclick = function(){
				showPage("playlistpage");
			}
			document.getElementById("goToHomepageButton").onclick = function(){
				showPage("homepage");
			}
			document.getElementById("confirmSortingButton").onclick = function(){
				
			}
			


			welcomeMessage = new WelcomeMessage(sessionStorage.getItem("currentUser"), document.getElementById("currentUser"));
			welcomeMessage.show();


			playlists = new Playlists(document.getElementById("alertContainer"),
				document.getElementById("playlistContainer"), document.getElementById("playlistsContainerBody"));

			playlists.show();



		}


	}
}