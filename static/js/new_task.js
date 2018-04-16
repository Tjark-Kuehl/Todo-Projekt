document.addEventListener('DOMContentLoaded', () => {
    let newtask = document.querySelector('.btn--new_task')
    let rowTaskNew = document.querySelector('.row--task--new')

    newtask.addEventListener('click', () => {
        newtask.style.display = 'none'

        if (newtask.style.display === 'none') {
            let wrapperFirstinputs = document.createElement('div')
            wrapperFirstinputs.classList.add('form-wrapper')
            wrapperFirstinputs.classList.add('firstinputs')

            let taskSaveButton = document.createElement('button')
            taskSaveButton.classList.add('btn')
            taskSaveButton.classList.add('btn-save')
            taskSaveButton.innerText = 'Erstellen'

            let inputNewTaskHeadline = document.createElement('input')
            inputNewTaskHeadline.classList.add('new_task_headline')
            inputNewTaskHeadline.placeholder = 'Erstelle eine neue Gruppe!'

            let wrapperSecondinputs = document.createElement('div')
            wrapperSecondinputs.classList.add('form-wrapper')
            wrapperSecondinputs.classList.add('secondinputs')

            rowTaskNew.appendChild(wrapperFirstinputs)
            wrapperFirstinputs.appendChild(inputNewTaskHeadline)
            wrapperFirstinputs.appendChild(taskSaveButton)
        }
    })
})
