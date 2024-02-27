import { useNavigate } from 'react-router-dom';
import './Settings.css'

import { ArrowLeft } from "react-feather";

export default function Settings() {

    const navigate = useNavigate();
    const toHome = () => navigate('/#');

    return (
        <div id="settings">
            <div id='header'>
                <h1>Settings</h1>
                <button className='icon-btn' onClick={toHome}><ArrowLeft /></button>
            </div>

            <section>
                <h2>General</h2>

                
            </section>
        </div>
    )
}