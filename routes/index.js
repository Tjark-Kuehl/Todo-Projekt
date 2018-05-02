import { Router } from '../framework'

const router = new Router()

router.get('/', (req, res) => {
    res.render('index')
    return true
})

export default router
