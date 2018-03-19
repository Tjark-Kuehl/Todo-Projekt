// Informationen, die sichtbar sein sollen:
// - Title
// - Erstellungdatum / Erstellt vor (... Tagen)
// - Erstellt von
// - Detailinformationen
// - Zugewiesen an

// .Modal-contentHeadline
// .Modal-contentDate
// .Modal-contentAuthor
// .Modal-contentDetailContainer
// .Modal-contentWorker

window.addEventListener('load', function() {
  // Immer const benutzen, es sei denn, ihr veränder die variable... (╯°□°）╯︵ ┻━┻
  const modal = document.querySelector('.Modal');
  const modalTitle = document.querySelector('.Modal-contentHeadline');
  const modalDate = document.querySelector('.Modal-contentDate');
  const modalAuthor = document.querySelector('.Modal-contentAuthor');
  const modalDetails = document.querySelector('.Modal-contentDetailContainer');
  const modalWorker = document.querySelector('.Modal-contentWorker');
  const allTasks = document.querySelectorAll('.row--task');

  // Event Listener einrichten
  allTasks.forEach((task) => {
    task.addEventListener('click', () => {
      // Hier dann dynamisch werden. (Mit Datenbank und so)
      modalTitle.innerHTML = '---Title---';
      modalDate.innerHTML = '01.01.1900';
      modalAuthor.innerHTML = 'Lorem Tester';
      modalDetails.innerHTML = '┻━┻︵  \(°□°)/ ︵ ┻━┻ ';
      modalWorker.innerHTML = 'Mee :)';
      modal.style.display = 'block';

      // Schließen Button :)
      document.querySelector('.Modal-close').addEventListener('click', () => {
        modalTitle.innerHTML = '';
        modalDate.innerHTML = '';
        modalAuthor.innerHTML = '';
        modalDetails.innerHTML = '';
        modalWorker.innerHTML = '';
        modal.style.display = 'none';
      });
    });
  });

});
