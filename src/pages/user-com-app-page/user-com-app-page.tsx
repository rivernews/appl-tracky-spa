import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { RouteComponentProps } from "react-router";

/** Redux */
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { IRootState } from "../../store/types";
// rest api
import { CrudType, RequestStatus } from "../../utils/rest-api";
import {
    IObjectStore,
    IObjectAction
} from "../../store/rest-api-redux-factory";
import { Company } from "../../store/data-model/company";
import { Link } from "../../store/data-model/link";
import {
    Application,
    ApplicationActions
} from "../../store/data-model/application";

/** Components */
import { CompanyComponent } from "../../components/company/company-component";
// mdc react icon
import MaterialIcon from "@material/react-material-icon";
// mdc react button
import "@material/react-button/dist/button.css";
import Button from "@material/react-button";
// mdc-react input
import "@material/react-text-field/dist/text-field.css";
import TextField, { HelperText, Input } from "@material/react-text-field";
// formik
import { Formik, Form, Field, ErrorMessage } from "formik";

interface IUserComAppPageParams {
    uuid: string;
}

interface IUserComAppPageProps
    extends RouteComponentProps<IUserComAppPageParams> {
    company: IObjectStore<Company>;
    application: IObjectStore<Application>;
    createApplication: (
        applicationFormData: Application,
        callback?: Function
    ) => void;
}

interface IUserComAppPageState {
    isApplicationFormOpened: boolean;
}

class UserComAppPage extends Component<
    IUserComAppPageProps,
    IUserComAppPageState
