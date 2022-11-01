const allApptsDiv = document.querySelector('#all_appts');
const userWelcome = document.querySelector('#user_welcome');

const token = sessionStorage.getItem("accessToken");

const makeAppointmentCard = (appt) => {
    const { appt_date, interior, appt_price, street_address, city, state} = appt;
    let interiorService = ""
    if (interior == true) { interiorService = "Yes" } else { interiorService = "No" }
    return (`<div class="appt-card-border">
            <div class="appt-card">
                <h2>${appt_date}</h2>
                <h3>${street_address}, ${city}, ${state}</h3>
                <P>Price: ${appt_price}</P>
                <p>Was Interior Treated?: ${interiorService}</p>
            </div>
        </div>`)
}

const getAllAppts = () => {
    if (!token) {
        allApptsDiv.innerHTML = "";
        allApptsDiv.innerHTML += "Please login before accessing your dashboard."
    } else {
        axios.get('/api/appts')
            .then(({data}) => {
                console.log(data)
                allApptsDiv.innerHTML = "";
                data.forEach(obj => {
                    let apptCard = makeAppointmentCard(obj)
                    allApptsDiv.innerHTML += apptCard
                })
            })
            .catch((err) => {
                console.log(err);
                alert("Error loading content");
            });
    }
}

// axios.get('/api/appts')
//     .then(({data}) => {
//             console.log(data)
//             allApptsDiv.innerHTML = "";
//             data.forEach(obj => {
//                 let apptCard = makeAppointmentCard(obj)
//                 allApptsDiv.innerHTML += apptCard
//             })
//     })
//     .catch((err) => {
//         console.log(err);
//         alert("Error loading content");
//     });

// getAllAppts()




// let dbObj = [
//     {
//       "user_address_id": 2,
//       "street_address": "10880 Malibu Point",
//       "city": "Malibu",
//       "state": "Utah",
//       "user_id": 2,
//       "appt_id": 1,
//       "appt_date": "2022-07-26",
//       "interior": true,
//       "appt_price": "100"
//     },
//     {
//       "user_address_id": 2,
//       "street_address": "10880 Malibu Point",
//       "city": "Malibu",
//       "state": "Utah",
//       "user_id": 2,
//       "appt_id": 2,
//       "appt_date": "2022-10-01",
//       "interior": true,
//       "appt_price": "100"
//     }
//   ]

// const getAllAppts = (arr) => {
//     allApptsDiv.innerHTML = "";
//     arr.forEach(obj => {
//         let apptCard = makeAppointmentCard(obj)
//         allApptsDiv.innerHTML += apptCard
//     })
// }

//   getAllAppts(dbObj);