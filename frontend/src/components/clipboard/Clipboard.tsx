import './Clipboard.css'

import { useEffect, useRef, useState } from "react";
import ClipboardItem from "./clipboard-item/ClipboardItem";

import { clipboard } from "../../../wailsjs/go/models";
import { GetClipboardHistory } from '../../../wailsjs/go/main/App';
import { EventsOn } from "../../../wailsjs/runtime/runtime";
import { Filter, Settings, X } from 'react-feather';
import { useNavigate } from 'react-router-dom';

export default function Clipboard() {
    const [data, setData] = useState<clipboard.HistoryItem[]>([]);
    const [ttl, setTTL] = useState(5);
    const [searchValue, setSearchValue] = useState('');

    const navigate = useNavigate();
    const lastEntryRef = useRef('');
    const hiddenClassRef = useRef('hidden');

    useEffect(() => {
        GetClipboardHistory().then((data) => setData(data));
        EventsOn('clipboardUpdate', (data) => {
            setData(data);
            lastEntryRef.current = data[0].id;
        });
    }, []);

    const toSettings = () => navigate('settings');

    function inputChangeHandler({ target: { value } }: React.ChangeEvent<HTMLInputElement>) {
        setSearchValue(value);
    }

    function resetSearch() {
        setSearchValue('');
    }

    return (
        <div id='clipboard-container'>
            <section className='header'>
                <div className='search-container'>
                    <Filter />
                    <input className='search-input' type='text' value={searchValue} onChange={inputChangeHandler}></input>
                    <button className={`icon-btn ${hiddenClassRef.current}`} onClick={resetSearch}><X /></button>
                </div>

                <button className='icon-btn' onClick={toSettings}><Settings /></button>
            </section>

            <section className="items-container">
                {data.map(({ id, value }) => {
                    return (
                        <ClipboardItem key={id} id={id} data={value} ttl={ttl} selected={id == lastEntryRef.current} />
                    )
                })}
            </section>
        </div>
    );
};