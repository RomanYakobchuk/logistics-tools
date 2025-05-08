export default function Loading() {
    return (
        <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center -mt-16">
            <div className="flex flex-col items-center gap-4">
                <div className="relative">
                    <div className="h-24 w-24 rounded-full border-t-4 border-b-4 border-blue-500 animate-spin"></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-20 w-20 rounded-full border-t-4 border-b-4 border-blue-300 animate-spin"></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-16 w-16 rounded-full border-t-4 border-b-4 border-blue-100 animate-spin"></div>
                </div>
                <p className="text-xl text-blue-800 font-medium animate-pulse">
                    Loading...
                </p>
            </div>
        </div>
    );
}