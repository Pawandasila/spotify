import express from 'express';
import { upload, uploadAudio } from '../config/clodinary.js';
import { addAlbum } from '../controllers/addAlbum.controller.js';
import { addSong } from '../controllers/addSong.controller.js';
import { addSongThumbnail } from '../controllers/addSongThumbnail.controller.js';
import { isAdmin } from '../middlewares/Shared.middleware.js';
import { deleteAlbum, deleteSong } from '../controllers/delete.controller.js';

const app = express.Router();

const authMiddleware = isAdmin;

console.log(`🔐 Using admin authentication middleware`);

// Album routes
app.post('/addAlbum', authMiddleware, upload, addAlbum);

// Song routes
app.post('/addSong', authMiddleware, uploadAudio, addSong);

app.patch('/addSongThumbnail', authMiddleware, upload, addSongThumbnail);

app.delete('/deleteSong/:songId', authMiddleware, deleteSong);

app.delete('/deleteAlbum/:albumId', authMiddleware, deleteAlbum);

export default app;