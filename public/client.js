const registerForm = document.getElementById("register");
const registerToggle = document.getElementById("register_toggle");
const registerDiv = document.getElementById("registerDiv");

const loginForm = document.getElementById("login");
const loginToggle = document.getElementById("login_toggle");
const loginDiv = document.getElementById("loginDiv");


//register functions
const register = body => axios.post('http://localhost:8444/api/register', body)
  .then(res => {
    alert("Account registered successfully!");
    registerForm.reset();
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

  let errors = []
  const specialChars = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
  switch(true) {
    case (password.value !== confirm_password.value):
      errors.push({message: "Your passwords need to match."});
      break;
    case (password.value.length < 10):
      errors.push({message: "Password must contain at least 10 characters."});
      break;
    case (!/[0-9]+/g.test(password.value)): 
      errors.push({message: "Password must contain at least one number."});
      break;
    case (!/[a-z]+/g.test(password.value)):
      errors.push({message: "Password must contain at least one lowercase letter."});
      break;
    case (!/[A-Z]+/g.test(password.value)):
      errors.push({message: "Password must contain at least one uppercase letter."});
      break;
    case (!specialChars.test(password.value)):
      errors.push({message: "Password must contain at least one special character."});
      break;
    default:
      true;
      break;
  };
  if (errors.length > 0) {
    alert(`${errors[0].message}`);
    return errors;
  } else if (errors.length == 0) {
    console.log("Password accepted.")
  } else {
    alert("Please choose another password.")
  };

  let bodyObj = {
    first_name: first_name.value,
    last_name: last_name.value,
    email: email.value,
    street_address: street_address.value,
    city: city.value,
    state: state.value,
    is_tech: 0,
    password: password.value
  };
  register(bodyObj);
}


//form toggle handlers
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


//login
const login = (body) => axios.post('http://localhost:8444/api/login', body)
.then(res => {
  console.log(res.headers);
  alert("Login successful!");
  // window.location.replace("http://localhost:8444/private");
}).catch(err => {console.log(err)
  alert('Invalid credentials. Please try again.')
})

const loginSubmitHandler = event => {
  event.preventDefault();

  let email = document.querySelector('#loginEmail');
  let password = document.querySelector('#loginPassword');

  let bodyObj = {
    email: email.value,
    password: password.value
  }

  login(bodyObj)
};


//event listeners
registerForm.addEventListener('submit', registerSubmitHandler);
registerToggle.addEventListener('click', registerToggleHandler);

loginForm.addEventListener('submit', loginSubmitHandler);
loginToggle.addEventListener('click', loginToggleHandler)