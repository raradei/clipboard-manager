import { useNavigate } from 'react-router-dom';
import './Settings.css'

import { ArrowLeft } from "react-feather";
import { useState } from 'react';
import { EventsEmit } from '../../../wailsjs/runtime/runtime';

type settingsFormState = {
    ttl?: number;
    size?: number;
}

export default function Settings() {
    // TODO: get defaults from saved settings
    const [formState, setFormState] = useState<settingsFormState>({
        ttl: 5,
        size: 5,
    });

    const navigate = useNavigate();
    const toHome = () => navigate('/#');

    function inputChangeHandler(getStateObj: (value: number) => settingsFormState, eventName: string) {
        return ({ target: { value, min, max, maxLength } }: React.ChangeEvent<HTMLInputElement>) => {
            if (value.length > maxLength) return;

            let val = +value
            if (val < +min) val = +min;
            if (val > +max) val = +max;

            setFormState(prevState => ({ ...prevState, ...getStateObj(val) }));
            EventsEmit(eventName, val);
        }
    }

    return (
        <div id="settings-container">
            <section className='header'>
                <h1>Settings</h1>
                <button className='icon-btn' onClick={toHome}><ArrowLeft /></button>
            </section>

            <section className='form'>
                <div className='form-group'>
                    <label htmlFor='ttl'>Time to live </label>
                    <input id='ttl' className='form-input' type='number'
                        min={5} max={60} maxLength={2}
                        value={formState.ttl}
                        onChange={inputChangeHandler((val) => ({ ttl: +val }), 'updateTtl')}>
                    </input>
                </div>

                <div className='form-group'>
                    <label htmlFor='size'>History size </label>
                    <input id='size' type='number' className='form-input'
                        min={5} max={60} maxLength={2}
                        value={formState.size}
                        onChange={inputChangeHandler((val) => ({ size: +val }), 'updateSize')}>
                    </input>
                </div>

                <div className="form-group">
                    <label htmlFor="hotkey">Hotkey</label>
                    <kbd className='hotkey-container'>
                        <kbd className='key'>ctrl</kbd>+
                        <kbd className='key'>super</kbd>+
                        <kbd className='key'>v</kbd>
                    </kbd>
                </div>
            </section>
        </div>
    )
}