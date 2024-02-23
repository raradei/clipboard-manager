type ClipboardItemType = {
    data: string
}

export default function ClipboardItem({ data }: ClipboardItemType) {
    return (
        <div>
            <pre>{data}</pre>
        </div>
    );
}
