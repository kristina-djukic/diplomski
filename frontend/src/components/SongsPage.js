import React, { useState, useEffect } from "react";
import axios from "axios";
import SongCard from "./SongCard";
import Pagination from "./Pagination";

export default function SongsPage({
  initialResponses,
  onAnswer,
  onBack,
  onSubmitAll,
}) {
  const [songs, setSongs] = useState([]);
  const [songsByPage, setSongsByPage] = useState({});
  const [emotions, setEmotions] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [submitting, setSubmitting] = useState(false);

  // load emotion list
  useEffect(() => {
    axios.get("/emotions").then((r) => setEmotions(r.data));
  }, []);

  // Fetch all pages' songs on mount
  useEffect(() => {
    const fetchAllPages = async () => {
      // First, fetch page 1 to get totalPages
      const first = await axios.get(`/songs?page=1`);
      let allPages = { 1: first.data.songs };
      let total = first.data.totalPages;

      // Now fetch the rest (if any)
      for (let p = 2; p <= total; p++) {
        const r = await axios.get(`/songs?page=${p}`);
        allPages[p] = r.data.songs;
      }
      setSongsByPage(allPages);
      setTotalPages(total);
    };
    fetchAllPages();
  }, []);

  // Always update songs when page or songsByPage changes
  useEffect(() => {
    setSongs(songsByPage[page] || []);
  }, [page, songsByPage]);

  // do we have _every_ field on THIS page?
  const allThisPage =
    songs.length > 0 &&
    songs.every((song) => {
      const r = initialResponses[song.id] || {};
      return (
        r.knows !== null &&
        r.score > 0 &&
        r.emotionRatings &&
        Object.values(r.emotionRatings).every((v) => v > 0)
      );
    });

  // count every answered song across _all_ pages
  const answeredCount = Object.values(initialResponses).filter(
    (r) =>
      r.knows !== null &&
      r.score > 0 &&
      r.emotionRatings &&
      Object.values(r.emotionRatings).every((v) => v > 0)
  ).length;

  // how many songs total?
  const totalRequired =
    Object.values(songsByPage).reduce((sum, arr) => sum + arr.length, 0);

  // helper function to check if a page is filled
  const isPageFilled = (p) => {
    const pageSongs = songsByPage[p] || [];
    return (
      pageSongs.length > 0 &&
      pageSongs.every((song) => {
        const r = initialResponses[song.id] || {};
        return (
          r.knows !== null &&
          r.score > 0 &&
          r.emotionRatings &&
          Object.values(r.emotionRatings).every((v) => v > 0)
        );
      })
    );
  };

  // handle page change guard
  const changePage = (np) => {
    if (np === page) return;
    if (np < page) {
      setPage(np);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    // Check all pages from current to np-1
    for (let p = page; p < np; p++) {
      if (!isPageFilled(p)) {
        alert("Please finish all songs on each page before moving on.");
        return;
      }
    }
    setPage(np);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // submission handler
  const handleSubmit = async () => {
    setSubmitting(true);
    await onSubmitAll();
    // once App.js moves to ThankYou, this unmounts anyway
  };

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
        {songs.map((song) => (
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

      {answeredCount < totalRequired && (
        <div className="text-danger mb-2 text-center">
          Please answer all questions on all pages before submitting.
        </div>
      )}

      <div className="d-flex justify-content-center mt-5">
        <button
          className="btn btn-success btn-lg"
          disabled={submitting || answeredCount < totalRequired}
          onClick={handleSubmit}
        >
          {submitting ? "Submitting…" : "Submit all"}
        </button>
      </div>
    </div>
  );
}