import { Router } from '../framework'
import { signUserLoginTokens, tryRegisterUser, tryLoginUser } from '../lib/auth'
import { JE400, REGISTRATION_FAILED } from '../lib/error'

const router = new Router()

router.get('/login', (req, res) => {
    res.render('login')
    return true
})

router.get('/register', (req, res) => {
    res.render('register')
    return true
})

router.get('/', (req, res) => {
    res.render('index')
    return true
})

router.post('/register', async (req, res) => {
    let post = req.postParams
    /* Catch bad request */
    if (!post) {
        res.json(JE400)
        return true
    }

    /* Try register user with email and password */
    const registered = await tryRegisterUser(post.email, post.password)

    /* If registered succeeded or not */
    if (registered) {
        console.log('[REGISTERED]: ', post.email)
        res.json({ email: post.email })
    } else {
        res.json(REGISTRATION_FAILED)
    }
    return true
})

router.post('/login', async (req, res) => {
    let post = req.postParams
    /* Catch bad request */
    if (!post) {
        res.json(JE400)
        return true
    }

    /* Try login user with email and password */
    const login = await tryLoginUser(post.email, post.password)

    /* If login succeeded or not */
    if (login) {
        console.log('[LOGIN]: ', post.email)
        const [newToken, newRefreshToken] = await signUserLoginTokens(
            login.email,
            login.password
        )
        res.json({
            token: newToken,
            refreshToken: newRefreshToken
        })
    } else {
        res.json(JE400)
    }
    return true
})

export default router
