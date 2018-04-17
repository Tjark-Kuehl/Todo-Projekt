import { query } from '../../framework/databaseHandler'

/**
 * Creates a new todo group for a user
 * @param {integer} user_id UserID
 * @param {string} name Name of the new group
 */
export async function createNewTodoGroup(user_id, name) {
    const result = await query`INSERT INTO public.todo_group ("user_id", "name") VALUES (${user_id}, ${name}) RETURNING name, created`
    if (!result || result.rowCount < 1) {
        return false
    }
    return result.rows[0]
}
