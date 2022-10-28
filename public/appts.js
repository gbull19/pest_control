module.exports = {

    renderDisplayCard: () => {
        compDuoDiv.innerHTML = ''
        compDuoHeader.classList.remove('hide')

        compDuo.forEach(bot => {
            let botHtml = makeRobotDisplayCard(bot)
            compDuoDiv.innerHTML += botHtml
        })
    },

    makeApptDisplayCard: (appt) => {
        return `
            <div class="appt-card outline">
            <img src='${appt.imgAddress}' alt='${appt.name}'/>
            <h3>${appt.name}</h3>
            <h4>Health: ${appt.health}</h4>
            <p>Attack 1: ${appt.attacks[0].damage} damage</p>
            <p>Attack 2: ${appt.attacks[1].damage} damage</p>
            </div>
        `
    },

    getPastAppts: () => {
        axios.get('/api/getallappts')
            .then(({data}) => {
                console.log(data)
                allApptsDiv.innerHTML = ''
                data.forEach(appt => {
                    let apptHtml = makeApptDisplayCard(appt)
                    allApptsDiv.innerHTML += apptHtml
                })
            })
            .catch(err => console.log(err))
    }
};