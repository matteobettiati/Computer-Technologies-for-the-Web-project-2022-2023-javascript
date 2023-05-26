/**
 * Registration
 */
(function () {
    document.getElementById("signupButton").addEventListener('click' , (e) => {

        console.log("Registration event!");
        //Take the closest form
        let form = e.target.closest("form");
        //Reset the error
        document.getElementById("error").textContent = null;

        //Check the form validity
        if(form.checkValidity()){
			
            //Check the validity of the fields
            let user = document.getElementById("user").value;
            let password = document.getElementById("password").value;

            if(user.length > 45 || password.length > 45){
                document.getElementById("error").textContent = "username e/o password too long";
                return;
            }
            console.log("Validity ok");

            //Make the call to  the server
            makeCall("POST" , 'CheckSignUp' , form ,
                function (x) {

                    if(x.readyState == XMLHttpRequest.DONE){
                        switch(x.status){
                            //If ok -> redirect to login page
                            case 200:
                                window.location.href = "login.html";
                                break;
                            //If ko -> show the error
                            default:
                                document.getElementById("error").textContent = x.responseText;
                        }
                    }
                }
            );
        }else{
            form.reportValidity();
        }
    });
})();