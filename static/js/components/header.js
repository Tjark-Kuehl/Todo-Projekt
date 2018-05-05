document.addEventListener('DOMContentLoaded', () => {
    //Navigation left
    document
        .querySelector('.header--nav--main')
        .addEventListener('click', () => {
            document
                .querySelector('.header--nav--main>ul')
                .classList.toggle('triggered')
        })

    //Navigation right
    document
        .querySelector('.header--nav--profil')
        .addEventListener('click', () => {
            document
                .querySelector('.header--nav--profil>ul')
                .classList.toggle('triggered')
        })
})
