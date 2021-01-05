import { TabNames } from "../../data-model/label"
import { IUserAppPageSetActiveTabAction, UserAppPageActionNames } from "../types/user-app-page-types"

export const SetActiveTabOfUserAppPage = (activeTabIndex: TabNames): IUserAppPageSetActiveTabAction => {
    return {
        type: UserAppPageActionNames.SET_ACTIVE_TAB,
        activeTabIndex
    }
}
