
export default function Loading() {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center py-30">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading ...</p>
            </div>
        </div>
    );
}
