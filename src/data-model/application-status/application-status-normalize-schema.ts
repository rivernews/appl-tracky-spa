import { schema } from "normalizr";

export const ApplicationStatusNormalizeSchema = new schema.Entity("statuses", {}, {
    idAttribute: "uuid"
})

export const ApplicationStatusListNormalizeSchema = new schema.Array(ApplicationStatusNormalizeSchema);