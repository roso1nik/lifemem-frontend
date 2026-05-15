/* eslint-disable react-perf/jsx-no-new-function-as-prop */
'use client'

import { Button } from '@mantine/core'
import { ChevronLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'

export const BackButton = () => {
    const router = useRouter()
    return (
        <Button
            onClick={() => router.back()}
            leftSection={<ChevronLeft size={18} className="text-muted-foreground" />}
            variant="transparent"
            className="text-muted-foreground!"
        >
            Назад&nbsp;&nbsp;
        </Button>
    )
}
