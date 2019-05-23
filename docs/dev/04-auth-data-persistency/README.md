## Use case analysis

1. User newly come to the SPA, fill in login form (or pressed social login button) and submit.
    - Several options:
        1. The SPA clear all user auth & data. Then the SPA do a fresh login, and request all user data.
            - Pros: guaranteed server database and SPA state are consistent.
            - Cons: unsaved user data might get lost and overwritten by server database data. Costy API request if no or little data change.
        1. The SPA clear user auth but not data. Then the SPA do a fresh login, and request all user data, but overwriting existing user data if overlapped.
            - Pros:
            - Cons: still need to do full, costy API request. May preserve unsaved change on the SPA end, but not likely because SPA only writes to (update) state if API request succeed.
1. User logged in previously, but stays on SPA for a long time such that token expired. Now user want to make a auth-required request.
    - The server will respond 403 Unauthorized.
1. User logged in previously, but closed tab & returned, or did a page refresh.
    - We want to avoid user re-typing credentials.

## Navigation Persistence

```tsx

function SPADidMount() {
    try {
        await login()
        router.history.push("/home/")
    }
    catch (err) {
        logout()
    }
}

function logout() {
    clearAuthData()
    clearUserData()
}

```

## Auth Persistence

```tsx

function login() {
    try {
        await fetchAuthCache()

        if (tokenExpired) {
            try {
                auth = await refreshLogin()
                storeAuthCache(auth)
                requestUserData()
            }
            catch (err) {
                // ...
            }
        }
        else {
            requestUserData()
        }
    }
    catch (err) {
        loginRequest()
    }
}

function fetchAuthCache() {
    return deserialize(localStorage)
}

function storeAuthCache(auth) {
    serialize(auth, localStorage)
}

function refreshLogin() {

}

function loginRequest() {

}

```

## Data Persistence

```tsx

function requestUserData() {
    listCompany()
    listApplication()
}

function listObjectCollection() {

}

```