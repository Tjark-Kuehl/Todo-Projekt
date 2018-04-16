import jwt from 'jsonwebtoken'
import { secret, refreshSecret } from '../../config/jwt.config'
import { query } from '../../framework/databaseHandler'

/**
 * Signs user tokens for authentication
 * @param {*} email user email
 * @param {*} password user password
 */
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

/**
 * Login the User
 * @param {*} email user email
 * @param {*} password user password
 */
export async function tryLoginUser(email, password) {
    const result = await query`
        SELECT
          email,
          password
        FROM public.user
        WHERE email = ${email}
        AND password = crypt(${password}, "password");`
    if (!result || result.rowCount < 1) {
        return false
    }
    return result.rows[0]
}

/**
 * Register the User
 * @param {*} email User E-Mail
 * @param {*} password User Password
 */
export async function tryRegisterUser(email, password) {
    const result = await query`
        INSERT INTO public.user ("email", "password")
        VALUES (${email}, crypt(${password}, gen_salt('bf', 8)))`
    return result && result.rowCount > 0
}

/**
 * returns the crypted password from a user email
 * @param {*} email User E-Mail
 */
export async function getUserPassword(email) {
    const result = await query`
    SELECT password
    FROM public.user
    WHERE email = ${email}`
    if (!result || result.rowCount < 1) {
        return false
    }
    return result.rows[0].password
}
