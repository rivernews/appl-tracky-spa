## Use case analysis

1. User newly come to the SPA, fill in login form (or pressed social login button) and submit.
    - Several options:
        1. The SPA clear all user auth & data. Then the SPA do a fresh login, and request all user data.
            - Pros: guaranteed server database and SPA state are consistent.
            - Cons: unsaved user data might get lost and overwritten by server database data. Costy API request if no or little data change. **But this case assumes user is able to access login page (landing page), which means the user is not login at that point, or logged out.** Perhaps we can safely assume user data all cleared out in this case and there's no need to consider unsaved data.
                - We do want to consider clearing out all user auth & data in localStorage, to start everything over.
        1. The SPA clear user auth but not data. Then the SPA do a fresh login, and request all user data, but overwriting existing user data if overlapped.
            - Pros:
            - Cons: still need to do full, costy API request. May preserve unsaved change on the SPA end, but not likely because SPA only writes to (update) state if API request succeed.
1. User logged in previously, but stays on SPA for a long time such that token expired. Now user want to make a auth-required request. The server will respond 403 Unauthorized.
    - We want to avoid user re-typing credentials.
    - Ideally, we can prevent from getting a 403 response by looking at the token expiration time. Then, we try to refresh token before making a request.
    - In case refresh token is not successful, we then need the user to re-type credential, i.e., bring user to login page.
        - Make sure we save the request data first
    - User will do a fresh login. Right after that, we want to recover the request data & make the original request.
        - Make sure the user logins as the same user before. If not, make an alert, and, ideally, let user choose either try a different account, or clear session and start over (degrade to case 1).
    - Ideally, we redirect user back to the previous page before enforced to login page.
1. User logged in previously, but closed tab & returned, or did a page refresh.
    - We want to avoid user re-typing credentials.
    - User might have unsaved changes, e.g., filling a form. Ideally, we want to freeze the page refresh / tab closing. But a basic approach is to just ignore it and discard unsubmitted data.
    - When SPA is mounted, auth and user data are all lost in SPA state.
    - We will need the SPA to attempt login upon mounted, or at least check in localStorage if a previous session exists. 
        - We are able to distinguish this case from case 1: case 1 there should be no previous session in localStorage. If exists, then it's this case.
    - Once checked previous session exists, we don't clear out localStorage user data, and we want to recover the auth from localStorage first, and attempt a auth refresh. If successful, no further action required. By default will be redirected to home page.
    - If refresh not successful, we will degrade to case 2's 3rd point.

## Auth Persistency

```tsx

// case 3

function SpaDidMount() {
    const auth = authDeserialize(localStorage);
    if (auth) {
        
        loadAuthToRedux(auth);

        const isLoginVerified = await verifyLogin();
        if (isLoginVerified) {
            requestData("list company; list application");
        }
        else {
            // do nothing
        }
    }
    else {
        // do nothing
    }
}

// case 1

function onLoginCredentialSubmitted(res) {
    if (res.success) {
        authSerialize(res.auth);
        requestData("list company; list application");
    }
    else {

    }
}

// case 2

function triggerRequestData(manifest) {
    const isLoginVerified = await verifyLogin();
    if (isLoginVerified) {
        requestData(manifest);
    }
    else {
        alert("Your session expired. Save all changes and re-login.")
        // let user re-login themselved. They can still navigate within the SPA, just cannot send any request.
    }
}

// helper

function authSerialize(auth) {

}

function authDeserialize(localStorage) {

}

function requestData(requestManifest) {

}

function loadAuthToRedux(auth) {

}

function verifyLogin() {
    // check expired token
    const isTokenExpired = await checkTokenExpired();
    if (!isTokenExpired) {
        return true;
    }

    // try refresh token
    const isTokenRefreshed = await refreshToken();
    if (isTokenRefreshed) {
        return true;
    }

    return false;
}

function refreshToken() {

}

```