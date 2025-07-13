console.log('init skript loaded');

const $ = (query) => document.querySelector(query);
const $$ = (query) => document.querySelectorAll(query);

function toggleMobileMenu() {
    const menuLevel1 = $('header nav > ul');

    menuLevel1.classList.toggle('show');
}

window.addEventListener('load', () => {

})