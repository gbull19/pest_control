const registerForm = document.getElementById("register");
const loginToggle = document.getElementById("login_toggle");
const registerToggle = document.getElementById("register_toggle");
const registerDiv = document.getElementById("registerDiv");
const loginDiv = document.getElementById("loginDiv");

const register = body => axios.post('http://localhost:8444/api/register', body)
  .then(res => {
    alert("Account registered successfully!");
  }).catch(err => {console.log(err)
    alert('Uh oh. Your request did not work.')
  })

const registerSubmitHandler= event => {
  event.preventDefault();

  let first_name = document.querySelector('#first_name');
  let last_name = document.querySelector('#last_name');
  let email = document.querySelector('#email');
  let street_address = document.querySelector('#street_address');
  let city = document.querySelector('#city');
  let state = document.querySelector('#state');
  let password = document.querySelector('#password');
  let confirm_password = document.querySelector('#confirm_password');

  if (password.value !== confirm_password.value) {
    alert("Your passwords need to match.");
    return;
  };

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
}

const registerToggleHandler = e => {
  e.preventDefault();
  registerDiv.classList.remove("active");
  loginDiv.classList.add("active");
};

const loginToggleHandler = e => {
  e.preventDefault();
  loginDiv.classList.remove("active");
  registerDiv.classList.add("active");
};

registerForm.addEventListener('submit', registerSubmitHandler);
registerToggle.addEventListener('click', registerToggleHandler);
loginDiv.addEventListener('click', loginToggleHandler)