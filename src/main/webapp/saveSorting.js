/**
 * save sorting chosen by user
 */
(function(){
	document.getElementById("confirmSortingButton").onclick() = function(e){
		let rows = Array.from(document.getElementById("sortPlayListTable").querySelectorAll('tbody > tr'));
        //Fill sortingToSend with the id of the songs
        let sortingToSend = new Array();

        for(let i = 0 ; i < rows.length ; i++){
            //Add just the id of the song
            sortingToSend.push(rows[i].getAttribute("songId"));
        }
		
		
	}	
	
})();