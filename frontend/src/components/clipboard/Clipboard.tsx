import './Clipboard.css'

import { useEffect, useState } from "react";
import ClipboardItem from "./clipboard-item/ClipboardItem";

import { clipboard } from "../../../wailsjs/go/models";
import { GetClipboardHistory } from '../../../wailsjs/go/main/App';
import { EventsOn } from "../../../wailsjs/runtime/runtime";
import { Filter, Settings } from 'react-feather';
import { useNavigate } from 'react-router-dom';

export default function Clipboard() {
    const [data, setData] = useState<clipboard.StringData[]>([]);
    const [ttl, setTTL] = useState(5);

    const navigate = useNavigate();

    useEffect(() => {
        GetClipboardHistory().then((data) => setData(data));
        EventsOn('clipboardUpdate', (data) => setData(data));
    }, []);


    const toSettings = () => navigate('settings');

    return (
        <>
            <div id='header'>
                <button className='icon-btn' onClick={console.log}><Filter /></button>
                <button className='icon-btn' onClick={toSettings}><Settings /></button>
            </div>

            <div id="clipboard-container">
                {data.map(({ id, value }) => (
                    <ClipboardItem key={id} id={id} data={value} ttl={ttl} />
                ))}
            </div>
        </>
    );
};