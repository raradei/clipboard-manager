import { HashRouter, Route, Routes } from 'react-router-dom';
import './App.css';

import Clipboard from './components/clipboard/Clipboard';
import Settings from './components/settings/Settings';

function App() {
    return (
        <div id="App">
            <HashRouter basename={"/"}>
                <Routes>
                    <Route path="/" element={<Clipboard />} />
                    <Route path="/settings" element={<Settings />} />
                </Routes>
            </HashRouter>
        </div>
    );
}

export default App
