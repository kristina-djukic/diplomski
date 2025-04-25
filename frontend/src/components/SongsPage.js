// src/components/SongsPage.js

import React, { useState, useEffect } from 'react'
import axios from 'axios'
import SongCard from './SongCard'
import Pagination from './Pagination'

export default function SongsPage({ participantId }) {
  const [songs, setSongs]       = useState([])
  const [emotions, setEmotions] = useState([])
  const [page, setPage]         = useState(1)
  const [totalPages, setTotal]  = useState(1)

  // load emotion list once
  useEffect(() => {
    axios.get('/emotions')
      .then(({ data }) => setEmotions(data))
      .catch(console.error)
  }, [])

  // load songs whenever page changes
  useEffect(() => {
    axios.get(`/songs?page=${page}`)
      .then(({ data }) => {
        setSongs(data.songs)
        setTotal(data.totalPages)
      })
      .catch(console.error)
  }, [page])

  return (
    <div className="container py-5">

      {/* Top heading + instructions */}
      <h2 className="mb-3 text-center">Rate the Songs</h2>
      <p className="mb-4 text-center">
        For each clip below, please tell us if you know it, give it a 1–5 star rating,
        and select the one emotion it evoked most strongly.
      </p>

      {/* Top pagination */}
      <div className="d-flex justify-content-center mb-4">
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      </div>

      {/* Song cards */}
      <div className="row g-4">
        {songs.map(song => (
          <div className="col-12" key={song.id}>
            <SongCard
              song={song}
              emotions={emotions}
              participantId={participantId}
            />
          </div>
        ))}
      </div>

      {/* Bottom pagination */}
      <div className="d-flex justify-content-center mt-4">
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      </div>
    </div>
  )
}
