import z from "zod";

export const albumSchema = z.object({
  title: z.string().max(255),
  artist: z.string().max(255),
  releaseDate: z.string().transform((val) => new Date(val)),
  description: z.string().max(1000),
  createdAt: z.date().default(new Date()),
});
