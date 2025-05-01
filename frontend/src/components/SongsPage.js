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

  useEffect(()=>{
    axios.get('/emotions').then(r=>setEmotions(r.data))
  },[])

  useEffect(()=>{
    axios.get(`/songs?page=${page}`)
      .then(r=>{
        setSongs(r.data.songs)
        setTotalPages(r.data.totalPages)
      })
      .catch(console.error)
  },[page])

  const allThisPage = songs.length>0 && songs.every(s=>{
    const r = initialResponses[s.id]||{}
    return r.knows!==null && r.score>0 && r.emotion!==null
  })

  const totalNeeded    = totalPages*10
  const answeredCount  = Object.values(initialResponses)
    .filter(r=> r.knows!==null && r.score>0 && r.emotion!==null)
    .length

  const goPage = np => {
    if (np>page && !allThisPage) {
      alert('Please finish all songs on this page before moving on.')
      return
    }
    setPage(np)
    window.scrollTo({ top:0, behavior:'smooth' })
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
          onPageChange={goPage}
        />
      </div>

      <div className="row g-4">
        {songs.map(song=>(
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
          onPageChange={goPage}
        />
      </div>

      <div className="d-flex justify-content-center mt-5">
        <button
          className="btn btn-success btn-lg"
          disabled={answeredCount < totalNeeded}
          onClick={onSubmitAll}
        >
          Submit all
        </button>
      </div>
    </div>
  )
}
