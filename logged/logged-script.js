const header = element("headerText");
const input = element("itemInput");
const list = element("itemList");
let user = null;


// CALLBACKS DO BANCO DE DADOS ///////////////////////////////////////////////////////////////////////////////////

const onQuerySuccess = (operation, content) => {
    switch(operation){
        case "get-logged":
            console.log("user which is logged in:", content);
            if(content) return setUser(content);
            else goBack();
            break;
        case "logout":
            console.log("just logged out:", content);
            goBack();
            break;
        case "save":
            console.log("saved successfully:", content);
            break;
        default: console.log(operation, content);
    }
}


const onQueryError = (operation, content) => {
    console.warn(`${operation} went wrong: `, content);
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////


const updateUser = () => {
    saveUserOnDatabase(user, onQuerySuccess, onQueryError);
}


const logoutUser = () => {
    userLogoutFromDatabase(onQuerySuccess, onQueryError);
}


const setUser = (newUser) => {
    header.innerText = `Welcome, ${newUser.username}`;
    user = {...newUser};
    renderItems();
}


const renderItems = () => {
    if(!user) return;
    let rendered ="";
    user.list.forEach((item, index) => {
        rendered += `<li class="item">
            <button id=${index} class="x" onclick="removeItem(id)">
                X
            </button>
            <p>
                ${item}
            </p>
        </li>`
    });
    list.innerHTML = rendered;
}


const removeItem = (id) => {
    if(!user.list[id]) return;
    user.list.splice(id, 1);
    renderItems();
    updateUser();
}


const addItem = () => {
    if(!input.value || !input.value.length) return;
    user.list.push(input.value.trim().replace(/[\<\>]+/g, ""));
    input.value = "";
    input.focus();
    renderItems();
    updateUser();
}


const onKeyPressed = (e) => {
    switch(e.key){
        case "Enter": addItem();
    }
}

getLoggedInUserFromDatabase(onQuerySuccess, onQueryError);
document.addEventListener("keypress", onKeyPressed);