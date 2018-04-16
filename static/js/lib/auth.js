console.log('Authenticated: ' + authenticated())
function authenticated() {
    const cookie = document.cookie.split('=', 2)[1]
    const parsed = parseJwt(cookie)
    return Boolean(parsed && parsed.exp > new Date().getTime() / 1000)
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

function removeCookie(name) {
    document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;'
}
