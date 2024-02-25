import './ClipboardItem.css'

import { EventsEmit, EventsOn } from '../../../../wailsjs/runtime/runtime'
import React from 'react';

type ClipboardItemState = {
    activeClass: string,
    key: number
}

type ClipboardItemType = {
    id: string,
    data: string,
    ttl: number
}

export default class ClipboardItem extends React.Component<ClipboardItemType, ClipboardItemState> {
    private timeoutId: number | null = null;
    private readonly activeClassName = 'clipboard-item__active';

    constructor(props: ClipboardItemType) {
        super(props);
        this.state = { activeClass: '', key: 0 };
    }

    componentDidMount(): void {
        EventsOn('selectItem', () => {
            if (this.timeoutId) {
                clearTimeout(this.timeoutId);
                this.setState({ activeClass: '' });
                this.timeoutId = null;
            }
        })
    }

    componentWillUnmount(): void {
        if (this.timeoutId) clearInterval(this.timeoutId);
    }

    selectItem = (_event: React.MouseEvent) => {
        EventsEmit('selectItem', this.props.id);

        this.setState(state => ({
            ...state,
            activeClass: this.activeClassName,
            key: state.key + 1
        }))

        this.timeoutId = setTimeout(() => {
            this.setState({ activeClass: '' });
        }, this.props.ttl * 1000)
    }

    render(): React.ReactNode {
        return (
            <div className='clipboard-item'>
                <div key={this.state.key} className={this.state.activeClass} style={{ animationDuration: `${this.props.ttl}s` }}></div>
                <pre className='clipboard-item__value'>{this.props.data}</pre>

                <button className='clipboard-item__copy-item' onClick={this.selectItem}>Copy</button>
            </div>
        );
    }
}


