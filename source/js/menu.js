'use strict'

const nav = document.querySelector('.navigation');
const toggle = document.querySelector('.page-header__button');
const toggleImageBurger = document.querySelector('.page-header__toggle-image--burger');
const toggleImageCross = document.querySelector('.page-header__toggle-image--cross');

nav.classList.remove('navigation--nojs');

toggle.addEventListener("click", (evt) => {
  evt.preventDefault();
  if(nav.classList.contains("navigation--closed")) {
    nav.classList.remove("navigation--closed");
    nav.classList.add("navigation--opened");
    toggleImageBurger.classList.add("visually-hidden");
    toggleImageCross.classList.remove("visually-hidden");
  }
  else {
    nav.classList.remove("navigation--opened");
    nav.classList.add("navigation--closed");
    toggleImageCross.classList.add("visually-hidden");
    toggleImageBurger.classList.remove("visually-hidden");
  }
});
