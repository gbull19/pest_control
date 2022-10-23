if (inputname == name & inputpassword == pass ){
    //The user has successfully authenticated. We need to store this information
    //for the next page.
    sessionStorage.setItem("AuthenticationState", "Authenticated");
    
    //This authentication key will expire in 1 hour.
    sessionStorage.setItem("AuthenticationExpires", Date.now.addHours(1));
    
    //Push the user over to the next page.
    window.open('welcome1.html','_self');
}

Date.prototype.addHours = function(h) {    
    this.setTime(this.getTime() + (h*60*60*1000)); 
    return this;   
 }

//  <!-- LOGIN.html --->

// <input type="text" id="name" name="name" />
// <input type="text" id="pass" name="pass" />
// <input type="submit" id="sub" name="sub" onclick="click();" />


//Is the user authenticated?
if (sessionStorage.getItem('AuthenticationState') === null) {
    window.open("AccessDenied.html", "_self");
 }
 //Is their authentication token still valid?
 else if (Date.now > new Date(sessionStorage.getItem('AuthenticationExpires'))) {
       window.open("AccessDenied.html", "_self");
 }
 else {
   //The user is authenticated and the authentication has not expired.
 }
