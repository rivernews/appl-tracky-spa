import { RestApiReduxFactory } from "../rest-api-redux-factory";
import { BaseModel, IBaseModelProps } from "./base-model";

export interface IAddressProps {
    place_name?: string;
    country?: string;
    state?: string;
    city?: string;
    street?: string;
    full_address?: string;
    zipcode?: string;
}

export class Address extends BaseModel {
    place_name: string;
    country: string;
    state: string;
    city: string;
    street: string;
    full_address: string;
    zipcode: string;

    constructor({
        place_name = "",
        country = "",
        state = "",
        city = "",
        street = "",
        full_address = "",
        zipcode = "",
        ...args
    }: IAddressProps & IBaseModelProps) {
        super(args);
        this.place_name = place_name;
        this.country = country;
        this.state = state;
        this.place_name = place_name;
        this.city = city;
        this.street = street;
        this.full_address = full_address;
        this.zipcode = zipcode;
    }
}

const initialAddressInstance = new Address({});
const AddressRestApiRedux = RestApiReduxFactory<Address>(
    "addresses",
    initialAddressInstance
);
export const addressActions = AddressRestApiRedux.actions;
export const addressReducer = AddressRestApiRedux.storeReducer;
export const addressSagas = AddressRestApiRedux.sagas;
