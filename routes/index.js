import { Router } from '../framework'

const router = new Router()

router.get('/', (req, res) => {
    res.render('login')
    return true
})

export default router
