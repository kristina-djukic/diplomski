// src/components/SongsPage.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SongCard from './SongCard';
import Pagination from './Pagination';

export default function SongsPage() {
  const [songs, setSongs]       = useState([]);
  const [emotions, setEmotions] = useState([]);
  const [page, setPage]         = useState(1);
  const [totalPages, setTotal]  = useState(1);

  // load emotion list once
  useEffect(() => {
    axios.get('/emotions')
      .then(({ data }) => setEmotions(data))
      .catch(console.error);
  }, []);

  // load songs for current page
  useEffect(() => {
    axios.get(`/songs?page=${page}`)
      .then(({ data }) => {
        setSongs(data.songs);
        setTotal(data.totalPages);
      })
      .catch(console.error);
  }, [page]);

  return (
    <div className="container py-5">
      <div className="row g-4">
        {songs.map(song => (
          <div className="col-12" key={song.id}>
            <SongCard song={song} emotions={emotions} />
          </div>
        ))}
      </div>

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />
    </div>
  );
}
