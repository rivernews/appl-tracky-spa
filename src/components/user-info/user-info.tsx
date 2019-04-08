import React, { Component } from "react";
import PropTypes from "prop-types";

import { IUpdateAuthState } from "../../store/auth/types";

interface UserInfoProps {
    auth: IUpdateAuthState;
}

export class UserInfo extends Component<UserInfoProps, any> {
    render() {
        return (
            <div>
                <div>
                    Logged in:{" "}
                    {(this.props.auth.isLogin &&
                        this.props.auth.isLogin.toString()) ||
                        "undefine"}
                </div>
                <div>User Name: {this.props.auth.userName || "(empty)"}</div>
                <div>
                    Token (for API): {this.props.auth.apiToken || "(empty)"}
                </div>
            </div>
        );
    }
}
