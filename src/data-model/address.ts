import { BaseModel, IBaseModelProps } from "./base-model";
import * as Yup from "yup";

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

    static schema(){
        return Yup.object<Address>().shape({
            full_address: Yup.string().max(200),
            street: Yup.string().max(150),
            city: Yup.string().max(50),
            state: Yup.string().max(50),
            country: Yup.string().max(50),
            place_name: Yup.string().max(50),
            zipcode: Yup.string().max(20),
        });
    }

}
