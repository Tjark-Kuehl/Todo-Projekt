export function createNewTodoGroup(name) {
    const result = await query`INSERT INTO public.todo_group ("name") VALUES (${name})`
    console.log(result)
}
