import { TabNames } from "../../data-model/label"
import { IUserAppPageSetActiveTabAction, IUserAppPageSetLastSearchTextAction, UserAppPageActionNames } from "../types/user-app-page-types"

export const SetActiveTabOfUserAppPage = (activeTabIndex: TabNames): IUserAppPageSetActiveTabAction => {
    return {
        type: UserAppPageActionNames.SET_ACTIVE_TAB,
        activeTabIndex
    }
}

export const SetLastSearchTextOfUserAppPage = (lastSearchText: string): IUserAppPageSetLastSearchTextAction => {
    return {
        type: UserAppPageActionNames.SET_LAST_SEARCH_TEXT,
        lastSearchText
    }
}