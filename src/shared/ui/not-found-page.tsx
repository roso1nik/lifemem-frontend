export function NotFoundPage() {
    return (
        <div className="flex flex-col gap-5 pt-20 pb-20">
            <div className="mb-12 text-center text-4xl leading-none font-medium text-gray-200 sm:text-3xl">404</div>
            <p className="text-center text-4xl font-medium sm:text-3xl">Вы нашли секретное место.</p>
            <p className="mt-5 mb-12 w-full text-center">
                К сожалению, это всего лишь страница 404. Возможно, вы ошиблись в адресе или страница была перемещена на
                другой URL.
            </p>
        </div>
    )
}
