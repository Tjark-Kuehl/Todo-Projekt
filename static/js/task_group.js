/* Get todos on page load */
document.addEventListener('DOMContentLoaded', () => {
    call(`/get-todos`).then(res => {
        if (!res.error) {
            res.forEach(entry => loadTaskGroup(entry))

            /* Show content when page it is loaded */
            const loading = document.querySelector('loading')
            const content = document.querySelector('content')

            loading.style.display = 'none'
            content.style.display = 'block'
            _init()
        }
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

                if (el !== this.children[0] || el.style.display !== 'none') {
                    for (let checkEl of new_group_control.children) {
                        if (checkEl !== el) {
                            /* Show Other Content */
                            checkEl.style.display = 'flex'

                            /* Step into input box */
                            new_group_name.focus()

                            /* Submit new Group onClick */
                            new_group_submit.addEventListener('click', e => {
                                e.stopPropagation()

                                /* Submits new todo-group */
                                submitNewGroup(new_group_name.value)

                                /* Clear input */
                                new_group_name.value = ''

                                /* Hide Other Content */
                                checkEl.style.display = 'none'

                                /* Show self */
                                el.style.display = 'flex'
                            })
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
            }
        })
}

/**
 * Gets called when initialization is completed
 */
function _init() {
    /* Extend todo-groups */
    document.querySelectorAll('.group--headline').forEach(el =>
        el.addEventListener('click', () => {
            // Shows / Hides todo list
            const todoList = filterElementsByDataset(
                '.todo--list',
                'groupid',
                el.dataset.groupid
            )

            // Check if list has items
            if (todoList.children.length) {
                todoList && todoList.style.display == 'none'
                    ? (todoList.style.display = 'flex')
                    : (todoList.style.display = 'none')
                el.classList.contains('group--headline--active')
                    ? el.classList.remove('group--headline--active')
                    : el.classList.add('group--headline--active')

                // Switch Icon rotation
                const icon = filterElementsByDataset(
                    '.icon--accordion',
                    'groupid',
                    el.dataset.groupid
                )
                icon && !icon.style.transform
                    ? (icon.style.transform = 'rotate(-90deg)')
                    : (icon.style.transform = '')
            }
        })
    )
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
                <button></button>
            </div>
            <ul data-groupid="${group_id}" class="todo--list" style="display: none">
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
            <li class="todo--item">
                <div>
                    <div class="checkbox--wrapper">
                        <input name="todo--check[]" type="checkbox" value="${todo_id}" 
                        ${todo_done ? 'checked="checked"' : ''}>
                    </div>
                    <span name="todo--title[]">${todo_text}</span>
                </div>
                <span name="todo--date[]">
                    ${toGermanDatetime(todo_created)}
                </span>
            </li>`
    }
    return todos
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
