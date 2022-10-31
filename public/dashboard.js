const allApptsDiv = document.querySelector('#all_appts');

const makeAppointmentCard = (appt) => {
    const { app_date, interior, appt_price, street_address, city, state} = appt;
    if (interior == true) { interior = "Yes" } else { interior = "No" }
    return `
        <div class="appt-card">
            <h2>${street_address}, ${city}, ${state}</h2>
            <h3>${app_date}</h3>
            <P>Price: ${appt_price}</P>
            <p>Was Interior Treated?: ${interior} damage</p>
        </div>
    `
}

const getAllAppts = () =>  axios.get('/api/appts')
    .then(({data}) => {
        allApptsDiv.innerHTML = ""

        res.forEach(appt => {
            let apptHTML = makeAppointmentCard(appt)
            allApptsDiv.innerHTML += apptHTML
        })
    }).catch(err => {console.log(err)
        alert("Error loading content")
    });

getAllAppts()