const user = getFromStorage("logged");
const header = element("headerText");
const input = element("itemInput");
const list = element("itemList");

const getUserList = () => {
    if(!user){
        goBack();
        return null;
    }
    const list = getFromStorage("users").find(u => u.username === user.name).list;
    return list?? [];
}

const items = getUserList();

const updateUser = () => {
    const users = getFromStorage("users");
    console.log(users);
    const index = users.findIndex(u => u.username === user.name);
    if(index === -1) return;
    users[index].list = [...items];
    saveOnStorage("users", users);
}

const renderItems = () => {
    let rendered ="";
    items.forEach((item, index) => {
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
    if(!items[id]) return;
    items.splice(id, 1);
    renderItems();
    updateUser();
}


const addItem = () => {
    if(!input.value || !input.value.length) return;
    items.push(input.value.trim().replace(/[\<\>]+/g, ""));
    input.value = "";
    input.focus();
    renderItems();
    updateUser();
}


const logout = () => {
    removeFromStorage("logged");
    goBack();
}


const onKeyPressed = (e) => {
    switch(e.key){
        case "Enter": addItem();
    }
}

renderItems();
header.innerText = `Welcome, ${user.name}`;
document.addEventListener("keypress", onKeyPressed);
