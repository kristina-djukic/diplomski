// src/components/SongsPage.js
import React, { useState, useEffect } from 'react'
import axios      from 'axios'
import SongCard   from './SongCard'
import Pagination from './Pagination'

export default function SongsPage({
  participantId,
  initialResponses,
  onAnswer,
  onBack,
  onSubmitAll
}) {
  const [songs,      setSongs]      = useState([])
  const [emotions,   setEmotions]   = useState([])
  const [page,       setPage]       = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  // load emotions once
  useEffect(() => {
    axios.get('/emotions').then(r => setEmotions(r.data))
  }, [])

  // load songs for current page
  useEffect(() => {
    axios.get(`/songs?page=${page}`)
      .then(r => {
        setSongs(r.data.songs)
        setTotalPages(r.data.totalPages)
      })
      .catch(console.error)
  }, [page])

  // per‐page completion check
  const allOnPageAnswered = songs.length > 0 && songs.every(s => {
    const r = initialResponses[s.id] || {}
    return r.knows   !== null &&
           r.score   >  0    &&
           r.emotion !== null
  })

  // global completion check
  // assume 10 songs per page
  const totalRequired = totalPages * 10
  const globalAnsweredCount = Object.values(initialResponses)
    .filter(r =>
      r.knows   !== null &&
      r.score   >  0    &&
      r.emotion !== null
    ).length

  const changePage = np => {
    if (np > page && !allOnPageAnswered) {
      alert('Please finish all songs on this page before moving on.')
      return
    }
    setPage(np)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="container py-5">

      <button className="btn btn-link mb-3" onClick={onBack}>
        ← Back to questions
      </button>

      <h2 className="mb-3 text-center">Rate the Songs</h2>
      <p className="mb-4 text-center">
        For each song: Yes/No, ★ rating, and one emotion. Complete all on each page before moving on.
      </p>

      <div className="d-flex justify-content-center mb-4">
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={changePage}
        />
      </div>

      <div className="row g-4">
        {songs.map(song => (
          <div className="col-12" key={song.id}>
            <SongCard
              song={song}
              emotions={emotions}
              participantId={participantId}
              initialResponse={initialResponses[song.id] || {
                knows: null, score: 0, emotion: null
              }}
              onAnswer={(id, ans) => onAnswer(id, ans)}
            />
          </div>
        ))}
      </div>

      <div className="d-flex justify-content-center mt-4">
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={changePage}
        />
      </div>

      {/* Always‐visible Submit All button */}
      <div className="d-flex justify-content-center mt-5">
        <button
          className="btn btn-success btn-lg"
          disabled={globalAnsweredCount < totalRequired}
          onClick={onSubmitAll}
        >
          Submit all
        </button>
      </div>
    </div>
  )
}
