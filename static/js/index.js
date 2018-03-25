/*let test = 123
 let test2 = 'test'

 call(`/overview/rn/`, {
 test,
 test2
 })
 .then(res => {
 console.log(res)
 })*/


document.querySelectorAll('.todo-checkbox').forEach((item) => {
    item.addEventListener('change', () => {
        let pi = item.parentNode.classList
        item.checked ? pi.add('wrapper--checkbox--done') : pi.remove('wrapper--checkbox--done')
    })
})