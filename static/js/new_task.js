window.addEventListener('load', function() {
    let newtask = document.querySelector('.btn--new_task')
    let rowTaskNew = document.querySelector('.row--task--new')

    newtask.addEventListener('click', function() {
        newtask.style.display = 'none'
        let xy = '<h1>hallo</h1>'

        if (newtask.style.display === 'none') {
            let wrapperFirstinputs = document.createElement('div')
            wrapperFirstinputs.classList.add('from-wrapper')
            wrapperFirstinputs.classList.add('firstinputs')

            let taskSaveButton = document.createElement('button')
            taskSaveButton.classList.add('btn')
            taskSaveButton.classList.add('btn-save')
            taskSaveButton.innerText = 'Erstellen'

            let inputNewTaskHeadline = document.createElement('input')
            inputNewTaskHeadline.classList.add('new_task_headline')
            inputNewTaskHeadline.placeholder = 'Gib einen neuen Task ein!'

            let wrapperSecondinputs = document.createElement('div')
            wrapperSecondinputs.classList.add('from-wrapper')
            wrapperSecondinputs.classList.add('secondinputs')

            let inputNewTaskDeadline = document.createElement('input')
            inputNewTaskDeadline.classList.add('new_task_deadline')
            inputNewTaskDeadline.placeholder = 'Bis wann muss das fertig?'

            let deadlineSaveButton = document.createElement('button')
            deadlineSaveButton.classList.add('btn')
            deadlineSaveButton.classList.add('btn-save')
            deadlineSaveButton.innerText = 'Erstellen'

            let wrapperlastinputs = document.createElement('div')
            wrapperlastinputs.classList.add('from-wrapper')
            wrapperlastinputs.classList.add('lastinputs')

            let optionForComment = document.createElement('button')
            optionForComment.classList.add('btn')
            optionForComment.classList.add('btn-save')
            optionForComment.innerText = 'Notiz hinzufügen'

            rowTaskNew.appendChild(wrapperFirstinputs)
            wrapperFirstinputs.appendChild(inputNewTaskHeadline)
            wrapperFirstinputs.appendChild(taskSaveButton)

            rowTaskNew.appendChild(wrapperSecondinputs)
            wrapperSecondinputs.appendChild(inputNewTaskDeadline)
            wrapperSecondinputs.appendChild(deadlineSaveButton)

            rowTaskNew.appendChild(wrapperlastinputs)
            wrapperlastinputs.appendChild(optionForComment)
        }
    })
})
