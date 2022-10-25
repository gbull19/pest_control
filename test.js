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
 
 // https://css-tricks.com/handling-user-permissions-in-javascript/

// DB object showing permission role
// {
//     id: 1,
//     title: "My First Document",
//     authorId: 742,
//     accessLevel: "ADMIN",
//     content: {...}
//   }


// CONSTANTS.JS
// const actions = {
//     MODIFY_FILE: "MODIFY_FILE",
//     VIEW_FILE: "VIEW_FILE",
//     DELETE_FILE: "DELETE_FILE",
//     CREATE_FILE: "CREATE_FILE"
//   };
  
//   const roles = {
//     ADMIN: "ADMIN",
//     EDITOR: "EDITOR",
//     GUEST: "GUEST"
//   };
  
//   export { actions, roles };


// IMPORT CONSTANTS.JS
// import { actions } from "./constants.js";

// console.log(actions.CREATE_FILE);


// DEFINE PERMISSIONS
// import { actions, roles } from "./constants.js";

// const mappings = new Map();

// mappings.set(actions.MODIFY_FILE, [roles.ADMIN, roles.EDITOR]);
// mappings.set(actions.VIEW_FILE, [roles.ADMIN, roles.EDITOR, roles.GUEST]);
// mappings.set(actions.DELETE_FILE, [roles.ADMIN]);
// mappings.set(actions.CREATE_FILE, [roles.ADMIN, roles.EDITOR]);


// SAMPLE HTML PERMISSION
// import hasPermission from "./permissions.js";
// import { actions } from "./constants.js";

// function Dropdown() {
//   return (
//     <ul>
//       {hasPermission(file, actions.VIEW_FILE) && (
//         <li><button type="button">Refresh</button></li>
//       )}
//       {hasPermission(file, actions.MODIFY_FILE) && (
//         <li><button type="button">Rename</button></li>
//       )}
//       {hasPermission(file, actions.CREATE_FILE) && (
//         <li><button type="button">Duplicate</button></li>
//       )}
//       {hasPermission(file, actions.DELETE_FILE) && (
//         <li><button type="button">Delete</button></li>
//       )}
//     </ul>
//   );
// }

// HTML DISPLAY ONLY VERY LOGGED IN
//         // Check if the user is allowed to access the content:
// if( false == $isLoggedIn ){
//     // the user is not logged in and no private data should be shown
//     header("Location: /login.php?error=" . urlencode("You must login to access the content."),
//            true, // override any previously set Location header
//            302 // inform the client/browser that this redirect is temporary and should not be cached as a permanent action
//           );
//     die("You must login <a href='/login.php?error=" . urlencode("You must login to access the content.") . "'>here</a>.");
// }
//         // If the script is executing at this point, we know the user is logged in.
//         /* ... Your code for handling the API ... */

// USER LOGIN (https://codeshack.io/basic-login-system-nodejs-express-mysql/)
// const mysql = require('mysql');
// const express = require('express');
// const session = require('express-session');
// const path = require('path');

// const connection = mysql.createConnection({
// 	host     : 'localhost',
// 	user     : 'root',
// 	password : '',
// 	database : 'nodelogin'
// });

// const app = express();

// app.use(session({
// 	secret: 'secret',
// 	resave: true,
// 	saveUninitialized: true
// }));
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(express.static(path.join(__dirname, 'static')));

// // http://localhost:3000/
// app.get('/', function(request, response) {
// 	// Render login template
// 	response.sendFile(path.join(__dirname + '/login.html'));
// });

// // http://localhost:3000/auth
// app.post('/auth', function(request, response) {
// 	// Capture the input fields
// 	let username = request.body.username;
// 	let password = request.body.password;
// 	// Ensure the input fields exists and are not empty
// 	if (username && password) {
// 		// Execute SQL query that'll select the account from the database based on the specified username and password
// 		connection.query('SELECT * FROM accounts WHERE username = ? AND password = ?', [username, password], function(error, results, fields) {
// 			// If there is an issue with the query, output the error
// 			if (error) throw error;
// 			// If the account exists
// 			if (results.length > 0) {
// 				// Authenticate the user
// 				request.session.loggedin = true;
// 				request.session.username = username;
// 				// Redirect to home page
// 				response.redirect('/home');
// 			} else {
// 				response.send('Incorrect Username and/or Password!');
// 			}			
// 			response.end();
// 		});
// 	} else {
// 		response.send('Please enter Username and Password!');
// 		response.end();
// 	}
// });

// // http://localhost:3000/home
// app.get('/home', function(request, response) {
// 	// If the user is loggedin
// 	if (request.session.loggedin) {
// 		// Output username
// 		response.send('Welcome back, ' + request.session.username + '!');
// 	} else {
// 		// Not logged in
// 		response.send('Please login to view this page!');
// 	}
// 	response.end();
// });

// app.listen(3000);

// ANOTHER USER LOGIN (SLEEK) = https://jasonwatmore.com/post/2020/07/20/nodejs-hash-and-verify-passwords-with-bcrypt