"use strict";
/* exported data */
const key = 'savedArtworks';
const data = {
    savedArtworks: [],
    currentView: 'home',
};
function saveToLocalStorage() {
    localStorage.setItem(key, JSON.stringify(data));
}
function getFromLocalStorage() {
    const localStorageJSON = localStorage.getItem(key);
    const data = JSON.parse(localStorageJSON);
    return data;
}
