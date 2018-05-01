/* Get todos on page load */
document.addEventListener('DOMContentLoaded', () => {
    call(`/get-todos`).then(res => {
        console.log(res)
        if (!res.error) {
            res.forEach(entry => {
                createTaskGroup(entry[0].group_name, entry[0].group_id)
            })

            /* Show content when page it is loaded */
            const loading = document.querySelector('loading')
            const content = document.querySelector('content')

            loading.style.display = 'none'
            content.style.display = 'block'
        }
    })
})

/* Creating a new Todo-Group */
document.addEventListener('DOMContentLoaded', () => {
    const newGroup_name_input = document.querySelector('#newGroup-name-input')
    const newGroup_wrapper = document.querySelector('#newGroup-wrapper')
    const newGroup_button = document.querySelector('#newGroup-button')
    const newGroup_submit_button = document.querySelector(
        '#newGroup-submit-button'
    )

    /* New Group button click */
    newGroup_button.addEventListener('click', function() {
        /* Hide self */
        this.style.display = 'none'

        /* Show Group Wrapper */
        newGroup_wrapper.style.display = 'flex'

        /* Step into input box */
        newGroup_name_input.focus()
    })

    /* Submit new Group */
    newGroup_submit_button.addEventListener('click', function() {
        const groupName = newGroup_name_input.value

        /* Check if group name is valid */
        if (groupName) {
            call(`/create-group`, { groupName }).then(res => {
                if (!res.error) {
                    /* Reset input text */
                    newGroup_name_input.value = ''

                    /* Reactivate new group button */
                    newGroup_button.style.display = 'block'

                    /* Hide new group input form */
                    newGroup_wrapper.style.display = 'none'

                    /* Create TaskGroup element */
                    createTaskGroup(res.name, res.id)
                }
            })
        }
    })
})

/**
 * Creates a new todo-group and inserts it into the DOM
 * @param {string} name The name of the group, that is present in the headline
 * @param {number} groupid ID of the group that is very important
 */
function createTaskGroup(name, groupid = -1) {
    if (groupid === -1) {
        console.error('Cant create a group with the ID of -1')
        return
    }
    const template = `
        <div class="row">
            <div data-groupid="${groupid}" class="group--headline">
                <div>
                    <i class="icon--accordion"></i>
                    <span>${name}</span>
                </div>
                <button></button>
            </div>
            <ul data-groupid="${groupid}" class="todo--list"></ul>
        </div>`
    document.querySelector('content').insertAdjacentHTML('beforeEnd', template)
}
