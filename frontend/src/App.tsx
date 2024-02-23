import { useEffect, useState } from 'react';
import './App.css';
import { EventsOn } from "../wailsjs/runtime/runtime";
import ClipboardItem from './components/clipboard-item/ClipboardItem';

function App() {
    const [data, setData] = useState([] as { id: string, value: string }[]);

    useEffect(() => {
        EventsOn('clipboardUpdate', (value) => {

            setData([
                ...data,
                { id: crypto.randomUUID(), value }
            ]);
            console.log(data);
        })

    })

    return (
        <div id="App">
            {data.map(({ id, value }) => <ClipboardItem key={id} data={value} />)}
        </div>
    )
}

export default App
