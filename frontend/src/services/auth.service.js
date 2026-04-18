import http from "../http-common";

function login(username, password) {
    var data = {
        username: username,
        password: password
    };
    console.log(data)
    return http
        .post("/auth/signin", data)
        .then(response => {
        if (response.data.token) {
            localStorage.setItem('user', JSON.stringify(response.data));
        }
        return response.data;
    });
}

function logout() {
    localStorage.removeItem('user'); 
}
function register(username, password, role, phoneNumber) {
    var data = {
        username: username,
        password: password,
        role: role,
        phoneNumber: phoneNumber
    };
    return http.post("/auth/signup", data);
}

const exportedObject = {
    login: login,
    logout: logout,
    register: register
};

export default exportedObject;
