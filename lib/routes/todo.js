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
 * Gets all todos/todo-groups from a user by ID
 * @param {number} user_id ID of the User
 */
export async function getUserTodos(user_id) {
    const result = await query`
    SELECT
    tg.id     AS group_id,
    tg.name   AS group_name,
    t.text    AS todo_text,
    t.done    AS todo_done,
    t.created AS todo_created
    FROM public.todo_group tg
    LEFT JOIN public.todo t ON t.group_id = tg.id
    WHERE tg.user_id = ${user_id}
    ORDER BY t."order"`
    if (!result || result.rowCount < 1) {
        return false
    }
    return result.rows
}
