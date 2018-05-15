import { Router } from '../../framework'
import { tryLoginUser } from '../../lib/routes/auth'
import { JE400, LOGIN_FAILED } from '../../lib/error'

const router = new Router()

router.get('/login', (req, res) => {
    res.render('login')
    return true
})

router.post('/login', async (req, res) => {
    let post = req.postParams
    /* Catch bad request */
    if (!post || !post.email || !post.password) {
        res.json(JE400)
        return true
    }

    /* Try login user with email and password */
    const login = await tryLoginUser(post.email, post.password)

    /* If login succeeded or not */
    if (login) {
        console.log('[LOGIN]: ', post.email)
        req.jwt.sign({ id: login.id, email: login.email }, login.password)
        res.json({
            email: login.email
        })
    } else {
        res.json(LOGIN_FAILED)
    }
    return true
})

export default router
