const registerForm = document.getElementById("signup_button");

const {SERVER_PORT} = process.env;
const baseURL = `http://localhost:${SERVER_PORT}/`

const register = body => axios.post(`${baseURL}api/register`, body)
  .then(res => {
    alert("Account registered successfully!");
    // createUserCard(res.data)
  }).catch(err => {console.log(err)
    alert('Uh oh. Your request did not work.')
  })

// function loginSubmitHandler(e) {
//     e.preventDefault()

//     let username = document.querySelector('#login-username')
//     let password = document.querySelector('#login-password')

//     let bodyObj = {
//         username: username.value,
//         password: password.value
//     }

//     login(bodyObj)

//     username.value = ''
//     password.value = ''
// }

function registerSubmitHandler(e) {
  e.preventDefault();

  let first_name = document.querySelector('first_name');
  let last_name = document.querySelector('last_name');
  let email = document.querySelector('email');
  let street_address = document.querySelector('street_address');
  let city = document.querySelector('city');
  let state = document.querySelector('state');
  let password = document.querySelector('password');
  let confirm_password = document.querySelector('confirm_password');

  if (password.value !== confirm_password.value) {
    alert("Your passwords need to match.");
    return
  };

//   // Should verify password strength here
//   if (password.value !== confirm_password.value) {
//     alert("Your passwords need to match.")
//     return
//   }

  let bodyObj = {
    first_name: first_name.value,
    last_name: last_name.value,
    email: email.value,
    street_address: street_address.value,
    city: city.value,
    state: state.value,
    password: password.value
  };

  register(bodyObj);

//   username.value = ''
//   email.value = ''
//   firstName.value = ''
//   lastName.value = ''
//   password.value = ''
//   password2.value = ''
}

registerForm.addEventListener('submit', registerSubmitHandler);