import './ClipboardItem.css'

import { EventsEmit, EventsOn } from '../../../../wailsjs/runtime/runtime'
import React, { useEffect, useRef, useState } from 'react';
import { Copy } from 'react-feather';

type ClipboardItemType = {
    id: string,
    data: string,
    ttl: number
}

export default function ClipboardItem({ id, data, ttl }: ClipboardItemType) {
    const [activeClass, setActiveClass] = useState('');
    const [key, setKey] = useState(0);
    const timeoudIdRef = useRef<number | null>(null);

    const activeClassName = 'clipboard-item__active';
    const msInSecond = 1000;

    useEffect(() => {
        EventsOn('selectItem', () => {
            if (timeoudIdRef.current) {
                clearTimeout(timeoudIdRef.current);
                setActiveClass('');
                timeoudIdRef.current = null;
            }
        });

        return () => {
            if (timeoudIdRef.current) clearInterval(timeoudIdRef.current);
        };
    }, []);

    const selectItem = (_event: React.MouseEvent) => {
        EventsEmit('selectItem', id);

        setActiveClass(activeClassName);
        setKey((prevKey) => prevKey + 1);

        timeoudIdRef.current = setTimeout(() => {
            setActiveClass('');
        }, ttl * msInSecond);
    };

    return (
        <div className='clipboard-item'>
            <div key={key} className={activeClass} style={{ animationDuration: `${ttl}s` }}></div>
            
            <pre className='clipboard-item__value'>{data}</pre>

            <button className='clipboard-item__copy-item icon-btn' onClick={selectItem}>
                <Copy color='white' width='100%' height='auto'></Copy>
            </button>
        </div>
    );
};

