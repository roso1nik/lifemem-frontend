export type AiModelType = 'ImageToText' | 'TextToText' | 'Embedding'

export interface AiModel {
    id: string
    createdAt: string
    updatedAt: string
    name: string
    type: AiModelType
    isActive: boolean
}
