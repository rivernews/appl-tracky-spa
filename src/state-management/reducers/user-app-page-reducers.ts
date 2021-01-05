import { Reducer, Action } from "redux";
import { TabNames } from "../../data-model/label";
import { IUserAppPageState, TUserAppPageActions, UserAppPageActionNames } from "../types/user-app-page-types";

const initialUserAppPageState: IUserAppPageState = {
    activeTabIndex: TabNames.INTERVIEWING
}

export const userAppPageReducer: Reducer<IUserAppPageState> = (state = initialUserAppPageState, action: Action) => {
    const userAppPageAction = action as TUserAppPageActions;
    switch (userAppPageAction.type) {
        case UserAppPageActionNames.SET_ACTIVE_TAB:
            return {
                activeTabIndex: userAppPageAction.activeTabIndex
            };
    }

    // make sure to return the initial state in case action doesn't belong to current reducer
    return state;
}
