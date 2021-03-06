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

export const companyReducer = (companyStore = initialCompanyState, action: TCompanyActionCreators): ICompanyState => {
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

### Challenge -2A: Approaching complex, high-level generalization: backward inference. Assume the factory generates an object containing everything. How should the factory-generated object be used? 

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
- ~~**`GET /object/:id/`**: get an object of specified.~~ Actually, we may not need this, because for redux global store, we always want to grab all the object down, then we access them in the frontend logic.
- **`POST /object/`**: create an object. (batch creation not supported)
- **`PATCH /object/:id/`**: update an object. (batch update not supported)
- **`DELETE /object/:id/`**: delete an object. (batch deletion not supported)

# Generalizing Async Actions

The key is these two types: `IApiCallInstruction` and `INewStateUpdateInstruction`. What should they be?

### Challenge -2B: Approaching complex, high-level generalization: input & output of a blackbox. Input: What data is needed for API call. Output/Outcome: How the store will be updated? 

Assume that api base url and object name are supplied automatically/somewhere and don't have to worry about them.

## Store's Shape

Before we begin - the basic store data structure:

```ts
interface IObjectSchema {
    id: string
    name: string
    ...
}

interface IObjectStore {
    objectList: {
        [id:string]: IObjectSchema
    }
}
```

This simulates a NoSQL collection structure, where an object can be quickly located by its id, instead of doing linear filtering.

## Create

- API call needs: 
    - `form data` w/ spec aligning to data model
- How to update store:

```ts
(store, newObject = resData OR form data w/ id, whichever represents the complete new object) => {
    return {
        objectList: {
            ...store.objectList,
            [newObject.id]: newObject,
        }
    }
}
```

As you can see the reducer needs the `newObject` information provided. This can be done by putting `newObject` in the success aync action's payload.

## Read (List)

- API call needs: 
    - None. (but if reading one object, we'll need the id. But - where does this id come from? We must already know the id, and the only way to get the id is to request a list of all objects at the first place. But if we have all objects in redux, why do we need to request a single object then? This makes it clear that we might not need the single-object read.)
- How to update store:

```ts
(store, newObjectList) => {
    let objectList = {};
    newObjectList.forEach((object) => {
        objectList[object.id] = object
    })
    return {
        objectList
    }
}
```

There are some assumptions here. We always use the new list as our entire object list store. So everything in previous list will be discarded. Instead, we can choose to preserve anything as many as we can, and only update the overlapping objects:

```ts
(store, newObjectList) => {
    let newObjectList = {};
    newObjectList.forEach((object) => {
        newObjectList[object.id] = object
    })
    return {
        objectList: {
            ...store.objectList,
            ...newObjectList
        }
    }
}
```

## Update

- API call needs (same as create): 
    - `form data` w/ spec aligning to data model
- How to update store (if using resData, then all same as create):

```ts
(store, newObject = resData OR form data, both will work) => {
    return objectList: {
        ...store.objectList,
        [newObject.id]: newObject,
    }
}
```

## Delete

- API call needs: 
    - At least `id`. `form data` will do the work as well, but have some overhead.
- How to update store:

```ts
import omit from "lodash/omit"; // see https://lodash.com/docs/4.17.11#omit

(store, newObject = resData OR form data w/ id, whichever represents the complete new object) => {
    return {
        objectList: omit(store.objectList, [newObject.id])
    }
}
```

## Where should these data go?

We have 1) data needed by api call 2) how to update store, where should we put them in?

Let's recall the flow...

1. [x] Class component dispatch the trigger action. **API call data should be passed in from here.**
    - How about we create an class instance for say, `Company`, then pass in that instance. That will give a good spec convention, and supply the necessary data at the same time.
1. [x] Saga intecepts it (trigger action). *The api call data should be in the action payload*, so saga can access it.
1. [x] Saga makes api call using the data.
1. [x] Saga dispatch success action. ~~**This is where the args of the update store function above should be supplied**.~~ The way to update store is fixed across different objects. A quick recap of the args needed for store update is given below. *These should be obtained from api response, and passed into success action creator*:
    - create: `form data`.
    - read: n/a.
    - udpate: `form data`.
    - delete: `id`.
