/* Redirect when user is authenticated */
if (authenticated()) {
    setLocation('index')
}

document.addEventListener('DOMContentLoaded', () => {
    /* Send XHR request on button click */
    document.querySelector('#login-button').addEventListener('click', () => {
        const email = document.querySelector('#login-email').value
        const password = document.querySelector('#login-password').value

        if (email && password) {
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
                console.log(res)
                setLocation('index')
            }
        })
    })
})

function Login_drawError(msg) {
    /* Show error wrapper if ! already shown */
    let error_wrapper = document.querySelector('.Login-error-wrapper')
    if (!error_wrapper.style.display) {
        error_wrapper.style.display = 'flex'
    }

    /* Insert error message */
    document.querySelector('#Login-error-text').innerHTML = msg
}
