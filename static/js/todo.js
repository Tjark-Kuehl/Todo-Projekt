document.addEventListener('DOMContentLoaded', () => {
    const todo_wrapper = document.querySelectorAll('.checkbox--wrapper')
    const todos = document.querySelectorAll("[name='todo--check[]']")

    /* Iterate todo checkboxes and apply action */
    todos.forEach(entry =>
        entry.addEventListener('click', () => {
            const tw = todo_wrapper[indexToValue(todos, entry)]
            if (tw && tw.classList) {
                if (hasItem(tw.classList, 'todo--checked'))
                    tw.classList.remove('todo--checked')
                else tw.classList.add('todo--checked')
            }
        })
    )
})

function indexToValue(array, val) {
    for (let e in array) if (array[e] === val) return e
    return false
}

function hasItem(array, item) {
    for (let e of array) if (e === item) return true
    return false
}
