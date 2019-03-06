# Roadmap

- 🔥 🔥 🔥Testing w/ backend API permission
    - read objects
    - user auth setup - basic login/logout/username UI
    - create an object (by POST) w/ login status
    - update/delete an object
- [ ] Material UI: which library to use? Or build our own, or both? How about google's native mdc components?
- [ ] Consider using Redux.

## Initial UI Design Mockups

Home page outlining all applications.

![Application List](docs/img/frontend/ApplicationList.png)

Add a company to start registering applications for a company.

![Application](docs/img/frontend/Application.png)

Add updates to applications.

![Company Application](docs/img/frontend/CompanyApplication.png)

## Reflection for Frontend UI: 

Is this easier to use than spreadsheet? The UI should make the registering process as quick as possible. If we split into too many steps and pages, it'll dramatically slow down the process.
But sure, we're still not sure what is the best and what are the needs. We can always iterate the layout or process at a later point.

# Reference

Repos
- [This repo](https://github.com/rivernews/appl-tracky-spa)
- [The backend api repo](https://github.com/rivernews/appl-tracky-spa)

Production sites
- [Live production website](https://rivernews.github.io/appl-tracky-spa/)
- [Live backend endpoint](https://appl-tracky-api-https.shaungc.com/)

Technologies

- [How to use create-react-app](https://github.com/facebook/create-react-app)
- [**Use typescript with React**](https://alligator.io/react/typescript-with-react/#create-react-app-and-typescript) while using `create-react-app` to scaffold the project.
- [Deploy repo to github as a live website using gh-pages](https://github.com/gitname/react-gh-pages)
    - If you got a 404 page, and you made sure your homepage url is correct in `package.json`, chances are the page is updating so may need some time reflecting the new deployment. In short: be faithful & patient!