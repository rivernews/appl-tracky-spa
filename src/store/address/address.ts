import { RestApiReduxFactory } from "../rest-api-redux-factory";

export class Address {
    uuid: string = ""
    place_name: string = "";
    full_address: string = "";

    constructor(
        place_name: string,
        full_address: string
    ) {
        this.place_name = place_name;
        this.full_address = full_address;
    }
}

const initialAddressInstance = new Address("", "");
const AddressRestApiRedux = RestApiReduxFactory<Address>("addresses", initialAddressInstance);
export const addressActions = AddressRestApiRedux.actions;
export const addressReducer = AddressRestApiRedux.storeReducer;
export const addressSagas = AddressRestApiRedux.sagas;