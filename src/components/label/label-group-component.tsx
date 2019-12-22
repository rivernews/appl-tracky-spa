import React, { Component, FunctionComponent, useState, useEffect } from "react";
import { withRouter, RouteComponentProps } from "react-router-dom";

/** Redux */
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { IRootState } from "../../store/types";
import { Label, labelTypes } from "../../store/data-model/label";

/** Components */
import { ChipSet, Chip } from '@material/react-chips';
import "@material/react-chips/dist/chips.css";


interface ILabelGroupComponentProps extends RouteComponentProps {
    selectedLabels?: Label[]
    onChange?: (selectedLabelText: labelTypes) => void
}


const LabelGroupComponent: FunctionComponent<ILabelGroupComponentProps> = (props) => {
    const [selectedLabels, setSelectedLabels] = useState<labelTypes[]>(
        props.selectedLabels && props.selectedLabels.length ? [props.selectedLabels[0].text] : [labelTypes.TARGET]
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
                    Object.values(labelTypes).map((labelText, index) => {
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

export const LabelGroupComponentContainer = withRouter(connect(
    mapStateToProps,
    // mapDispatchToProps
)(LabelGroupComponent));
