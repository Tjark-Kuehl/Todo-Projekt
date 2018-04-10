console.log(authenticated())
function authenticated() {
    let token = localStorage.getItem('token')
    let refreshToken = localStorage.getItem('refreshToken')

    const date = new Date()
    if (parseJwt(token) && parseJwt(refreshToken).exp > date) {
        return true
    }
    localStorage.removeItem('token')
    localStorage.removeItem('refreshToken')
    return false
}

function parseJwt(token) {
    if (token) {
        let base64Url = token.split('.')[1]
        if (base64Url) {
            let base64 = base64Url.replace('-', '+').replace('_', '/')
            return JSON.parse(window.atob(base64))
        }
    }
    return false
}
