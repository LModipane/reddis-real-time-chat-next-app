import { z } from 'zod';

export const addFriendValidator = z.object({
    email: z.string().email(),
})

export const senderIdValidator = z.object({senderId: z.string()})