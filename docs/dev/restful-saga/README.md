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
