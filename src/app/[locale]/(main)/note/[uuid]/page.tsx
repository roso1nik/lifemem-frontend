import { NoteDetail } from '@/widgets/note-detail'

type NotePageProps = {
    params: Promise<{ uuid: string }>
}

export default async function NotePage({ params }: NotePageProps) {
    const { uuid } = await params
    return <NoteDetail noteId={uuid} />
}
