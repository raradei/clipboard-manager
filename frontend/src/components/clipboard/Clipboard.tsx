import './Clipboard.css'

import React from "react";
import ClipboardItem from "./clipboard-item/ClipboardItem";

import { clipboard } from "../../../wailsjs/go/models";
import { GetClipboardHistory } from '../../../wailsjs/go/main/App';
import { EventsOn } from "../../../wailsjs/runtime/runtime";


type ClipboardState = {
    data: clipboard.StringData[]
};

export default class Clipboard extends React.Component<{}, ClipboardState> {
    constructor(props: {}) {
        super(props);
    }

    componentWillMount(): void {
        this.setState({ data: [] });
    }

    componentDidMount(): void {
        GetClipboardHistory().then(data =>  this.setState({ data }));
        EventsOn('clipboardUpdate', (data) => this.setState({ data }));
    }

    render(): React.ReactNode {
        return (
            <div id="clipboard-container">
                {this.state.data.map(({ id, value }) => <ClipboardItem key={id} id={id} data={value}></ClipboardItem>)}
            </div>
        )
    }
}