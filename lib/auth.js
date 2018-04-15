import jwt from 'jsonwebtoken'
import { secret, refreshSecret } from '../config/jwt.config'

export function signUserLoginTokens(email, password) {
    const createToken = jwt.sign(
        {
            email
        },
        secret,
        {
            expiresIn: '10m'
        }
    )
    const createRefreshToken = jwt.sign(
        {
            email
        },
        refreshSecret + password,
        {
            expiresIn: '7d'
        }
    )
    return [createToken, createRefreshToken]
}
