/* Redirect when user is authenticated */
if (authenticated()) {
    setLocation('index')
}

/* Register on button click */
document.addEventListener('DOMContentLoaded', () => {
    document
        .querySelector('#register-button')
        .addEventListener('click', () => Register())
})

/* Register on spacebar press */
document.body.onkeyup = e => {
    if (e.target.tagName === 'INPUT' && e.keyCode == 13) {
        Login()
    }
}

function Register() {
    const password = document.querySelector('#password-input').value
    const password_repeat = document.querySelector('#password-repeat-input')
        .value

    if (password !== password_repeat) {
        Register_drawError('Passwörter stimmen nicht überein')
        return
    }

    call(`/register`, {
        email: document.querySelector('#email-input').value,
        password
    }).then(res => {
        if (res.error) {
            Register_drawError(res.error.msg)
        } else {
            setLocation('index')
        }
    })
}

function Register_drawError(msg) {
    /* Show error wrapper if ! already shown */
    let error_wrapper = document.querySelector('.Register-error-wrapper')
    if (!error_wrapper.style.display) {
        error_wrapper.style.display = 'flex'
    }

    /* Insert error message */
    document.querySelector('#Register-error-text').innerHTML = msg
}
