const contactForm = document.getElementById('contact_form');

const contactFormSubmit = obj => axios.post('/api/contact', obj)
    .then(res => {
        alert('Message received. We will contact you shortly.');
    })
    .catch(err => {console.log(err)
        alert('Uh oh. Your message wasn\'t received. Please try again.');
    });

const contactFormHandler = e => {
    e.preventDefault();

    const first_name = document.getElementById('contact_form_first_name');
    const last_name = document.getElementById('contact_form_last_name');
    const phone = document.getElementById('contact_form_phone');
    const email = document.getElementById('contact_form_email');
    const message = document.getElementById('contact_form_message');

    const contactObj = {
        first_name: first_name.value,
        last_name: last_name.value,
        phone: phone.value,
        email: email.value,
        message: message.value
    }

    console.log('contactOBJ = ', contactObj)
    contactFormSubmit(contactObj);
}

contactForm.addEventListener('submit', contactFormHandler);