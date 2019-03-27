# Design State / Action Creator for RESTful API

For example, we want to call/dispatch these four helper functions in our react component:
- `createCompany()`: 1) accepts company data 2) make a POST request to create it in backend 3) wait till res success, and add a company to redux store's company list
- `readCompany()`: 1) accepts company id 2) make a GET request 3) add or update redux store's company list.
- `listCompany()`: 2) make a GET request 3) add or update redux store's company list.
- `deleteCompany()`: 1) accept company id 2) make a DELETE request 3) wait till res success, then remove company from redux list.

And we want to be able to setup these dispatch helper functions for other objects, like `application`, `labels`, ....

`company | restapi/states.ts`
```ts

interface ICompanyState {
    requestStatus: APIRequestStatuses
    name: string
    ...
}

interface ICompanyListState {
    companies: { [id: string]: ICompanyState }
    requestStatus: APIRequestStatuses
}

```

`company | restapi/actions.ts`
```ts

const enum ActionTypeNames {
    CREATE_COMPANY_REQUESTED = "create company requested"
    CREATE_COMPANY_SUCCESS = "create company success"
    CREATE_COMPANY_FAILURE = "create company failure"
}

```

`company | restapi/reducers.ts`
```ts

const initialCompanyState: ICompanyState = {
    ...
}

export const companyReducer = (companyStore = initialCompanyState, action: TCompanyActions): ICompanyState => {
    return {
        ...companyStore,
        ...action.payload
    }
}

```

`company | restapi/sagas.ts`
```ts

function* createCompanySagaHandler(
    createCompanyAction: ICreateCompanyAction
) {
    const { payload } = createCompanyAction;
    // requested
    yield put(RequestedCreateCompanyAction(payload))
    try {
        // api call
        const jsonResponse = yield call(restapi.post, "args needed to request api:", payload.endpoint, payload.data);
        // success
        yield put(SuccessCreateCompany("what store needs to update:", jsonResponse));
    } catch (error) {
        // failure
        yield put(FailureCreateCompany(error));
        return;
    }
}

```

# The key is reduce boilerplate, not reinventing the wheel

Inspired by [this post](https://notes.devlabs.bg/long-term-react-redux-spa-lessons-learned-14daca3a26ba), we can actually have these utilities to generate actions and reducers. We can start from the high-level.

The operation flow:

1. `this.props.createCompany()` @ React component
1. Intercept by saga: `createCompanySaga`
    1. Handles & dispatches `request|success|failure` actions, aka "restful actions", for company.
    1. Make API calls `restapi.post(...)|get(...)|patch(...)|delete(...)` where `args=(endpoint, data)`.

Takeaways:
- How many actions do we need? `<request|success|failure><C|R|U|D><Company|Application|OtherObject|...>`, so, for company object, we need att least 3*4=12 actions
- From end to end (react component all the way to redux store):
    1. objectRestApiActionHelper(apiCallInstruction, apiCallData) => 
    1. call starter actions & args=(newStateUpdateInstruction) => 
    1. intercepted by saga => 
    1. [call requested/success/failure actions & args=(newStateUpdateInstruction), call api & args=(apiCallInstruction, apiCallData)]
        1. requested/success/failure actions => reducer: how store is updated
- Ideally, (our goal) we can make a factory utility that creates all actions, reducers, types(state shapes) and sagas for us, given an object, and related information:

```ts
const apiCallInstruction = {
    apiBaseUrl: `http://localhost:8000/`,
    apiInfo: {
        create: { // implicitly use POST
            endpoint: `company/`,
            data // form data containing company creation info, can refer to backend Django's `models.py`
        },
        read: { // implicitly use GET
            endpoint: `company/`,
            data: id
        },
        list: { // implicitly use GET
            endpoint: `company/`,
            data: null
        },
        update: { // implicitly use PATCH
            endpoint: `company/`,
            data: id
        },
        delete: { // implicitly use DELETE
            endpoint: `company/`,
            data: null
        }
    }
}
```

- So, we will have this api instruction for company (or other type of api object) `apiCallInstruction`.
    - Imagine we define a collection of all related actions (CRUD+Async states), reducers, shapes & sagas for company: `companyRestRedux = RESTAPIReduxFactory(apiCallInstruction)`
    - We can access resources like
        - Actions that are dispatchable: `companyRestRedux.actions.create|read|list|update|delete(...)`
        - Shapes of the actions: `companyRestRedux.types.actions.create|read|list|update|delete`
        - Reducer: `companyRestRedux.reducer`
        - Sagas: `companyRestRedux.sagas.create|read|list|update|delete(...)`
- In theory, we still need `newStateUpdateInstruction` in order to make reducer work properly for each rest actions. So, to wrap up: `const RESTAPIReduxFactory = (apiCallInstruction, newStateUpdateInstruction) => an object that contains actions, reducers, types and sagas, including all async states & CRUD operations`. How do we do that? Well, we already have our spec, so let's try to build one for `company`!

See the file `stoer/rest-api-redux-factory.ts`.

# Designing Endpoints

Always use singular form of object name. No plural.

- **`GET /object/`**: get a list of object. (filter can also be implemented, query in GET params, customize on server view controller)
- **`GET /object/:id/`**: get an object of specified.
- **`POST /object/`**: create an object. (batch creation not supported)
- **`PATCH /object/:id/`**: update an object. (batch update not supported)
- **`DELETE /object/:id/`**: delete an object. (batch deletion not supported)

# Generalizing Async Actions

The key is these two types: `IApiCallInstruction` and `INewStateUpdateInstruction`. What should they be?