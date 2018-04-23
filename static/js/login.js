document.addEventListener('DOMContentLoaded', () => {
    /* Redirect when user is authenticated */
    if (authenticated()) {
        setLocation('index')
    }

    /* Send XHR request on button click */
    document.querySelector('#login-button').addEventListener('click', () => {
        call(`/login`, {
            email: document.querySelector('#login-email').value,
            password: document.querySelector('#login-password').value
        }).then(res => {
            if (!res.error) {
                console.log(res)
                setLocation('index')
            }
        })
    })
})
