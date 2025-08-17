import z from "zod";

export const songSchema = z.object({
    title: z.string().max(255),
    artist: z.string().max(255),
    albumId: z.string().transform((val) => parseInt(val, 10)).optional(), // Convert string to number, make optional
    duration: z.string().max(10),
    genre: z.string().max(100).optional(), // Add genre field
    // audioUrl will be generated after file upload, so not in body validation
    createdAt: z.date().default(new Date()),
})