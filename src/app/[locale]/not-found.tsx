import { Container, Group, Text, Title } from '@mantine/core'
import { BackButton } from '@/widgets/buttons'

export default function NotFoundPage() {
    return (
        <Container className="flex flex-col gap-5 pt-20 pb-20">
            <div className="mb-12 text-center text-4xl leading-none font-medium text-gray-200 sm:text-3xl">404</div>
            <Title className="text-center text-4xl font-medium sm:text-3xl">Вы нашли секретное место.</Title>
            <Text c="dimmed" size="lg" className="mt-5 mb-12 w-full text-center">
                К сожалению, это всего лишь страница 404. Возможно, вы ошиблись в адресе или страница была перемещена на
                другой URL.
            </Text>
            <Group justify="center">
                <BackButton />
            </Group>
        </Container>
    )
}
