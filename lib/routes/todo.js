import { query } from '../../framework/databaseHandler'

/**
 * Creates a new todo group for a user
 * @param {number} user_id ID of the User
 * @param {string} name Name of the new group
 */
export async function createNewTodoGroup(user_id, name) {
    const result = await query`
    INSERT INTO public.todo_group ("user_id", "name") 
    VALUES (${user_id}, ${name}) 
    RETURNING id, name, created`
    if (!result || result.rowCount < 1) {
        return false
    }
    return result.rows[0]
}

/**
 * Creates a new todo for a user
 * @param {number} user_id ID of the User
 * @param {number} group_id ID of the todo group
 * @param {string} name Name of the new todo
 */
export async function createNewTodo(user_id, group_id, name) {
    const result = await query`
    INSERT INTO public.todo (text, group_id)
    (SELECT
        ${name},
        ${group_id}
    FROM public.todo_group tg
    WHERE tg.id = ${group_id} AND tg.user_id = ${user_id})
    RETURNING id, text, created`
    if (!result || result.rowCount < 1) {
        return false
    }
    return result.rows[0]
}

/**
 * Gets all todos/todo-groups from a user by ID
 * @param {number} user_id ID of the User
 */
export async function getUserTodos(user_id) {
    const result = await query`
    SELECT
        tg.id AS group_id,
        tg.name AS group_name,
        json_agg(json_build_object('todo_id', t.id, 'todo_text', t.text, 'todo_done', t.done, 'todo_created', t.created) ORDER BY t.id) AS json
    FROM public.todo_group tg
        LEFT JOIN public.todo t ON t.group_id = tg.id
    WHERE tg.user_id = ${user_id}
    GROUP BY tg.id
    ORDER BY tg.id`
    if (!result || result.rowCount < 1) {
        return false
    }
    return result.rows
}

/**
 * Toggles todo
 * @param {number} user_id ID of the User
 * @param {number} todo_id ID of the Todo
 */
export async function toggleUserTodo(user_id, todo_id) {
    const result = await query`
        UPDATE public.todo t
        SET done = NOT done
        FROM public.todo_group tg
        WHERE tg.id = t.group_id
            AND t.id = ${todo_id}
            AND tg.user_id = ${user_id}`
    if (!result) {
        return false
    }
    return true
}

/**
 * Removes a todo
 * @param {number} user_id ID of the User
 * @param {number} todo_id ID of the Todo
 */
export async function removeUserTodo(user_id, todo_id) {
    const result = await query`
        DELETE FROM todo
        WHERE id = ${todo_id} AND group_id = (SELECT id
                                            FROM todo_group
                                            WHERE user_id = ${user_id} AND id = group_id)`
    if (!result) {
        return false
    }
    return true
}
