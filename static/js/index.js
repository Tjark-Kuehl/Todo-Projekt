let test = 123
let test2 = 'test'

call(`/overview/rn/`, {
    test,
    test2
})
    .then(res => {
        console.log(res)
    })
