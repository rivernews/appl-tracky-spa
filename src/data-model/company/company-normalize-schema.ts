import { schema } from 'normalizr';
import { ApplicationListNormalizeSchema } from "../application/application-normalize-schema";
import { ApplicationActionCreators, ApplicationStatusActionCreators } from '../../state-management/action-creators/root-actions';


const CompanyNormalizeDefinition = {
    applications: ApplicationListNormalizeSchema
};

export const CompanyNormalizeSchema = new schema.Entity("companies", CompanyNormalizeDefinition, {
    idAttribute: "uuid"
});

export const CompanyListNormalizeSchema = new schema.Array(CompanyNormalizeSchema);
export const CompanyNormalizeManifest = {
    schema: CompanyNormalizeSchema,
    listSchema: CompanyListNormalizeSchema,
    objectEntityKey: "companies",
    relationalEntityReduxActionsMap: {
        "applications": ApplicationActionCreators,
        "statuses": ApplicationStatusActionCreators
    }
}