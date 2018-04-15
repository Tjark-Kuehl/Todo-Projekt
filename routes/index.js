import { Router } from '../framework'
import { signUserLoginTokens } from '../lib/auth'

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

let loginObject = [
    {
        email: 'test@test.de',
        password: '1234'
    }
]
router.post('/login', async (req, res) => {
    let post = req.postParams
    /* Catch bad request */
    if (!post) {
        return false
    }

    /* Check if data is available */
    let login = false
    loginObject.forEach(entry => {
        if (entry.email === post.email && entry.password === post.password) {
            login = true
        }
    })

    /* If login succeeded or not */
    if (login) {
        const [newToken, newRefreshToken] = await signUserLoginTokens(
            post.email,
            post.password
        )
        res.json({
            token: newToken,
            refreshToken: newRefreshToken,
            success: true
        })
    } else {
        res.json({
            success: false
        })
    }
    return true
})

export default router
