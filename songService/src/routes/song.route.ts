import express from "express";
import { getAllAlbum, getAllSongs, getAllSongsByAlbum, getSongById, incrementPlayCount } from "../controllers/album.controller.js";

const app = express.Router();

// Album routes
app.get('/albums', getAllAlbum);
app.get('/albums/:albumId/songs', getAllSongsByAlbum);

// Song routes
app.get('/songs', getAllSongs);
app.get('/songs/:id', getSongById);
app.patch('/songs/:id/play-count', incrementPlayCount);

export default app;