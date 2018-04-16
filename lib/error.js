function je(code, msg) {
    return { error: { code, msg } }
}

export const JE400 = je(400, 'bad request')
export const JE404 = je(404, 'not found')
export const JE500 = je(500, 'internal server error')

export const JE1001 = je(1001, 'api usage error')
export const JE1002 = je(1002, 'login required')

export const REGISTRATION_FAILED = je(1003, 'email already in use')
