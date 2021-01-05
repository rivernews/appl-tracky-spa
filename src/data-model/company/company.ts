import { BaseModel, IBaseModelProps, IReference } from "../base-model";
import { Address } from "../address";
import { Link } from "../link";
import { Label, labelTypes } from "../label";
import { Application } from "../application/application";
import * as Yup from "yup";


interface ICompanyProps {
    user?: string;
    labels?: Array<Label>;
    name?: string;
    hq_location?: Address;
    home_page?: Link;
    notes?: string;
    ratings?: any;
    applications?: Array<Application> | Array<IReference>;
}

export class Company extends BaseModel {
    public user: string;
    public labels: Array<Label>;
    public name: string;
    public hq_location: Address;
    public home_page: Link;
    public notes: string;
    public ratings: any;
    public applications: Array<Application> | Array<IReference>;

    constructor({
        user = "",
        labels = [],
        name = "",
        hq_location = new Address({}),
        home_page = new Link({}),
        notes = "",
        ratings = {},
        applications = [],
        ...args
    }: ICompanyProps & IBaseModelProps) {
        super(args);
        this.user = user;
        this.labels = labels;
        this.name = name;
        this.hq_location = hq_location;
        this.home_page = home_page;
        this.notes = notes;
        this.ratings = ratings;
        this.applications = applications;
    }

    static schema(){
        return Yup.object<Company>().shape({
            name: Yup.string().required("Every company needs a name...!").max(100),
            home_page: Link.schema(),
            notes: Yup.string(),
            hq_location: Address.schema()
        });
    }

    static getLabel(companyObject: Company): labelTypes {
        // default to TARGET
        return companyObject.labels && companyObject.labels.length ? companyObject.labels[0].text : labelTypes.TARGET;
    }
}

export type companyGroupTypes = "targetCompany" | "appliedCompany" | "interviewingCompany" | "archivedCompany";

export const labelTypesMapToCompanyGroupTypes: {
    [key in labelTypes]: companyGroupTypes
} = {
    [labelTypes.TARGET]: "targetCompany",
    [labelTypes.APPLIED]: "appliedCompany",
    [labelTypes.INTERVIEWING]: "interviewingCompany",
    [labelTypes.ARCHIVED]: "archivedCompany"
};

export const companyGroups = Object.values(labelTypesMapToCompanyGroupTypes);
