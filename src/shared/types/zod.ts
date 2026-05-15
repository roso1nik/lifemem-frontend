import z from 'zod'

export const emailSchema = z.email('Введите корректный email адрес')
