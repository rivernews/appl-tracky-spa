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

            // LIST
            else if (objectAction.crudType === CrudType.LIST) {
                const resObjectList = <Array<TObject<ObjectRestApiSchema>>>(
                    objectAction.payload.formData
                );
                let newObjects: IObjectList<ObjectRestApiSchema> = {};
                for (let object of resObjectList) {
                    newObjects[object.uuid] = object;
                }
                process.env.NODE_ENV === 'development' && console.log("Reducer: crud=list, action=", objectAction)
                process.env.NODE_ENV === 'development' && console.log("initialState=", initialState)
                process.env.NODE_ENV === 'development' && console.log("beforestore=", objectStore)
                process.env.NODE_ENV === 'development' && console.log("newlistobjects=", newObjects)

                const afterStore: IObjectStore<ObjectRestApiSchema> = {
                    collection: {
                        ...objectStore.collection,
                        ...newObjects
                    },
                    requestStatus: objectAction.payload.requestStatus
                };
                process.env.NODE_ENV === 'development' && console.log("afterstore=", afterStore)

                return afterStore;
            }

            // UPDATE
            else if (objectAction.crudType === CrudType.UPDATE) {
                let newObject = <TObject<ObjectRestApiSchema>>objectAction.payload.formData;
                return {
                    collection: {
                        ...objectStore.collection,
                        [newObject.uuid]: newObject
                    },
                    requestStatus: objectAction.payload.requestStatus
                };
            }

            // DELETE
            else if (objectAction.crudType === CrudType.DELETE) {
                let targetDeleteUuids: Array<string> = [];
                if (!Array.isArray(objectAction.triggerFormData)) {
                    const targetDeleteObject = <TObject<ObjectRestApiSchema>>objectAction.triggerFormData;
                    process.env.NODE_ENV === 'development' && console.log("Reducer: delete, targetobj=", targetDeleteObject)
                    targetDeleteUuids.push(targetDeleteObject.uuid);
                }
                else if (objectAction.triggerFormData.length) {
                    if (typeof (objectAction.triggerFormData[0]) === "string" || objectAction.triggerFormData instanceof String) {
                        targetDeleteUuids = objectAction.triggerFormData as Array<string>;
                    }
                    else {
                        const targetDeleteObjectList = <Array<TObject<ObjectRestApiSchema>>>objectAction.triggerFormData;

                        process.env.NODE_ENV === 'development' && console.log("Reducer: delete, targetobjList=", targetDeleteObjectList);

                        targetDeleteUuids = targetDeleteObjectList.map(targetDeleteObject => targetDeleteObject.uuid);
                    }
                }

                process.env.NODE_ENV === 'development' && console.log("Reducer: delete, beforestore=", objectStore)
                const afterStore = {
                    collection: omit(objectStore.collection, targetDeleteUuids),
                    requestStatus: objectAction.payload.requestStatus
                }
                process.env.NODE_ENV === 'development' && console.log("Reducer: delete, afterstore", afterStore)

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