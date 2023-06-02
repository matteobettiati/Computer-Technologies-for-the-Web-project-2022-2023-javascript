/**
 * Upload a new song in the data base
 */
(function () {
    document.getElementById("uploadSongButton").onclick = function(e){
       console.log("Upload a new song");

       //Take the closest form
       let form = e.target.closest("form");

        if(form.checkValidity()){
            //Take the fields of the form and check them
            let title = document.getElementById("title").value;
            let genre = document.getElementById("genre").value;
            let albumTitle = document.getElementById("albumTitle").value;
            let singer = document.getElementById("author").value;
            let publicationYear = document.getElementById("date").value;

            //Check if the publicationYear is valid
            if(isNaN(publicationYear)){
                document.getElementById("songError").textContent = "Publication year is not a number";
                return;
            }
            if(publicationYear > (new Date().getFullYear())){
                document.getElementById("songError").textContent = "Publication year not valid";
                return;
            }

            //Check if the genre is one of the type allowed
            if(!(genre === "Classic" || genre === "Pop" || genre ==="Rap" || genre === "Rock" || genre === "Jazz")){
                document.getElementById("songError").textContent = "Invalid genre";
                return;
            }

            //Check if some fields are too long
            if(title.length > 45 || albumTitle-length > 45 || singer.length > 45 || genre.length > 45){
                document.getElementById("songError").textContent = "Some values are too long";
                return;
            }

            makeCall("POST" , "UploadSongjs" , form ,
                function (x) {

                    if(x.readyState = XMLHttpRequest.DONE){
                        switch(x.status){
                            case 200:
								//playlistForm.show();  no
                                break;

                            case 403:
                                sessionStorage.removeItem("currentUser");
                                window.location.href = "login.html";
                                break;

                            default:
                                document.getElementById("songError").textContent = x.responseText;
                                break;
                        }
                    }
                }
            );

        }else{
            form.reportValidity();
        }
    };
})();