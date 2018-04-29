import jwt from 'jsonwebtoken'
import { secret, refreshSecret } from '../../config/jwt.config'
import { query } from '../../framework/databaseHandler'

/**
 * Checks if the user is authenticated or not
 * @param {object} req request object
 */
export function authGuard(req) {
    return Boolean(req.jwt.valid)
}

/**
 * Login the User
 * @param {string} email user email
 * @param {string} password user password
 */
export async function tryLoginUser(email, password) {
    const result = await query`
        SELECT
            id,
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
 * @param {string} email User E-Mail
 * @param {string} password User Password
 */
export async function tryRegisterUser(email, password) {
    const result = await query`
        INSERT INTO public.user ("email", "password")
        VALUES (${email}, crypt(${password}, gen_salt('bf', 8)))
        RETURNING id, email, password`
    if (!result || result.rowCount < 1) {
        return false
    }
    return result.rows[0]
}

/**
 * returns the crypted password from a user email
 * @param {string} email User E-Mail
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
