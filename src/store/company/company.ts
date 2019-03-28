import { RestApiReduxFactory } from "../rest-api-redux-factory";

export class Company {
    uuid: string = ""
    userID: string = ""
    // labels
    // name: string = ""
    hq_location: string = ""
    // home_page: string = ""
    // ratings
    // applications

    constructor(private name: string, private home_page: string) {

    }
}

const initialCompanyInstance = new Company("", "");
const CompanyRestApiRedux = RestApiReduxFactory<Company>("companies", initialCompanyInstance);
export const companyActions = CompanyRestApiRedux.actions;
export const companyReducer = CompanyRestApiRedux.storeReducer;
export const companySagas = CompanyRestApiRedux.sagas;