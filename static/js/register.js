document.addEventListener('DOMContentLoaded', () => {
    /* Redirect when user is authenticated */
    if (authenticated()) {
        setLocation('index')
    }

    /* Send XHR request on button click */
    document.querySelector('#register-button').addEventListener('click', () => {
        let password = document.querySelector('#password-input').value
        let password_repeat = document.querySelector('#password-repeat-input')
            .value

        if (password !== password_repeat) {
            console.log('Passwörter stimmen nicht überein!')
            return
        }

        call(`/register`, {
            email: document.querySelector('#email-input').value,
            password
        }).then(res => {
            if (!res.error) {
                setLocation('index')
            }
        })
    })
})
