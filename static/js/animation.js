document.addEventListener('DOMContentLoaded', function() {
    //Navigation left
    let headerNavMain = document.querySelector('.header--nav--main')
    let headerNavMainTriggerd = document.querySelector('.header--nav--main>ul')
    headerNavMain.addEventListener('click', function() {
        headerNavMainTriggerd.classList.toggle('triggered')
    })
    //Navigation right
    let headerNavProfil = document.querySelector('.header--nav--profil')
    let headerNavProfilTriggerd = document.querySelector(
        '.header--nav--profil>ul'
    )

    headerNavProfil.addEventListener('click', function() {
        headerNavProfilTriggerd.classList.toggle('triggered')
    })
})
