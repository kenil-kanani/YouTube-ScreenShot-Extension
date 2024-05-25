export default function ImageCard({ screenshot, index, deleteScreenshot }) {
    return (
        <div className="relative overflow-hidden rounded-lg p-2 pt-0">
            <div className='flex justify-between items-center'>
                <div className="z-10 px-2 py-1 text-lg rounded-md">{index}</div>
                <div className="flex items-center justify-center cursor-pointer w-4 h-4 hover:text-red-500" onClick={() => deleteScreenshot(index)}>
                    <TrashIcon />
                </div>
            </div>
            <img
                alt="Image 1"
                className="object-cover w-full aspect-auto mt-[10px]"
                src={screenshot}
            />
        </div>
    )
}

function TrashIcon(props) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M3 6h18" />
            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
        </svg>
    )
}