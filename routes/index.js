import { Router } from '../framework'

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

export default router
