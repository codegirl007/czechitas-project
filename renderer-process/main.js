import { Carousel } from './components/carousel/carousel.js';
import { Day } from './components/day/day.js';

const carousel = document.querySelector('app-carousel');


fetch('http://localhost:3000/news.json')
    .then(serverResponse => serverResponse.text())
    .then(responseText => {
      const data = JSON.parse(responseText);
      carousel.populateNewsCarousel(data.articles);
    });

const mainContent = document.querySelector('section.main-content');

const currentDate = new Date();
const maxDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();

for (let i = 1; i <= maxDate; i++) {
    const dayDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), i);
    mainContent.appendChild(new Day(dayDate));
}



function showDayModal() {
    const template = document.querySelector('#modal-template');
    const modal = template.content.cloneNode(true);
    const closeAction = () => {
        const child = document.querySelector('section.modal-container');
        document.body.removeChild(child);
    };
    modal.querySelector('#close-modal').addEventListener('click', closeAction);
    const cancelButton = modal.querySelector('#cancel-button');
    cancelButton.addEventListener('click', closeAction);

    modal.querySelector('#save-button').addEventListener('click', () => {
      const formRef = document.querySelector('#modal-form');
      const formData = new FormData(formRef);
      const data = formData.entries();

      const object = {};

      for (let formValue of data) {
        const key = formValue[0];
        const value = formValue[1];
        object.key = value;
        object['key'] = value;
        object[key] = value;
      }
      

  });

   

    document.body.appendChild(modal);
    
    const checkbox = document.querySelector('#limitAttendeesByGender');
    const genderRole = document.querySelector('#genderSelectRow');
    checkbox.addEventListener('change', (event) => {
        if (event.target.checked){
            genderRole.classList.remove('hidden')
        } else {
            genderRole.classList.add('hidden')
        }
    })
    
    let contactsArray;
    fetch('http://localhost:3000/contacts')
        .then(serverResponse => serverResponse.text())
        .then(responseText => {
        contactsArray = JSON.parse(responseText);      
        createOptions(contactsArray);
        
    });


    const radioButtons = document.querySelectorAll('#genderSelectRow > input')
    
    for (let radio of radioButtons) {
      radio.addEventListener('change', () => {
          const formRef = document.querySelector('#modal-form');
          const formData = new FormData(formRef);
          const gender = formData.get('gender');
          const filteredContacts = contactsArray.filter((contact) => {
              return contact.gender === gender;
          });
          createOptions(filteredContacts);
      });
  }


  }
function createOptions(contactsArray) {
        const select = document.querySelector('#eventAttendees');
        

        const oldOptions = document.querySelectorAll('.hakunamatata');
        oldOptions.forEach(opt => {
          // opt.remove();
          select.removeChild()
        })

        // select.innerHTML = '<option value=" "></option>';

        contactsArray.forEach(it => {
            const option = document.createElement('option');
            option.setAttribute('value', it.id);
            option.innerText = `${it.first_name} ${it.last_name}`;
            option.classList.add('hakunamatata');
            select.appendChild(option);
        });

}


window.showModal = showDayModal;












// *** DOMÁCÍ ÚKOL 5 *** //



const showTime = () => {

  const clockContainer = document.querySelector('.clock-body');
  clockContainer.innerText = new Date().toLocaleTimeString();
  
  const showTimer = () => {    
    clockContainer.innerText = new Date().toLocaleTimeString();
  }
  
  const ticking = setInterval(() => showTimer() ,
   1000)
  
  const closeAction = () => {
    clearInterval(ticking);
    const child = document.querySelector('section.clock-container');
    document.body.removeChild(child);    
  };

  setTimeout(() => {      
    closeAction();  
  }, 5000);
}

const showClockModal = () => {
  const templateModal = document.querySelector('#clock-modal');
  const clockModal = templateModal.content.cloneNode(true);
  document.body.appendChild(clockModal); 
  showTime();  
}

let password = '';
window.addEventListener('keydown', (keyboardEvent) => { 
           
        password = password + keyboardEvent.key;
        password = password.slice(-4);
        console.log (password)
        if (password === 'time') {          
          showClockModal();            
        };
})



