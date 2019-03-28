import { RestApiReduxFactory } from "../rest-api-redux-factory";

export class Address {
    uuid: string = ""

    constructor(
        private place_name: string,
        private full_address: string
    ) {

    }
}

const initialAddressInstance = new Address("", "");
const AddressRestApiRedux = RestApiReduxFactory<Address>("addresses", initialAddressInstance);
export const addressActions = AddressRestApiRedux.actions;
export const addressReducer = AddressRestApiRedux.storeReducer;
export const addressSagas = AddressRestApiRedux.sagas;