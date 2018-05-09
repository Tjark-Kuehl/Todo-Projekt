/* Get todos on page load */
document.addEventListener('DOMContentLoaded', () => {
    call(`/get-todos`).then(res => {
        if (!res.error) res.forEach(entry => loadTaskGroup(entry))

        /* Show content when page it is loaded */
        const loading = document.querySelector('loading')
        const content = document.querySelector('content')

        loading.style.display = 'none'
        content.style.display = 'block'
        _init()
    })
})

/* Creating a new Todo-Group */
document.addEventListener('DOMContentLoaded', () => {
    const new_group_control = document.querySelector('#new--group--control')

    const new_group_name = document.querySelector('#new--group--name')
    const new_group_submit = document.querySelector('#new--group--submit')

    if (new_group_control) {
        new_group_control.addEventListener('click', function() {
            for (let el of new_group_control.children) {
                /* Early break when el is hidden  */
                if (el.style.display === 'none') break

                /* If its not the first div and element is not hidden */
                if (el !== this.children[0] || el.style.display !== 'none') {
                    for (let checkEl of new_group_control.children) {
                        if (checkEl !== el) {
                            /* Show Other Content */
                            checkEl.style.display = 'flex'

                            /* Step into input box */
                            new_group_name.focus()

                            /* Submit new Group onClick */
                            new_group_submit.addEventListener(
                                'click',
                                event => {
                                    /* Stop click event bubbeling */
                                    event.stopPropagation()

                                    /* Submits new todo-group */
                                    submitNewGroup(new_group_name.value)

                                    /* Clear input */
                                    new_group_name.value = ''

                                    /* Hide Other Content */
                                    checkEl.style.display = 'none'

                                    /* Show self */
                                    el.style.display = 'flex'
                                }
                            )
                        } else {
                            /* Hide self */
                            checkEl.style.display = 'none'
                        }
                    }
                    break
                }
            }
        })
    }
})

function _init() {
    /* Extend todo-groups */
    document
        .querySelectorAll('.group--headline')
        .forEach(el => initTodoGroup(el))

    /* Check todos */
    document.querySelectorAll('.todo--item').forEach(el => initTodo(el))
}

/**
 * Initializes a todo group (EventListeners & functions)
 * @param {Element} el Group headline element
 */
function initTodoGroup(el) {
    /* Shows / Hides todo list */
    el.addEventListener('click', () => {
        toggleTodoGroup(el.dataset.groupid, true)
    })

    /* Get todo add button */
    const addTodoButton = filterElementsByDataset(
        '.group--headline > button',
        'groupid',
        el.dataset.groupid
    )

    addTodoButton.addEventListener('click', event => {
        /* Stop click event bubbeling */
        event.stopPropagation()

        /* Toggle todo group if ! already toggled */
        if (!isTodoGroupToggled(el.dataset.groupid))
            toggleTodoGroup(el.dataset.groupid)

        /* Get todo wrapper & controls */
        const new_todo_wrapper = filterElementsByDataset(
            '.todo--item',
            'groupid',
            el.dataset.groupid
        )

        const new_todo_name = filterElementsByDataset(
            '[name="new--todo--name[]"]',
            'groupid',
            el.dataset.groupid
        )

        const new_todo_submit = filterElementsByDataset(
            '[name="new--todo--submit[]"]',
            'groupid',
            el.dataset.groupid
        )

        if (new_todo_wrapper && new_todo_name && new_todo_submit) {
            /* Show todo wrapper */
            new_todo_wrapper.style.display = 'flex'

            /* Submit by button click */
            new_todo_submit.addEventListener('click', event => {
                /* Stop click event bubbeling */
                event.stopPropagation()

                /* Check if name has a length */
                if (new_todo_name.value.length) {
                    submitNewTodo(el.dataset.groupid, new_todo_name.value)

                    /* Reset new todo name input */
                    new_todo_name.value = ''

                    /* Hide todo wrapper */
                    new_todo_wrapper.style.display = 'none'
                }
            })
        }
    })
}

/**
 * Initializes a todo (EventListeners & functions)
 * @param {Element} el todo item element
 */
function initTodo(el) {
    el.addEventListener('click', () => {
        if (el.dataset.todoid) {
            /* Toggle todo style */
            if (el.classList.contains('todo--item--done')) {
                el.classList.remove('todo--item--done')
            } else {
                el.classList.add('todo--item--done')
            }

            /* Toggle todo in server */
            call(`/toggle-todo`, {
                todo_id: el.dataset.todoid
            })
        }
    })
}

/**
 * Checks if todo group is toggled
 * @param {number} groupid ID of group to toggle
 */
function isTodoGroupToggled(groupid) {
    const todoHeadline = filterElementsByDataset(
        '.group--headline',
        'groupid',
        groupid
    )
    return todoHeadline.classList.contains('group--headline--active')
}

/**
 * Shows / Hides todo group
 * @param {number} groupid ID of group to toggle
 * @param {boolean} checkChildren Check if it has todos
 */
function toggleTodoGroup(groupid, checkChildren = false) {
    const todoHeadline = filterElementsByDataset(
        '.group--headline',
        'groupid',
        groupid
    )
    const todoList = filterElementsByDataset('.todo--list', 'groupid', groupid)

    /* Check if list has items */
    if (todoList.children.length > 1 || !checkChildren) {
        todoList && todoList.style.display == 'none'
            ? (todoList.style.display = 'flex')
            : (todoList.style.display = 'none')

        todoHeadline.classList.toggle('group--headline--active')

        /* Switch Icon rotation */
        const icon = filterElementsByDataset(
            '.icon--accordion',
            'groupid',
            groupid
        )
        icon && !icon.style.transform
            ? (icon.style.transform = 'rotate(-90deg)')
            : (icon.style.transform = '')
    }
}

