import './ClipboardItem.css'

import { EventsEmit, EventsOn } from '../../../../wailsjs/runtime/runtime'
import React, { useEffect, useRef, useState } from 'react';
import { Copy } from 'react-feather';

type ClipboardItemType = {
    id: string,
    data: string,
    ttl: number,
    selected: boolean
}

export default function ClipboardItem({ id, data, ttl, selected }: ClipboardItemType) {
    const activeClassName = 'active';
    const msInSecond = 1000;

    const [activeClass, setActiveClass] = useState('');
    const [key, setKey] = useState(0);

    const timeoudIdRef = useRef<number | null>(null);

    useEffect(() => {
        if (selected) activateItem();

        EventsOn('clipboardUpdate', deactivateItem)
        EventsOn('selectItem', deactivateItem);

        return () => {
            if (timeoudIdRef.current) clearInterval(timeoudIdRef.current);
        };
    }, []);

    const activateItem = () => {
        setActiveClass(activeClassName);
        timeoudIdRef.current = setTimeout(() => {
            setActiveClass('');
        }, ttl * msInSecond);
    }

    const deactivateItem = () => {
        if (timeoudIdRef.current) {
            clearTimeout(timeoudIdRef.current);
            setActiveClass('');
            timeoudIdRef.current = null;
        }
    }

    const selectItem = (_event: React.MouseEvent) => {
        EventsEmit('selectItem', id);
        setKey((prevKey) => prevKey + 1);
        activateItem()
    };

    return (
        <div className='clipboard-item'>
            <div key={key} className={activeClass} style={{ animationDuration: `${ttl}s` }}></div>

            <pre className='value'>{data}</pre>

            <button className='icon-btn' onClick={selectItem}>
                <Copy color='white' width='100%' height='auto'></Copy>
            </button>
        </div>
    );
};

