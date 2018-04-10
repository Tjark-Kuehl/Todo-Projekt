window.addEventListener('load', function() {
    /* Send XHR request on button click */
    document
        .querySelector('#login-button')
        .addEventListener('click', function() {
            call(`/login`, {
                email: document.querySelector('#login-email').value,
                password: document.querySelector('#login-password').value
            }).then(res => {
                if (res.success) {
                    localStorage.setItem('token', res.token)
                    localStorage.setItem('refreshToken', res.refreshToken)
                    setLocation('index')
                }
            })
        })
})
