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
        newGroup_wrapper.style.display = 'block'

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
                }
            })
        }
    })
})
