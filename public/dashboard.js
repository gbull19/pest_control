const allApptsDiv = document.getElementById('all_appts');
const userWelcome = document.getElementById('user_welcome');
const apptBtn = document.getElementById('appt_btn');
const newApptDiv = document.getElementById('new_appt_div');
const newApptForm = document.getElementById('new_appt_form');
const logoutBtn = document.getElementById('logout');
const newUserDiv = document.getElementById('new_user_div');


const makeAppointmentCard = (appt) => {
    const { appt_date, interior, appt_price, street_address, city, state, pest_name} = appt;
    let interiorService = "";
    if (interior == true) { interiorService = "Yes" } else { interiorService = "No" };
    return (`<div class="appt-card-border">
            <div class="appt-card">
                <h2>${appt_date}</h2>
                <h3>${street_address}, ${city}, ${state}</h3>
                <P>Price: $${appt_price}</P>
                <p>Was Interior Treated?: ${interiorService}</p>
                <p>What was the target pest? ${pest_name}</p>
            </div>
        </div>`);
};


const getAllAppts = () => {
    axios.get('/api/appts')
        .then((res) => {
            let dbObj = res.data.dbObj;
            console.log(dbObj);
            if (dbObj.length == 0 && dbObj[0].is_tech == false) {
                newUserDiv.innerHTML = "";
                newUserDiv.innerHTML += "You don't have any appointment history yet. Please click Request Treatment above to schedule your first treatment!";
                return;
            } else if (dbObj.length !== 0 && dbObj[0].is_tech == false) {
                allApptsDiv.innerHTML = "";
                dbObj.forEach(obj => {
                let apptCard = makeAppointmentCard(obj);
                allApptsDiv.innerHTML += apptCard;
                })
            } else if (dbObj[0].is_tech == true) {
                newUserDiv.innerHTML += "You're a tech!";
            };     
        })
        .catch((err) => {
            logoutBtn.classList.add("hidden");
            apptBtn.classList.add("hidden");
            return alert(`${err.response.data.message}`);
        });
}


const newAppt = obj => {
    axios.post('/api/apptrequest', obj)
        .then((res) => {
            alert('Your request has been received!');
            newApptForm.reset();
            newApptDiv.classList.remove("active");
        })
        .catch((err) => {     
            console.log(err);       
            alert(`${err.response.data.message}`);
        });
};


const newApptHandler = e => {
    e.preventDefault();

    const first_name = document.getElementById('first_name');
    const pest_name = document.getElementById('pest_appt_input');
    
    const reqObj = {
        first_name: first_name.value,
        pest_name: pest_name.value
    };

    newAppt(reqObj);
}


const newApptToggle = (e) => {
    e.preventDefault()

    if (newApptDiv.classList.contains("active")) {
        newApptDiv.classList.remove("active");
    } else {
        newApptDiv.classList.add("active");
    }
};


const logout = () => {
    axios.get('/api/logout')
        .then((res) => {
           alert("Logout successful.");
           location.assign("/myaccount.html");
        })        
        .catch((err) => {
            console.log(err);
            alert("Error logging out. Please try again.");
        });
}


apptBtn.addEventListener('click', newApptToggle);
newApptForm.addEventListener('submit', newApptHandler);
logoutBtn.addEventListener('click', logout);


getAllAppts();