import { Loader } from './loader'

export const LoadingPageNext = () => {
    return (
        <div className="relative flex h-screen min-h-auto w-full flex-col items-center justify-center">
            <Loader />
        </div>
    )
}
