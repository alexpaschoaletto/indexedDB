const url = new URLSearchParams(window.location.search);
const title = element("title");
const text = element("text");
const action = url.get("action");
const user = {
    username: url.get("username"),
    password: url.get("password"),
    logged: "false",
    list: [],
};


// CALLBACKS DO BANCO DE DADOS ///////////////////////////////////////////////////////////////////////////////////

const onQuerySuccess = (operation, content) => {
    switch(operation){
        case "get":
            console.log("get successfully:", content);
            onSuccessfulGet(content);
        break;
        case "save":
            console.log("saved successfully:", content);
        break;
        case "login":
            console.log("just logged in:", content);
            window.location = "/logged";
        default:
            console.log(operation, content);
        break;
    }
}


const onQueryError = (operation, content) => {
    console.warn(`${operation} went wrong: `, content);
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////


const onSuccessfulGet = (databaseUser) => {
    switch(action){
        case "create": 
            if(databaseUser){
                title.innerText = "We're sorry, but...";
                text.innerText = "There's already an account with this username.";
                return;
            }
            title.innerText = "Welcome!";
            text.innerText = "your account has been created.";
            saveUserOnDatabase(user, onQuerySuccess, onQueryError);
            break;
        case "login": 
            console.log("login?");
            if(!databaseUser || (databaseUser.password != user.password)){
                title.innerText = "Hmmm... nothing here.";
                text.innerText = "There's no account with these credentials.";
                return;
            }
            userLoginOnDatabase(databaseUser, onQuerySuccess, onQueryError);
            break;
        default: goBack();
    }
}


const onCreationAttempt = () => {
    const newUsers = users?? [];
    if(newUsers.find(u => u.username === user.username)){
        title.innerText = "We're sorry, but...";
        text.innerText = "There's already an account with this username.";
        return;
    }
    title.innerText = "Welcome!";
    text.innerText = "your account has been created.";
    newUsers.push({...user, list: []});
    saveOnStorage("users", newUsers);
}


const onLoginAttempt = () => {
    title.innerText = "Hmmm... nothing here.";
    text.innerText = "There's no account with these credentials.";
    if(!users) return;
    if(users.find(u => (
        (u.username === user.username) &&
        (u.password === user.password)
    ))){
        saveOnStorage("logged", {name: user.username});
        window.location = "/logged";
    }
}


const onKeyPressed = (e) => {
    switch(e.key){
        case "Enter": goBack();
    }
}

getUserFromDatabase(user.username, onQuerySuccess, onQueryError);
document.addEventListener("keypress", onKeyPressed);