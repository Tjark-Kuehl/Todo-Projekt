import { Router } from '../framework'

const router = new Router()

router.get('/login', (req, res) => {
    res.render('login')
    return true
})

router.get('/', (req, res) => {
    res.render('index')
    return true
})

router.post('/test', (req, res) => {
    res.json({
        test: "abc"
    })
    return true
})

export default router
