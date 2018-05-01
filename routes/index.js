import { Router } from '../framework'
import { tryRegisterUser, tryLoginUser, authGuard } from '../lib/routes/auth'
import {
    JE400,
    REGISTRATION_FAILED,
    LOGIN_FAILED,
    JE1002,
    JE500,
    NO_TODOS
} from '../lib/error'
import { createNewTodoGroup, getUserTodos } from '../lib/routes/todo'

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
        req.jwt.sign(
            { id: login.id, email: login.email },
            false,
            login.password
        )
        res.json({
            email: login.email
        })
    } else {
        res.json(LOGIN_FAILED)
    }
    return true
})

router.post('/create-group', async (req, res) => {
    /* Early return when user is not authenticated */
    if (!authGuard(req)) {
        res.json(JE1002)
        return true
    }

    let post = req.postParams
    /* Catch bad request */
    if (!post) {
        res.json(JE400)
        return true
    }

    const newGroup = await createNewTodoGroup(
        req.jwt.payload.id,
        post.groupName
    )

    if (newGroup) {
        res.json(newGroup)
    } else {
        res.json(JE500)
    }

    return true
})

router.post('/get-todos', async (req, res) => {
    /* Early return when user is not authenticated */
    if (!authGuard(req)) {
        res.json(JE1002)
        return true
    }

    const todos = await getUserTodos(req.jwt.payload.id)

    if (todos) {
        let done = []
        let buildArr = []
        for (let i = 0; i < todos.length; i++) {
            /* Break if group array exist */
            if (done.indexOf(todos[i].group_id) !== -1) continue

            let partArr = []
            todos.forEach(el => {
                if (el.group_id === todos[i].group_id) {
                    partArr.push(el)
                    done.push(el.group_id)
                }
            })
            buildArr.push(partArr)
        }
        res.json(buildArr)
    } else {
        res.json(NO_TODOS)
    }

    return true
})

export default router
