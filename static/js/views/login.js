/* Redirect when user is authenticated */
if (authenticated()) {
    setLocation('index')
}

/* Login on button click */
document.addEventListener('DOMContentLoaded', () => {
    document
        .querySelector('#login-button')
        .addEventListener('click', () => Login())
})

/* Login on spacebar press */
document.body.onkeyup = e => {
    if (e.target.tagName === 'INPUT' && e.keyCode == 13) {
        Login()
    }
}

function Login() {
    const email = document.querySelector('#login-email').value
    const password = document.querySelector('#login-password').value

    if (!email || !password) {
        Login_drawError('E-Mail und Passwort dürfen nicht leer sein')
        return
    }

    call(`/login`, {
        email,
        password
    }).then(res => {
        if (res.error) {
            Login_drawError(res.error.msg)
        } else {
            setLocation('index')
        }
    })
}

function Login_drawError(msg) {
    /* Show error wrapper if ! already shown */
    let error_wrapper = document.querySelector('.Login-error-wrapper')
    if (!error_wrapper.style.display) {
        error_wrapper.style.display = 'flex'
    }

    /* Insert error message */
    document.querySelector('#Login-error-text').innerHTML = msg
}