/**
 * Submits a new todo group to the server
 * @param {string} groupName Name of the todo group
 */
function submitNewGroup(groupName) {
    /* Check if group name is valid */
    if (groupName)
        call(`/create-group`, { groupName }).then(res => {
            if (!res.error) {
                /* Create TaskGroup element */
                loadTaskGroup({
                    group_id: res.id,
                    group_name: res.name
                })

                /* Init Todo group */
                const groupEl = filterElementsByDataset(
                    '.group--headline',
                    'groupid',
                    res.id
                )
                initTodoGroup(groupEl)
            }
        })
}

/**
 * Submits a new todo to the server
 * @param {number} groupid ID of the todo group
 * @param {string} todoName Name of the todo
 */
function submitNewTodo(groupid, todoName) {
    /* Check if group id and todo name is valid */
    if (groupid && todoName)
        call(`/create-todo`, { groupid, todoName }).then(res => {
            if (!res.error) {
                insertTodo(groupid, res.id, res.text, res.created)
            }
        })
}

/**
 * Creates a new todo-group and inserts it into the DOM
 * @param {*} params Deconstructed JSON response
 */
function loadTaskGroup({ group_id, group_name, json }) {
    const template = `
        <div class="row">
            <div data-groupid="${group_id}" class="group--headline">
                <div>
                    <i data-groupid="${group_id}" class="icon--accordion"></i>
                    <span>${group_name}</span>
                </div>
                <button data-groupid="${group_id}"></button>
            </div>
            <ul data-groupid="${group_id}" class="todo--list" style="display: none">
                <li data-groupid="${group_id}" class="todo--item" style="display: none; justify-content: flex-start">
                    <input name="new--todo--name[]" data-groupid="${group_id}" class="input" placeholder="Neues Todo">
                    <button name="new--todo--submit[]" data-groupid="${group_id}" class="btn btn--submit">Erstellen</button>
                </li>
                ${json ? loadTodos(json) : ''}
            </ul>
        </div>`
    document.querySelector('content').insertAdjacentHTML('beforeEnd', template)
}

/**
 * Loads and creates all todos from a JSON response
 * @param {JSON} json JSON object containing all todo-groups + todos
 */
function loadTodos(json) {
    let todos = ''
    for ({ todo_id, todo_text, todo_done, todo_created } of json) {
        if (!todo_id) continue
        todos += `
            <li data-todoid="${todo_id}" class="todo--item
            ${todo_done ? ' todo--item--done' : ''}">
                <div class="start">
                    <div data-todoid="${todo_id}" class="todo--checkbox"></div>
                    <span name="todo--title[]">${todo_text}</span>
                </div>
                <div class="end">
                    <span name="todo--date[]">
                        ${toGermanDatetime(todo_created)}
                    </span>
                    <button data-todoid="${todo_id}" class="remove" onClick="removeTodo(event, this)"></button>
                </div>
            </li>`
    }
    return todos
}

/**
 * Inserts a new todo in a already initialized todo group
 * @param {number} group_id ID of the todo group
 * @param {number} todo_id ID of the todo
 * @param {string} todo_text Todo text
 * @param {datetime} todo_created When the todo was created
 * @param {boolean} todo_done Is the todo marked as done ?
 */
function insertTodo(
    group_id,
    todo_id,
    todo_text,
    todo_created,
    todo_done = false
) {
    if (todo_id && todo_text && todo_created) {
        /* Todo Group */
        const groupEl = filterElementsByDataset(
            '.todo--list',
            'groupid',
            group_id
        )

        /* Insert new Todo */
        if (groupEl)
            groupEl.insertAdjacentHTML(
                'beforeEnd',
                loadTodos([
                    {
                        todo_id,
                        todo_text,
                        todo_done,
                        todo_created
                    }
                ])
            )

        /* Init Todo item */
        const todoEl = filterElementsByDataset('.todo--item', 'todoid', todo_id)
        initTodo(todoEl)

        return !!groupEl
    }
    return false
}

const options = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
}

/**
 * Formats a datetime to a german datetime
 * @param {datetime} datetime Any datetime
 */
function toGermanDatetime(datetime) {
    return new Date(datetime).toLocaleDateString('de-DE', options)
}

/**
 * Filters an element array for an dataset, then checks if the values are correct
 * and returns the element that is correct
 * @param {string} selector A selector for document.querySelectorAll(...)
 * @param {string} dataset Dataset to check
 * @param {string} checkval Value to check if the condition is met. Like a ID or something
 */
function filterElementsByDataset(selector, dataset, checkval) {
    const sel = document.querySelectorAll(selector)
    if (sel) {
        for (let entry of sel) {
            if (!entry || !entry.dataset) continue
            if (
                Object.keys(entry.dataset)[0] === dataset &&
                Object.values(entry.dataset)[0] == checkval
            )
                return entry
        }
    }
    return false
}

function removeTodo(event, el) {
    event.stopPropagation()

    if (el.dataset) {
        const todo_id = Object.values(el.dataset)[0]

        const removeEl = filterElementsByDataset(
            '.todo--item',
            'todoid',
            todo_id
        )

        if (removeEl) {
            removeEl.remove()
        }

        call('/remove-todo', {
            todo_id
        }).then(res => {
            if (res.error) {
                console.error(res.error.msg)
            }
        })
    }
}
