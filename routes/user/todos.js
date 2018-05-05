import { Router } from '../../framework'
import { authGuard } from '../../lib/routes/auth'
import { JE400, JE1002, JE500, NO_TODOS } from '../../lib/error'
import {
    createNewTodoGroup,
    getUserTodos,
    toggleUserTodo,
    createNewTodo
} from '../../lib/routes/todo'

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

export default router