> {
    company: Company = new Company({});

    constructor(props: IUserComAppPageProps) {
        super(props);
        this.state = {
            isApplicationFormOpened: false
        };
    }

    renderAll(companyUuid: string) {
        this.company = new Company(this.props.company.objectList[companyUuid]);
        return (
            <div className="user-com-app-page-content">
                <CompanyComponent company={this.company} />

                <hr />

                <Button
                    onClick={clickEvent => {
                        this.setState({ isApplicationFormOpened: true });
                    }}
                    unelevated
                    icon={<MaterialIcon hasRipple icon="add" />}
                >
                    Add Application
                </Button>

                {this.state.isApplicationFormOpened &&
                    this.renderApplicationForm()}
            </div>
        );
    }

    renderApplicationForm() {
        if (this.company.uuid) {
            return (
                <div className="application-form">
                    Application is associated with company {this.company.name}
                    <br />
                    <Formik
                        initialValues={{
                            position_title: "",
                            job_description_page__url: "",
                            job_source__url: ""
                        }}
                        validate={values => {
                            let errors: any = {};
                            if (!values.position_title) {
                                errors.position_title = "Required";
                            } else if (
                                values.job_description_page__url !== "" &&
                                !/^https*\:\/\/.+$/i.test(
                                    values.job_description_page__url
                                )
                            ) {
                                errors.job_description_page__url =
                                    "Please start by http:// or https://";
                            } else if (
                                values.job_source__url !== "" &&
                                !/^https*\:\/\/.+$/i.test(
                                    values.job_source__url
                                )
                            ) {
                                errors.job_source__url =
                                    "Please start by http:// or https://";
                            }
                            return errors;
                        }}
                        onSubmit={(values, { setSubmitting }) => {
                            setSubmitting(false);

                            // prep relationship object by data model
                            const job_description_page = new Link({
                                url: values.job_description_page__url
                            });
                            const job_source = new Link({
                                url: values.job_source__url
                            });
                            const user_company__id = this.company.uuid

                            // create main object
                            const application = new Application({
                                position_title: values.position_title,
                                job_description_page,
                                job_source,
                                user_company: user_company__id,
                            });

                            // dispatch
                            this.props.createApplication(application, () => {
                                if (
                                    this.props.application.lastChangedObjectID
                                ) {
                                    let newApplication = this.props.application
                                        .objectList[
                                        this.props.application
                                            .lastChangedObjectID
                                    ];
                                    console.log(
                                        "new application:",
                                        newApplication
                                    );
                                } else {
                                    console.error(
                                        "application store has no lastChangedObjectID"
                                    );
                                }
                            });
                        }}
                    >
                        {({
                            values,
                            errors,
                            touched,
                            handleChange,
                            handleBlur,
                            handleSubmit,
                            isSubmitting
                        }) => (
                            <form onSubmit={handleSubmit}>
                                {/* Position Title */}
                                <TextField
                                    label="Position Title"
                                    onTrailingIconSelect={() => {
                                        values.position_title = "";
                                        touched.position_title = false;
                                    }}
                                    trailingIcon={
                                        <MaterialIcon
                                            role="button"
                                            icon="clear"
                                        />
                                    }
                                >
                                    <Input
                                        name="position_title"
                                        inputType="input"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values.position_title}
                                    />
                                </TextField>
                                {errors.position_title &&
                                    touched.position_title &&
                                    errors.position_title}

                                <br />

                                {/* Job Description Page URL */}
                                <TextField
                                    label="Job Description Page URL"
                                    onTrailingIconSelect={() => {
                                        values.job_description_page__url = "";
                                        touched.job_description_page__url = false;
                                    }}
                                    trailingIcon={
                                        <MaterialIcon
                                            role="button"
                                            icon="clear"
                                        />
                                    }
                                >
                                    <Input
                                        name="job_description_page__url"
                                        inputType="input"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values.job_description_page__url}
                                    />
                                </TextField>
                                {errors.job_description_page__url &&
                                    touched.job_description_page__url &&
                                    errors.job_description_page__url}

                                <br />

                                {/* Job Source URL */}
                                <TextField
                                    label="Job Source URL"
                                    onTrailingIconSelect={() => {
                                        values.job_source__url = "";
                                        touched.job_source__url = false;
                                    }}
                                    trailingIcon={
                                        <MaterialIcon
                                            role="button"
                                            icon="clear"
                                        />
                                    }
                                >
                                    <Input
                                        name="job_source__url"
                                        inputType="input"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values.job_source__url}
                                    />
                                </TextField>
                                {errors.job_source__url &&
                                    touched.job_source__url &&
                                    errors.job_source__url}

                                <Button
                                    type="submit"
                                    disabled={isSubmitting}
                                    unelevated
                                    children="Create"
                                />

                                <Button
                                    onClick={clickEvent => {
                                        this.setState({
                                            isApplicationFormOpened: false
                                        });
                                    }}
                                    unelevated
                                    children="Cancel"
                                />
                            </form>
                        )}
                    </Formik>
                </div>
            );
        } else {
            return (
                <div>
                    Cannot generate application form because no company set yet!
                </div>
            );
        }
    }

    render() {
        let companyUuid = this.props.match.params.uuid;
        console.log("rendered! company uuid =", companyUuid);
        return (
            <div className="UserComAppPage">
                {companyUuid && companyUuid in this.props.company.objectList ? (
                    this.renderAll(companyUuid)
                ) : companyUuid ? (
                    <h1>No company found. Uuid={companyUuid}</h1>
                ) : (
                    <h1>Company uuid not specified</h1>
                )}
            </div>
        );
    }
}

const mapStateToProps = (store: IRootState) => ({
    // prop: store.prop
    company: store.company,
    application: store.application
});

const mapDispatchToProps = (dispatch: Dispatch<IObjectAction<Application>>) => {
    // actionName = (newState for that action & its type) => dispatch(ActionCreatorFunction(newState))
    return {
        createApplication: (
            applicationFormData: Application,
            callback?: Function
        ) =>
            dispatch(
                ApplicationActions[CrudType.CREATE][
                    RequestStatus.TRIGGERED
                ].action(applicationFormData, callback)
            )
    };
};

export const UserComAppPageContainer = withRouter(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(UserComAppPage)
);
