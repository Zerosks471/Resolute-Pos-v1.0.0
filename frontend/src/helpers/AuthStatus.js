export function isRestroUserAuthenticated() {
    const restroAuthenticated = document.cookie.includes("resolutepos__authenticated=");
    return restroAuthenticated;
}