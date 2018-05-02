import { Router } from '../../framework'
import { authGuard } from '../../lib/routes/auth'
import {
    JE400,
    JE1002,
    JE500,
    NO_TODOS
} from '../../lib/error'
import { createNewTodoGroup, getUserTodos } from '../../lib/routes/todo'

const router = new Router()

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
        res.json(todos)
    } else {
        res.json(NO_TODOS)
    }

    return true
})

export default router
