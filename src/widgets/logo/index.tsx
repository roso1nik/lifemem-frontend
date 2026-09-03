import { APP_NAME } from '@/shared/config'

export const Logo = () => {
    return (
        <div className="flex flex-col gap-1 px-2">
            <p className="font-brand text-primary text-center text-lg font-semibold tracking-tight lowercase">
                {APP_NAME}
            </p>
        </div>
    )
}
