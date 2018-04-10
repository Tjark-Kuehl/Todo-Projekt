import jwt from 'jsonwebtoken'

export function signUserLoginTokens(email, password) {
    const secret = '1337'
    const secret2 = '1354kn4pnk62346ö6jfsag'
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
        secret2 + password,
        {
            expiresIn: '7d'
        }
    )
    return [createToken, createRefreshToken]
}
