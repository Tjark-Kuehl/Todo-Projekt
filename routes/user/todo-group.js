import { Router } from '../../framework'
import { authGuard } from '../../lib/routes/auth'
import { JE400, JE1002, JE500 } from '../../lib/error'
import { createNewTodoGroup, createNewTodo } from '../../lib/routes/todo'

const router = new Router()

router.post('/create-group', async (req, res) => {
    /* Early return when user is not authenticated */
    if (!authGuard(req)) {
        res.json(JE1002)
        return true
    }

    let post = req.postParams
    /* Catch bad request */
    if (!post || !post.groupName) {
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

router.post('/create-todo', async (req, res) => {
    /* Early return when user is not authenticated */
    if (!authGuard(req)) {
        res.json(JE1002)
        return true
    }

    let post = req.postParams
    /* Catch bad request */
    if (!post || !post.groupid || !post.todoName) {
        res.json(JE400)
        return true
    }

    const newTodo = await createNewTodo(
        req.jwt.payload.id,
        post.groupid,
        post.todoName
    )

    if (newTodo) {
        res.json(newTodo)
    } else {
        res.json(JE500)
    }

    return true
})

export default router
