import { schema } from "normalizr";
import { ApplicationStatusListNormalizeSchema } from "../application-status/application-status-normalize-schema";
import { ApplicationStatusActionCreators } from "../../state-management/action-creators/root-actions";


const ApplicationNormalizeDefinition = {
    "statuses": ApplicationStatusListNormalizeSchema
};

export const ApplicationNormalizeSchema = new schema.Entity("applications", ApplicationNormalizeDefinition, {
    idAttribute: "uuid"
});

export const ApplicationListNormalizeSchema = new schema.Array(ApplicationNormalizeSchema);

export const ApplicationNormalizeManifest = {
    schema: ApplicationNormalizeSchema,
    listSchema: ApplicationListNormalizeSchema,
    objectEntityKey: "applications",
    relationalEntityReduxActionsMap: {
        "statuses": ApplicationStatusActionCreators
    }
}
