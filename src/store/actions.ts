export enum RootActionNames {
    ResetAllStore = "RESET_ALL_STORE"
}

export const resetAllStoreAction = () => {
    return {
        type: RootActionNames.ResetAllStore,
    }
}