import './ClipboardItem.css'

import { EventsEmit } from '../../../../wailsjs/runtime/runtime'

type ClipboardItemType = {
    id: string,
    data: string
}

export default function ClipboardItem({ id, data }: ClipboardItemType) {
    function selectItem(id: string) {
        return (_event: React.MouseEvent) => {
            console.log(id);
            EventsEmit('selectItem', id);
        }
    }

    return (
        <div className='clipboard-item'>
            <pre className='clipboard-item__value'>{data}</pre>

            <button className='clipboard-item__copy-item' onClick={selectItem(id)}>Copy</button>
        </div>
    );
}


