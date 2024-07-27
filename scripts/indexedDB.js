/*
    Para mais informações sobre o indexedDB:
    https://javascript.info/indexeddb

    Aqui você verá o básico da implementação do
    indexedDB usando apenas a API original, sem
    recorrer a bibliotecas externas. É uma api
    meio verbosa, mas não é difícil de entender.
*/

const indexedDB = (
    window.indexedDB ||
    window.mozIndexedDB ||
    window.webkitIndexedDB ||
    window.msIndexedDB ||
    window.shimIndexedDB
);


const request = indexedDB.open("database", 1);                          

request.onupgradeneeded = () => {
    /*
        Este callback ocorre quando a DB foi criada
        pela primeira vez ou recebeu uma atualização
        de versão. A versão é o segundo argumento
        passado em indexedDB.open(). Aqui é o lugar
        em que criamos o banco de dados e as tabelas
        (stores) que fazem parte dele.
    */
    const database = request.result;
    const users = database.createObjectStore("users", { keyPath: "username" });
    users.createIndex("logged_index", ["logged"], { unique: false });
    database.close();
} 


const getUserFromDatabase = (name, onQuerySuccess) => {
    const request = indexedDB.open("database");
    request.onsuccess = () => {
        const database = request.result;
        const transaction = database.transaction("users");
        const users = transaction.objectStore("users");
        const query = users.get(name);
        query.onsuccess = () => onQuerySuccess("get", query.result);
        query.onerror = () => onQueryError("get", query.error);
        transaction.oncomplete = () => database.close();
    }
}


const getLoggedInUserFromDatabase = (onQuerySuccess, onQueryError) => {
    const request = indexedDB.open("database");
    request.onsuccess = () => {
        const database = request.result;
        const transaction = database.transaction("users");
        const users = transaction.objectStore("users");
        const index = users.index("logged_index");
        const query = index.get(["true"]);
        query.onsuccess = () => {
            if(!query.result) return onQuerySuccess("get-logged", null);
            onQuerySuccess("get-logged", query.result);
        }
        query.onerror = () => onQueryError("get-logged", query.error);
        transaction.oncomplete = () => database.close();
    }
}


const userLoginOnDatabase = (user, onQuerySuccess, onQueryError) => {
    const request = indexedDB.open("database");
    request.onsuccess = () => {
        const database = request.result;
        const transaction = database.transaction("users", "readwrite");
        const users = transaction.objectStore("users");
        const query = users.put({...user, logged: "true"});
        query.onsuccess = () => onQuerySuccess("login", query.result);
        query.onerror = () => onQueryError("login", query.error);
        transaction.oncomplete = () => database.close();
    }
}


const userLogoutFromDatabase = (onQuerySuccess, onQueryError) => {
    const request = indexedDB.open("database");
    request.onsuccess = () => {
        const database = request.result;
        const transaction = database.transaction("users", "readwrite");
        const users = transaction.objectStore("users");
        const index = users.index("logged_index");
        const query1 = index.get(["true"]);
        query1.onsuccess = () => {
            if(!query1.result) return;
            const query2 = users.put({...query1.result, logged: "false"});
            query2.onsuccess = () => onQuerySuccess("logout", query2.result);
            query2.onerror = () => onQueryError("logout", query2.error);
        }
        query1.onerror = () => onQueryError("logout", query1.error);
        transaction.oncomplete = () => database.close();
    }
}


const saveUserOnDatabase = (user, onQuerySuccess, onQueryError) => {
    const request = indexedDB.open("database");
    request.onsuccess = () => {
        const database = request.result;
        const transaction = database.transaction("users", "readwrite");
        const users = transaction.objectStore("users");
        const query = users.put(user);
        query.onsuccess = () => onQuerySuccess("save", query.result);
        query.onerror = () => onQueryError("save", query.error);
        transaction.oncomplete = () => database.close();
    }
}


const removeUserFromDatabase = (user, onQuerySuccess, onQueryError) => {
    const request = indexedDB.open("database");
    request.onsuccess = () => {
        const database = request.result;
        const transaction = database.transaction("users", "readwrite");
        const users = transaction.objectStore("users");
        const query = users.delete(user.username);
        query.onsuccess = () => onQuerySuccess("remove", query.result);
        query.onerror = () => onQueryError("remove", query.error);
        transaction.oncomplete = () => database.close();
    }
}