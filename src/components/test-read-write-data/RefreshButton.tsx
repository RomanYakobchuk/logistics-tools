import {RefreshCcw} from "lucide-react";
import React from "react";

type TRefreshButtonProps = {
    fetch: (() => void) | (() => Promise<void>),
    text?: string
}

const RefreshButton = ({fetch, text = 'Refresh order data'}: TRefreshButtonProps) => {
    return (
        <button
            className={'bg-white rounded-md border-[1px] border-gray-400 text-gray-950 p-2 flex items-center justify-center transition duration-300 hover:bg-gray-100 relative z-0 group'}
            onClick={(e) => {
                e?.preventDefault();
                fetch();
            }}
        >
            <RefreshCcw className={'w-5 h-5 group-hover:-rotate-180 transition duration-300'}/>
            <div
                className={'absolute z-10 opacity-0 transition duration-300 -bottom-1 translate-y-full bg-gray-900 rounded-lg text-white group-hover:opacity-100 text-[12px] w-fit text-nowrap px-2 py-1'}>
                {text}
            </div>
        </button>
    );
};
export default RefreshButton
