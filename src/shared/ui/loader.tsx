export const Loader = () => {
    return (
        <div className="relative z-10 flex grow items-center justify-center">
            <div className="text-center">
                <div className="border-primary mx-auto my-4 h-32 w-32 animate-spin rounded-full border-b-2"></div>
                <p className="text-primary mt-4">Загрузка...</p>
            </div>
        </div>
    )
}
