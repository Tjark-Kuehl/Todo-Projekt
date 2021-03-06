import { Router } from '../../framework'
import { authGuard } from '../../lib/routes/auth'
import { JE400, JE1002, JE500, NO_TODOS } from '../../lib/error'
import {
    getUserTodos,
    toggleUserTodo,
    removeUserTodo
} from '../../lib/routes/todo'

const router = new Router()

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

router.post('/toggle-todo', async (req, res) => {
    /* Early return when user is not authenticated */
    if (!authGuard(req)) {
        res.json(JE1002)
        return true
    }

    let { todo_id } = req.postParams
    /* Catch bad request */
    if (!todo_id) {
        res.json(JE400)
        return true
    }

    const result = await toggleUserTodo(req.jwt.payload.id, todo_id)

    if (result) {
        res.json(result)
    } else {
        res.json(JE500)
    }

    return true
})

router.post('/remove-todo', async (req, res) => {
    /* Early return when user is not authenticated */
    if (!authGuard(req)) {
        res.json(JE1002)
        return true
    }

    let { todo_id } = req.postParams
    /* Catch bad request */
    if (!todo_id) {
        res.json(JE400)
        return true
    }

    const result = await removeUserTodo(req.jwt.payload.id, todo_id)

    if (result) {
        res.json(result)
    } else {
        res.json(JE500)
    }

    return true
})

export default router
