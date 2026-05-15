import Image from 'next/image'
import { NotFoundData } from './not-found-data'

export const NotFoundDataWithImage = () => {
    return (
        <>
            <div className="flex w-full flex-row items-center justify-center">
                <Image src={'/images/Promo/p-icon-1.png'} alt="promo" width={400} height={400} />
            </div>
            <NotFoundData className="mt-4" />
        </>
    )
}
