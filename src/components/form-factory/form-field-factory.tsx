import React, { Component } from "react";
import { withRouter, RouteComponentProps } from "react-router-dom";

/** Redux */
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { IRootState } from "../../store/types";

/** Components */
// mdc react icon
import MaterialIcon from "@material/react-material-icon";
// mdc react button
import "@material/react-button/dist/button.css";
import Button from "@material/react-button";
// mdc-react input
import "@material/react-text-field/dist/text-field.css";
import TextField, { HelperText, Input } from "@material/react-text-field";

interface IFormFieldFactoryProps extends RouteComponentProps {}

class FormFieldFactory extends Component<IFormFieldFactoryProps> {
    render() {
        return (
            <div className="FormFieldFactory">
                <h1>FormFieldFactory Works!</h1>
                <TextField
                    label="Position Title"
                    onTrailingIconSelect={() => {
                        values.position_title = "";
                        touched.position_title = false;
                    }}
                    trailingIcon={<MaterialIcon role="button" icon="clear" />}
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
            </div>
        );
    }
}

const mapStateToProps = (store: IRootState) => ({
    // prop: store.prop
});

const mapDispatchToProps = (dispatch: Dispatch<any>) => {
    // actionName: (newState for that action & its type) => dispatch(ActionCreatorFunction(newState))
    return {};
};

export const FormFieldFactoryContainer = withRouter(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(FormFieldFactory)
);
