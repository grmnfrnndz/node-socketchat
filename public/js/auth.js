const miFormulario = document.querySelector('form');

const url = (window.location.hostname.includes('localhost')) 
? 'http://localhost:8080/api/auth/'
: 'https://node-webrestserver.herokuapp.com/api/auth/';


miFormulario.addEventListener('submit', event => {

    // previene que se recarge el navegador
    event.preventDefault();

    const formData = {};

    for(let el of miFormulario.elements) {
        if (el.name.length > 0)
            formData[el.name] = el.value;
    }

    fetch(url + 'login', {
        method: 'POST',
        body: JSON.stringify(formData),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(res => res.json())
    .then(({msg, token}) => {
        if (msg) {
            return console.error(msg);
        }
        localStorage.setItem('token', token);
        window.location = 'chat.html';
    })
    .catch(err => {
        console.error(err);
    });
});


// solo funciona con una funcion tradicional
function handleCredentialResponse(response) {
    //   Google token: ID_TOKEN
    //  console.log('ID_TOKEN', response.credential);

    const body = {
        id_token: response.credential
    }



    fetch(url + 'google', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        }, 
        body: JSON.stringify(body)
    })
    .then(resp => resp.json())
    .then(({token}) => {
        // console.log(resp);
        // localStorage.setItem('email', resp.usuario.correo);

        localStorage.setItem('token', token);
        // location.reload();
        window.location = 'chat.html';

    })
    .catch(console.warn)

    }

    const button = document.getElementById('google_identityout');
    button.onclick = () => {
    //   console.log(google.accounts.id);
        google.accounts.id.disableAutoSelect();
        google.accounts.id.revoke(localStorage.getItem('token'), done => {
        localStorage.clear();
        location.reload();
        });


    }