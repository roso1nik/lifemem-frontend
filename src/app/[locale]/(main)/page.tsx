'use client'

import CreateNoteForm from '@/features/create-note'
import { TodaySummary } from '@/widgets/today-summary'

const HomePage = () => {
    return (
        <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col px-4 pt-6 pb-4 md:px-6 md:pt-10">
            <TodaySummary />
            <div className="flex-1" />
            <div className="sticky bottom-4 mt-6 pb-[env(safe-area-inset-bottom)] md:bottom-6">
                <CreateNoteForm />
            </div>
        </div>
    )
}

export default HomePage
