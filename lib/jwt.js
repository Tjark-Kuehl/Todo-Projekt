import jwt from 'jsonwebtoken'
import { getUserPassword } from './routes/auth.js'
import config from '../config/jwt.config.json'

export const jwt_init = async (req, res) => {
    function sign(payload, crypted_password) {
        res.cookie(
            config.COOKIE,
            jwt.sign(
                {
                    custom: payload
                },
                config.SECRET + crypted_password,
                { expiresIn: config.jwt_expiresIn }
            ),
            {
                httpOnly: false,
                expiresIn: config.jwt_expiresIn
            }
        )
    }

    let payload = {}
    let valid = false
    let expired = false

    req.jwt = {
        clear: () => res.clearCookie(config.COOKIE),
        sign,
        valid
    }

    const token = req.cookies[config.COOKIE]
    if (token) {
        payload = jwt.decode(token) || {}
        if (!!payload.custom && !!payload.custom.email) {
            const crypted_password = await getUserPassword(payload.custom.email)
            if (crypted_password) {
                try {
                    payload = jwt.verify(
                        token,
                        config.SECRET + crypted_password,
                        config.jwt_verify_options
                    )
                    valid = true
                } catch (err) {
                    if (err.name === 'TokenExpiredError') {
                        expired = true
                    }
                }
                if (valid || expired) {
                    sign(payload.custom, crypted_password)
                    valid = true
                }
            }
            req.jwt.valid = valid
            req.jwt.payload = payload.custom
        }
    }

    req.jwt.editAndSign = async (nameOrEmail, { new_name, new_email }) => {
        const crypted_password = await getUserPassword(nameOrEmail)
        if (!crypted_password) {
            return false
        }
        if (new_name) {
            payload.custom.name = new_name
        }
        if (new_email) {
            payload.custom.email = new_email
        }
        sign(payload.custom, crypted_password)
    }
    return false
}
