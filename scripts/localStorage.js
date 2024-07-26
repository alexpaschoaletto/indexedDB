const getFromStorage = (key) => {
    const value = window.localStorage.getItem(key);
    if(value) return JSON.parse(value);
    return null;
}

const saveOnStorage = (key, value) => {
    const stringified = JSON.stringify(value);
    window.localStorage.setItem(key, stringified);
}

const removeFromStorage = (key) => {
    window.localStorage.removeItem(key);
}