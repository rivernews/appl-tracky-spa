import { IObjectStore, IObjectAction, TObject, IObjectList, IObjectBase } from "../types/factory-types";

import { RequestStatus, CrudType } from "../../utils/rest-api";

import { Action, Reducer } from "redux";

import { omit } from "lodash";


export const RestApiReducerFactory = <ObjectRestApiSchema extends IObjectBase>(
    objectName: string,
): Reducer<IObjectStore<ObjectRestApiSchema>> => {
    const initialState: IObjectStore<ObjectRestApiSchema> = {
        collection: {},
        requestStatus: RequestStatus.SUCCESS
    };

    const storeReducer: Reducer<IObjectStore<ObjectRestApiSchema>> = (
        objectStore: IObjectStore<ObjectRestApiSchema> = initialState,
        action: Action
    ): IObjectStore<ObjectRestApiSchema> => {

        const objectAction = action as IObjectAction<ObjectRestApiSchema>;

        if (
            !(objectAction && objectAction.payload && objectAction.payload.requestStatus) ||
            !(action.type.split("_")[2] === objectName.toUpperCase())
        ) {
            return {
                ...objectStore
            };
        }

        // async success
        if (objectAction.payload.requestStatus === RequestStatus.SUCCESS) {
            // CREATE
            if (objectAction.crudType === CrudType.CREATE) {
                let newObject = <TObject<ObjectRestApiSchema>>objectAction.payload.formData;

                return {
                    collection: {
                        ...objectStore.collection,
                        [newObject.uuid]: newObject
                    },
                    requestStatus: objectAction.payload.requestStatus
                };
            }
            // BATCH CREATE
            else if (objectAction.crudType === CrudType.BATCHCREATE) {
                const newObjects = <Array<TObject<ObjectRestApiSchema>>>objectAction.payload.formData;
                // turn into a collection so we can spread
                const newObjectsCollection = newObjects.reduce((collection, object) => {
                    collection[object.uuid] = object;
                    return collection;
                }, <IObjectList<ObjectRestApiSchema>>{});

                return {
                    collection: {
                        ...objectStore.collection,
                        ...newObjectsCollection
                    },
                    requestStatus: objectAction.payload.requestStatus
                };
            }

            // LIST
            else if (objectAction.crudType === CrudType.LIST) {
                const resObjects = <Array<TObject<ObjectRestApiSchema>>>objectAction.payload.formData;
                // turn into a collection so we can spread
                const newObjectsCollection: IObjectList<ObjectRestApiSchema> = {};
                for (let object of resObjects) {
                    newObjectsCollection[object.uuid] = object;
                }

                const afterStore: IObjectStore<ObjectRestApiSchema> = {
                    collection: {
                        ...objectStore.collection,
                        ...newObjectsCollection
                    },
                    requestStatus: objectAction.payload.requestStatus
                };

                return afterStore;
            }

            // UPDATE
            else if (objectAction.crudType === CrudType.UPDATE) {
                let updatedObject = <TObject<ObjectRestApiSchema>>objectAction.payload.formData;

                return {
                    collection: {
                        ...objectStore.collection,
                        // support partial update - only update attributes included by updatedObject
                        [updatedObject.uuid]: {
                            ...objectStore.collection[updatedObject.uuid],
                            ...updatedObject
                        }
                    },
                    requestStatus: objectAction.payload.requestStatus
                };
            }
            // BATCH UPDATE
            else if (objectAction.crudType === CrudType.BATCHUPDATE) {
                let updatedObjects = <Array<TObject<ObjectRestApiSchema>>>objectAction.payload.formData;
                // turn into a collection so we can spread
                const updatedObjectsCollection = updatedObjects.reduce((collection, updatedObject) => {
                    // support partial update - only update attributes included by updatedObject
                    collection[updatedObject.uuid] = {
                        ...objectStore.collection[updatedObject.uuid],
                        ...updatedObject
                    };
                    return collection;
                }, <IObjectList<ObjectRestApiSchema>>{});

                return {
                    collection: {
                        ...objectStore.collection,
                        ...updatedObjectsCollection
                    },
                    requestStatus: objectAction.payload.requestStatus
                };
            }

            // DELETE & BATCH DELETE
            else if (objectAction.crudType === CrudType.DELETE) {
                let targetDeleteUuids: Array<string> = [];
                if (objectAction.triggerFormData) {
                    if (!Array.isArray(objectAction.triggerFormData) && typeof objectAction.triggerFormData === 'object') {
                        const targetDeleteObject = <TObject<ObjectRestApiSchema>>objectAction.triggerFormData;
                        targetDeleteUuids.push(targetDeleteObject.uuid);
                    }
                    else if (objectAction.triggerFormData.length) {
                        if (typeof (objectAction.triggerFormData[0]) === "string") {
                            targetDeleteUuids = objectAction.triggerFormData as Array<string>;
                        }
                        else {
                            const targetDeleteObjectList = <Array<TObject<ObjectRestApiSchema>>>objectAction.triggerFormData;
    
                            targetDeleteUuids = targetDeleteObjectList.map(targetDeleteObject => targetDeleteObject.uuid);
                        }
                    }
                }

                const afterStore = {
                    collection: omit(objectStore.collection, targetDeleteUuids),
                    requestStatus: objectAction.payload.requestStatus
                }

                return afterStore;
            }
        }

        // async trigger
        else if (objectAction.payload.requestStatus === RequestStatus.TRIGGERED) {
            return {
                ...objectStore,
                requestStatus: objectAction.payload.requestStatus
            };
        }

        // async requesting & failure
        else {
            return {
                ...objectStore,
                ...objectAction.payload
            };
        }

        // no effect
        return {
            ...objectStore
        };
    };

    return storeReducer;
}