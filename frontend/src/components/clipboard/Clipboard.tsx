import './Clipboard.css'

import React from "react";
import ClipboardItem from "./clipboard-item/ClipboardItem";

import { clipboard } from "../../../wailsjs/go/models";
import { GetClipboardHistory } from '../../../wailsjs/go/main/App';
import { EventsOn } from "../../../wailsjs/runtime/runtime";


type ClipboardState = {
    data: clipboard.StringData[],
    ttl: number
};

export default class Clipboard extends React.Component<{}, ClipboardState> {
    constructor(props: {}) {
        super(props);
        this.state = { data: [], ttl: 5 };
    }

    componentDidMount(): void {
        GetClipboardHistory().then(data => this.setState({ data }));
        EventsOn('clipboardUpdate', (data) => this.setState({ data }));
    }

    render(): React.ReactNode {
        return (
            <div id="clipboard-container">
                {this.state.data.map(({ id, value }) => {
                    return <ClipboardItem key={id} id={id} data={value} ttl={this.state.ttl}></ClipboardItem>;
                })}
            </div>
        )
    }
}