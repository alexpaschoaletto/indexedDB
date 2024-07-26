const url = new URLSearchParams(window.location.search);
const title = element("title");
const text = element("text");
const users = getFromStorage("users");

const action = url.get("action");
const user = {
    username: url.get("username"),
    password: url.get("password"),
};

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


switch(action){
    case "create": onCreationAttempt(); break;
    case "login": onLoginAttempt(); break;
    default: goBack();
}

const onKeyPressed = (e) => {
    switch(e.key){
        case "Enter": goBack();
    }
}

document.addEventListener("keypress", onKeyPressed);