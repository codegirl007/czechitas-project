import { Carousel } from './components/carousel/carousel.js';
import { Day } from './components/day/day.js';



// ***CAROUSEL HEADER***
const carousel = document.querySelector('app-carousel');

fetch('http://localhost:3000/news.json')
    .then(serverResponse => serverResponse.text())
    .then(responseText => {
      const data = JSON.parse(responseText);
      carousel.populateNewsCarousel(data.articles);
    });


const mainContent = document.querySelector('section.main-content');

// const currentDate = new Date();

// const maxDate = new Date(
//   currentDate.getFullYear(),
//   currentDate.getMonth() + 1, 0).getDate();
//   console.log(maxDate)

// for (let i = 1; i <= maxDate; i++) {
//     const dayDate = new Date(
//       currentDate.getFullYear(), 
//       currentDate.getMonth(), i);
//     mainContent.appendChild(new Day(dayDate));
// }


// ***DOMÁCÍ ÚKOL 6 - SELECTS FOR MONTH, YEAR ***

const selectsDiv = document.querySelector('.selects'); 

let CURRENT_YEAR = new Date().getFullYear();
let CURRENT_MONTH = new Date().getMonth();
let CURRENT_DATE = new Date(CURRENT_YEAR, CURRENT_MONTH);

const MONTHS = ["leden", "únor", "březen", "duben", "květen", "červen", "červenec", "srpen", "září", "říjen", "listopad", "prosinec"];
const MINYEAR = CURRENT_YEAR - 80;
const MAXYEAR = CURRENT_YEAR + 20;

populateDays(CURRENT_YEAR, CURRENT_MONTH);

const selectMonth = document.createElement('select');
selectMonth.classList.add('select-months');
selectsDiv.appendChild(selectMonth);

MONTHS.forEach(month  => {
  const option = document.createElement('option');
  option.setAttribute('value', month);
  option.innerText = `${month}`;
  option.classList.add('month');
  selectMonth.appendChild(option);
  if (month === MONTHS[CURRENT_MONTH]) {
    option.setAttribute('selected', 'selected');
  }
})

const selectYear = document.createElement('select');
selectYear.classList.add('select-years');
selectsDiv.appendChild(selectYear);

for (let i = MINYEAR; i < MAXYEAR + 1; i++ ) {
  const option = document.createElement('option');
  option.setAttribute('value', i);
  option.innerText = i;
  option.classList.add('year');
  selectYear.appendChild(option);
  if (i === CURRENT_YEAR) {
    option.setAttribute('selected', 'selected');
  }
}

selectMonth.addEventListener('change', event => {
  
  const CURRENT_MONTH = MONTHS.indexOf(event.target.value);
  console.log(CURRENT_MONTH)
  removeDays();
  populateDays(CURRENT_YEAR, CURRENT_MONTH); 
})

selectYear.addEventListener('change', event => {
  const selectedYearString = event.target.value;
  CURRENT_YEAR = parseInt(selectedYearString);
  console.log(CURRENT_YEAR)
  removeDays();
  populateDays(CURRENT_YEAR, CURRENT_MONTH);  
})

function removeDays () {
  document.querySelectorAll("app-day").forEach(day => day.parentNode.removeChild(day));
}

function populateDays (currentyear, currentmonth) {

   CURRENT_DATE = new Date(currentyear, currentmonth);

  let maxDate = new Date(
    CURRENT_DATE.getFullYear(),
    CURRENT_DATE.getMonth() + 1, 0).getDate();
    console.log(maxDate);  
  
  for (let i = 1; i <= maxDate; i++) {
      const dayDate = new Date(
        CURRENT_DATE.getFullYear(), 
        CURRENT_DATE.getMonth(), i);
      mainContent.appendChild(new Day(dayDate));

      const divDays = document.querySelectorAll("#day-number");
      for (let day of divDays) {
         day.id = dayDate.getDate();
          if ((day.id == new Date().getDate()) && currentmonth == new Date().getMonth() && currentyear == new Date().getFullYear()) 
          { day.parentNode.style.backgroundColor = "red" }
      }      
  }
}


// ***DAY MODAL***
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
        // object.key = value;
        // object['key'] = value;
        object[key] = value;
        // object.gender = 'Female'
      }
      
      const isHoliday = formData.get('isHolidayControl') === 'on';
  });

   

    document.body.appendChild(modal);
    
    const checkbox = document.querySelector('#limitAttendeesByGender');
    const genderRole = document.querySelector('#genderSelectRow');
    checkbox.addEventListener('change', (event) => {
        if (event.target.checked === true){
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
        console.log(contactsArray)
    });


    const radioButtons = document.querySelectorAll('#genderSelectRow > input');
    
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
        // select.innerHTML = '<option value = " "></option>'
        

        const oldOptions = document.querySelectorAll('.generated-option');
        oldOptions.forEach(opt => {
          // opt.remove();
          select.removeChild(opt)
        })

        // select.innerHTML = '<option value=" "></option>';

        contactsArray.forEach(it => {
            const option = document.createElement('option');
            option.setAttribute('value', it.id);
            option.innerText = `${it.first_name} ${it.last_name}`;
            option.classList.add('generated-option');
            select.appendChild(option);
        });

}


window.showModal = showDayModal;

// *** DOMÁCÍ ÚKOL 5 SHOWTIME*** //



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