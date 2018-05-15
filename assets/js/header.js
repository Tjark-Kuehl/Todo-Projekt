document.addEventListener('DOMContentLoaded', () => {
    //Navigation left
    document
        .querySelector('.header--nav--main')
        .addEventListener('click', () => {
            document
                .querySelector('.header--nav--main>ul')
                .classList.toggle('triggered')
        })
})
