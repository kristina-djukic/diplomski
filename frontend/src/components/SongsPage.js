import React, { useState, useEffect } from 'react'
import axios      from 'axios'
import SongCard   from './SongCard'
import Pagination from './Pagination'

export default function SongsPage({
  initialResponses,
  onAnswer,
  onBack,
  onSubmitAll
}) {
  const [songs,      setSongs]      = useState([])
  const [emotions,   setEmotions]   = useState([])
  const [page,       setPage]       = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [submitting, setSubmitting] = useState(false)

  // load emotion list
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

  // do we have _every_ field on THIS page?
  const allThisPage = songs.length > 0 && songs.every(song => {
    const r = initialResponses[song.id] || {}
    return r.knows               !== null &&
           r.score               >  0    &&
           r.emotionRatings      &&
           Object.values(r.emotionRatings).every(v => v > 0)
  })

  // count every answered song across _all_ pages
  const answeredCount = Object.values(initialResponses)
    .filter(r =>
      r.knows               !== null &&
      r.score               >  0    &&
      r.emotionRatings      &&
      Object.values(r.emotionRatings).every(v => v > 0)
    ).length

  // how many songs total?
  const totalRequired = totalPages * songs.length

  // handle page change guard
  const changePage = np => {
    if (np > page && !allThisPage) {
      alert('Please finish all songs on this page before moving on.')
      return
    }
    setPage(np)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // submission handler
  const handleSubmit = async () => {
    setSubmitting(true)
    await onSubmitAll()
    // once App.js moves to ThankYou, this unmounts anyway
  }

  return (
    <div className="container py-5">
      <button className="btn btn-link mb-3" onClick={onBack}>
        ← Back to questions
      </button>

      <h2 className="mb-3 text-center">Rate the Songs</h2>
      <p className="mb-4 text-center">
        For each song: Yes/No, ★ rating, and 9 emotion‐ratings.
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
              initialResponse={initialResponses[song.id]}
              onAnswer={onAnswer}
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

      <div className="d-flex justify-content-center mt-5">
        <button
          className="btn btn-success btn-lg"
          disabled={submitting || answeredCount < totalRequired}
          onClick={handleSubmit}
        >
          {submitting ? 'Submitting…' : 'Submit all'}
        </button>
      </div>
    </div>
  )
}
