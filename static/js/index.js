/* Route guard */
if (!authenticated()) {
    setLocation('login')
}

document.querySelectorAll('.todo-checkbox').forEach(item => {
    item.addEventListener('change', () => {
        let pi = item.parentNode.classList
        item.checked
            ? pi.add('wrapper--checkbox--done')
            : pi.remove('wrapper--checkbox--done')
    })
})
