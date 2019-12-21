import React, { Component, FunctionComponent, useState, useEffect } from "react";
import { withRouter, RouteComponentProps } from "react-router-dom";

/** Redux */
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { IRootState } from "../../store/types";
import { Label } from "../../store/data-model/label";

/** Components */
import { ChipSet, Chip } from '@material/react-chips';
import "@material/react-chips/dist/chips.css";


export type labelTypes = "Target" | "Applied" | "Interviewing" | "Archived";

// TODO: frontend should not couple with data in database. Remove this after you create lookup logic in backend.
export const labelTable = {
    "Target": {
        uuid: "54cd1bea-9938-4801-8c81-7a1c8d8829fe",
        text: "Target"
    },
    "Applied": {
        uuid: "84536190-75d4-4466-ab75-a02e183e9124",
        text: "Applied"
    },
    "Interviewing": {
        uuid: "3814816e-7d27-4740-b341-d0257db9655a",
        text: "Interviewing"
    },
    "Archived": {
        uuid: "ca0f9f93-87a2-4f0f-bf47-ed59bacd7093",
        text: "Archived"
    },
};

// function isLabelType(label: string | labelTypes): label is labelTypes {
//     return label in labelTable;
// }


interface ILabelGroupComponentProps extends RouteComponentProps {
    selectedLabels?: Array<Label>
    onChange?: (selectedLabelText: string) => void
}


const LabelGroupComponent: FunctionComponent<ILabelGroupComponentProps> = (props) => {
    const [selectedLabels, setSelectedLabels] = useState<string[]>(
        props.selectedLabels && props.selectedLabels.length ? [props.selectedLabels[0].text] : ["Target"]
    );

    console.log('label prop is', props.selectedLabels);
    console.log('label state is', selectedLabels);

    const handleSelectionChange = (selectedLabels: Array<string>) => {
        setSelectedLabels(selectedLabels as labelTypes[]);
    }

    // signal the change to external world
    useEffect(()=> {
        props.onChange && props.onChange(selectedLabels[0]);
    }, [selectedLabels]);

    return (
        <div className="LabelGroupComponent">
            <h1>LabelGroupComponent Works!</h1>
            <ChipSet choice selectedChipIds={selectedLabels} handleSelect={handleSelectionChange}>
                {
                    Object.keys(labelTable).map((labelText, index) => {
                        return <Chip key={index} id={labelText} label={labelText} />
                    })
                }
            </ChipSet>
        </div>
    )
}

const mapStateToProps = (store: IRootState) => ({
    // prop: store.prop
});

// const mapDispatchToProps = (dispatch: Dispatch<IObjectAction<ObjectName>>) => {
//     // actionName: (newState for that action & its type) => dispatch(ActionCreatorFunction(newState))
//     return {
//         // listObjectName: (callback?: Function) =>
//         // 	dispatch(
//         // 		ObjectNameActions[CrudType.LIST][RequestStatus.TRIGGERED].action(
//         // 			new ObjectName({}),
//         // 			callback
//         // 		)
//         // 	),
//     }
// };

export const LabelGroupComponentContainer = withRouter(connect(
    mapStateToProps,
    // mapDispatchToProps
)(LabelGroupComponent));
