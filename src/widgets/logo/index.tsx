import { APP_NAME } from '@/shared/config'

export const Logo = () => {
    return (
        <div className="flex flex-col gap-1">
            <h1 className="mt-4 w-full text-center">{APP_NAME}</h1>
        </div>
    )
}
