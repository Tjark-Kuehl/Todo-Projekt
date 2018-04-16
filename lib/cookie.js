import cookie from 'cookie'
import signature from 'cookie-signature'

function signedCookie(str, secrets) {
    if (typeof str !== 'string') {
        return undefined
    }

    if (str.substr(0, 2) !== 's:') {
        return str
    }

    for (let i = 0; i < secrets.length; i++) {
        let val = signature.unsign(str.slice(2), secrets[i])
        if (val !== false) {
            return val
        }
    }

    return false
}

function signedCookies(obj, secrets) {
    let cookies = Object.keys(obj)
    let dec
    let key
    let ret = Object.create(null)
    let val
    for (let i = 0; i < cookies.length; i++) {
        key = cookies[i]
        val = obj[key]
        dec = signedCookie(val, secrets)

        if (val !== dec) {
            ret[key] = dec
            delete obj[key]
        }
    }
    return ret
}

export function cookieParser(secret, options) {
    let secrets = !secret || Array.isArray(secret) ? secret || [] : [secret]

    return (req, res) => {
        res.cookie = (name, val, options) => {
            res.setHeader('Set-Cookie', cookie.serialize(name, val, options))
        }

        if (req.cookies) {
            return false
        }
        let cookies = req.headers.cookie
        req.secret = secrets[0]
        req.cookies = Object.create(null)
        req.signedCookies = Object.create(null)

        if (!cookies) {
            return false
        }

        req.cookies = cookie.parse(cookies, options)

        if (secrets.length !== 0) {
            req.signedCookies = signedCookies(req.cookies, secrets)
        }

        return false
    }
}
