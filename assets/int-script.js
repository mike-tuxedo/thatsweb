console.log(`%cInitialization script loaded at ${new Date().toLocaleTimeString()}`, 'color: #4CAF50; font-weight: bold');
console.log('This script initializes core functionality for the web application.');

const $ = (query) => document.querySelector(query);
const $$ = (query) => document.querySelectorAll(query);

function toggleMobileMenu() {
    const menuLevel1 = $('header nav > ul');

    menuLevel1.classList.toggle('show');
}

window.addEventListener('load', () => {

})