import { Router } from '../../framework'
import { tryRegisterUser } from '../../lib/routes/auth'
import {
    JE400,
    REGISTRATION_FAILED
} from '../../lib/error'

const router = new Router()

router.get('/register', (req, res) => {
    res.render('register')
    return true
})

router.post('/register', async (req, res) => {
    let post = req.postParams
    /* Catch bad request */
    if (!post || !post.email || !post.password) {
        res.json(JE400)
        return true
    }

    /* Try register user with email and password */
    const registered = await tryRegisterUser(post.email, post.password)

    /* If registered succeeded or not */
    if (registered) {
        console.log('[REGISTERED]: ', post.email)
        req.jwt.sign(
            { id: registered.id, email: registered.email },
            false,
            registered.password
        )
        res.json({ email: post.email })
    } else {
        res.json(REGISTRATION_FAILED)
    }
    return true
})

export default router
