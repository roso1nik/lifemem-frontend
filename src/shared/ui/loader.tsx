export const Loader = () => {
    return (
        <div className="relative z-10 flex grow items-center justify-center">
            <div className="text-center">
                <div className="mx-auto my-4 h-32 w-32 animate-spin rounded-full border-b-2 border-[#00c1a0]"></div>
                <p className="mt-4 text-[#00c1a0]">Загрузка...</p>
            </div>
        </div>
    )
}
