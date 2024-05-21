export function saveUserDetailsInLocalStorage(user) {
    localStorage.setItem("resolutepos__user", JSON.stringify(user));
}

export function getUserDetailsInLocalStorage() {
    const userStr = localStorage.getItem("resolutepos__user");
    return JSON.parse(userStr);
}

export function clearUserDetailsInLocalStorage() {
    localStorage.removeItem("resolutepos__user");
}