1. [ ] Reducer updates store based on the action object. ~~**We need an "example object" for initial state**, hopefully this will provide schema to the factory function as well.~~ That is the store.
    - The way to update store depends on what CRUD action it is, so we'll use if-else block to process them.
    - Args to update store should be obtained from success action payload.
    - [ ] The if-else will have to cover other kinds of async action, such as requested/error
    - Eventually we will have *only one reducer for the object, with if-else blocks handling all async & crud actions*.

Actually, the above format holds true for other object type as well, because this is the RESTful / CRUD pattern. The only exception is when handling foreign key, but our REST API can also help us handle this as well, by doing a depth filling.

~~So, from start to end, an object only needs a `objectName`, then we can generate all the actions, reducers and sagas at once!~~

### Challenge -2C: How can we achieve dynamic typing, so that our factory can accept typing of a data model, and use that to create all redux resources?

Some takeaways during implementation:

- What data is passed in - is not cared by the factory. The data to be passed in is decided by the caller. The factory function generates saga that passes whatever the caller gives to the api functions.

## Factory Complete!

- [ ] Next: clean up code

### Challenge -2D: Navigation side effect after form submit. Since we cannot know current request progress via `fetch()` promise anymore, how can we use redux store to navigate upon form submit && request succeeded?

- [x] Next: creating company/address: so how do we navigate after submit form?

### Challenge -2E: How can we write to database's relational fields, such as one-to-one, Many-to-one or Many-to-Many, via RESTful API?

- Next: how to get foreign key / one-to-one entries?
    - [x] React: prepare the data! Get ready to send them by one click - start from Company
        - [x] We need all one to one field supplied.
    - Backend: Django test if that method works: did it successfully create all fields all entries?
        - [ ] 🔥Test one-to-one field - can we assign it in serializer level? - start from Company
        - [ ] 🔥Test user field - assign it in view.
        - [ ] Test foreign key
        - [ ] Test many to many

Things are getting crazy. Serializer has some issue consuming front end data:

```python
ipdb> serializer.errors
{'user': [ErrorDetail(string='This field is required.', code='required')], 'home_page': {'url': [ErrorDetail(string='Ente
r a valid URL.', code='invalid')], 'text': [ErrorDetail(string='This field may not be blank.', code='blank')], 'user': [E
rrorDetail(string='Incorrect type. Expected URL string, received dict.', code='incorrect_type')]}}

ipdb> request.data
{'uuid': '', 'created_at': '', 'modified_at': '', 'userID': '', 'labels': [], 'name': 'Facebook', 'hq_location': {'uuid':
 '', 'created_at': '', 'modified_at': '', 'place_name': '', 'country': '', 'state': '', 'city': '', 'street': '', 'full_a
ddress': 'CA', 'zipcode': ''}, 'home_page': {'uuid': '', 'created_at': '', 'modified_at': '', 'text': '', 'user': {}, 'url': 'facebook.com', 'order': 0}, 'ratings': {}, 'applications': {}}
```

Takeaways:

- [x] TODO - set company's user in request
    - This is done in Django REST framework. Bascially you will: 
    1. Add a `user=PrimaryRelatedField(read_only=True)` in serializer, so the serializer won't try to set/validate `user` by using frontend's POST data.
    1. Add a `perform_create()` in viewset and supply `self.request.user` to serializer.
    1. Add a `cerate(self, validated_data)` in serializer. The `self.request.user` passed in previous step will now be available in `validated_data`. Use `validated_data.pop(...)` to get the user data.
    1. Create the model object in serializer's `create()`.
- [x] TODO - you'll then have to set user on all related fields as well, i.e. `home_page`. Consider removing Link's `user` field, but indeed, filter user on Link can get bit more hard. RESULT: we will leave the user field. We are able to set that upon company creation so.
- [x] TODO - Link is complaining `facebook.com` is not valid URL. Consider use `https://...` instead.
    - [x] Perhaps check this in frontend as well.
- [x] TODO - Link's `text` field - consider make it `blank=True`

OK! Let's try rendering the results - object list in frontend!
- [x] Create a component for rendering a company, say `company-component`.
- [x] Render company in `user-com-app-page`.
- [x] Render company list in `user-app-page`.