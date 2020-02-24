$(document).ready(function () {

    var accommodation = null;
    const submitEl = document.getElementById('submit');
    const accommodationCard = document.getElementById('app');
    const accommodationCardClass = document.querySelector('.app');
    const selectCity = document.getElementById('city');
    const selectGuests = document.getElementById('guests');
    const selectNights = document.getElementById('nights');
    const searchArea = document.querySelector('.search-area');
    const resultsHeading = document.getElementById('sr-heading');
    const backButton = document.querySelector('.back-button');
    const overlay = document.getElementById('overlay');
    const menuImage = document.getElementById('modal-image');
    const bottomPadding = document.getElementById('bottom-padding');


    function init() {
        $.getJSON('json/accommodation.json', function (data) {
            accommodation = data.accommodation;
        });

        submitEl.addEventListener('click', function (evt) {
            evt.preventDefault();
        });
        accommodationCardClass.style.display = 'none';
        resultsHeading.style.display = 'none';
        backButton.style.display = 'none';
        bottomPadding.style.display = 'none';
    }

    // HTML TEMPLATE

    function hotelTemplate(hotel) {
        var templateHTML = `
    <div class="hotel-template hotel-${hotel.id}" id="hotel-${hotel.id}">
        <img class="hotel-image" src="${hotel.imgSource}">
        <div class="hotel-price-column">
            <h2>${hotel.name}</h2>
            <h3>$${(hotel.price * selectGuests.value) * selectNights.value} total</h3>
        </div>
        <ul>`;
        $.each(hotel.features, function (i, feature) {
            templateHTML += `<li><a>${feature}</a></li>`;
        });
        templateHTML += `</ul>
        <button class="button booking"><a href="https://www.newzealand.com/int/accommodation/" target="_blank">Book online</a></button>
        <button class="button" data-modal-target="#modal" data-image="${hotel.menuImgSource}" id="button-menu">View meal options</button>
    </div>
    `;
        return templateHTML;
    }

    function displayAccommodation(accommodation) {
        var string = '';
        $.each(accommodation, function (i, hotel) {
            string = string + hotelTemplate(hotel);
        });
        accommodationCard.innerHTML = string;

        // MENU BUTTON - MODAL IMAGE

        const openModalButtons = document.querySelectorAll('[data-modal-target]');
        const closeModalButtons = document.querySelectorAll('[data-close-button]');

        openModalButtons.forEach(button => {
            button.addEventListener('click', (evt) => {
                var imgSource = evt.target.dataset.image;
                menuImage.setAttribute('src', imgSource);
                const modal = document.querySelector(button.dataset.modalTarget);
                openModal(modal);
            });
        });

        closeModalButtons.forEach(button => {
            button.addEventListener('click', () => {
                const modal = button.closest('.modal');
                closeModal(modal);
            });
        });

        overlay.addEventListener('click', () => {
            const modals = document.querySelectorAll('.modal.active');
            modals.forEach(modal => {
                closeModal(modal);
            });
        });
    }

    // MODAL FUNCTIONS

    function openModal(modal){
        if (modal == null) return;
        modal.classList.add('active');
        overlay.classList.add('active');
    }

    function closeModal(modal){
        if (modal == null) return;
        modal.classList.remove('active');
        overlay.classList.remove('active');
    }

    // FILTER ACCOMMODATION

    function filterGuests(accommodation) {
        var filter = [];
        let secondValue = selectGuests.value;
        $.each(accommodation, function (i, hotel) {
            if (hotel.capacity >= secondValue) {
                filter.push(hotel);
            }
        });
        return filter;
    }

    function filterCity(accommodation) {
        var filter = [];
        let firstValue = selectCity.value;
        $.each(accommodation, function (i, hotel) {
            if (hotel.city === firstValue) {
                filter.push(hotel);
            }
        });
        return filter;
    }

    function filterResults() {
        let results = filterGuests(accommodation);
        results = filterCity(results);
        displayAccommodation(results);
    }

    // SUBMIT BUTTON CLICK LISTENER

    submitEl.addEventListener('click', function () {
        if (selectNights.value < 1 || selectGuests.value < 1 || selectCity.value === null) {
            alert("No results, because you didn't select all of the options... You're obviously a bit of a ham sandwich");
        } else {
            filterResults();
            searchArea.style.display = 'none';
            resultsHeading.style.display = 'flex';
            accommodationCardClass.style.display = 'grid';
            backButton.style.display = 'flex';
            bottomPadding.style.display = 'flex';
        }
    });

    // RESET BUTTON 

    backButton.addEventListener('click', function () {
        location.reload();
    });

    init();

});

// Linting notes

//JShint.com is the linting tool that I used

// three undefinied variables: $, opacicty, and filter (in the filterCity function)
// rectified by changing opacity to a global variable, as it was previously declared in the displayAccomodation function, and adding declaring filter variable using let, as I forgot to do this previously
// also a bunch of semicolons I was told to add, although these are optional
// everything else was fine, just a bunch of notes saying const, let, arrow function syntax, and template literal syntax is available in ES6 which is fine as all modern browsers support this.