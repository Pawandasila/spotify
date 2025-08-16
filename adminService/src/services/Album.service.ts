import { eq } from 'drizzle-orm';
import { db } from "../db/index.js";
import { albums, songs, type NewAlbum, type Album } from "../db/schema.js";

export const addAlbumService = async (albumData: NewAlbum): Promise<Album> => {
    try {
        const { title, artist, releaseDate, description, thumbnail } = albumData;

        const [album] = await db.insert(albums).values({
            title,
            artist,
            releaseDate,
            description,
            thumbnail,
        }).returning();

        if (!album) {
            throw new Error('Failed to create album');
        }

        return album;

    } catch (error) {
        throw error;
    }
};

export const getAllAlbumsService = async (): Promise<Album[]> => {
    try {
        return await db.select().from(albums);
    } catch (error) {
        throw error;
    }
};

export const getAlbumByIdService = async (id: number): Promise<Album | null> => {
    try {
        const [album] = await db.select().from(albums).where(eq(albums.id, id));
        return album || null;
    } catch (error) {
        throw error;
    }
};

export const updateAlbumService = async (id: number, albumData: Partial<NewAlbum>): Promise<Album | null> => {
    try {
        const [album] = await db
            .update(albums)
            .set(albumData)
            .where(eq(albums.id, id))
            .returning();
        
        return album || null;
    } catch (error) {
        throw error;
    }
};

export const deleteAlbumService = async (id: number): Promise<Album> => {
    try {
        await db
            .update(songs)
            .set({ albumId: null })
            .where(eq(songs.albumId, id));

        
        const [deletedAlbum] = await db
            .delete(albums)
            .where(eq(albums.id, id))
            .returning();

        if (!deletedAlbum) {
            throw new Error(`Album with ID ${id} not found`);
        }

        return deletedAlbum;
    } catch (error) {
        throw error;
    }
};
