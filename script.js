// CALLBACKS DO BANCO DE DADOS ///////////////////////////////////////////////////////////////////////////////////

const onQuerySuccess = (operation, content) => {
    switch(operation){
        case "get-logged":
            console.log("is logged in:", content);
            if(content) window.location = "/logged";
            break;
        default:
            console.log(operation, content);
        break;
    }
}


const onQueryError = (operation, content) => {
    console.warn(`${operation} went wrong: `, content);
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////


getLoggedInUserFromDatabase(onQuerySuccess, onQueryError);