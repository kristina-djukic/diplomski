import React, { useState, useEffect } from "react";
import axios from "axios";
import SongCard from "./SongCard";
import Pagination from "./Pagination";

const emotionInfo = {
  1: "Filled with wonder, dazzled, allured, moved",
  2: "Fascinated, overwhelmed, feelings of transcendence and spirituality",
  3: "Strong, triumphant, energetic, fiery",
  4: "Tender, affectionate, in love, mellowed",
  5: "Nostalgic, dreamy, sentimental, melancholic",
  6: "Serene, calm, soothed, relaxed",
  7: "Joyful, amused, animated, bouncy",
  8: "Sad, sorrowful",
  9: "Tense, agitated, nervous, irritated",
};

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
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    axios.get("/emotions").then((r) => setEmotions(r.data));
  }, []);

  useEffect(() => {
    const fetchAllPages = async () => {
      const first = await axios.get(`/songs?page=1`);
      let allPages = { 1: first.data.songs };
      let total = first.data.totalPages;
      for (let p = 2; p <= total; p++) {
        const r = await axios.get(`/songs?page=${p}`);
        allPages[p] = r.data.songs;
      }
      setSongsByPage(allPages);
      setTotalPages(total);
    };
    fetchAllPages();
  }, []);

  useEffect(() => {
    setSongs(songsByPage[page] || []);
  }, [page, songsByPage]);


  const answeredCount = Object.values(initialResponses).filter(
    (r) =>
      r.knows !== null &&
      (
        r.knows === false || 
        (
          r.knows === true &&
          r.score != null &&
          r.emotionRatings &&
          Object.values(r.emotionRatings).every((v) => v != null)
        )
      )
  ).length;

  const totalRequired =
    Object.values(songsByPage).reduce((sum, arr) => sum + arr.length, 0);

  const isPageFilled = (p) => {
    const pageSongs = songsByPage[p] || [];
    return (
      pageSongs.length > 0 &&
      pageSongs.every((song) => {
        const r = initialResponses[song.id] || {};
        if (r.knows === false) return true; 
        return (
          r.knows !== null &&
          r.score != null &&
          r.emotionRatings &&
          Object.values(r.emotionRatings).every((v) => v != null)
        );
      })
    );
  };

  const changePage = (np) => {
    if (np === page) return;
    if (np < page) {
      setPage(np);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    for (let p = page; p < np; p++) {
      if (!isPageFilled(p)) {
        alert("Please finish all songs on each page before moving on.");
        return;
      }
    }
    setPage(np);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    await onSubmitAll();
  };

  return (
    <div className="container py-5">
      <button className="btn btn-link mb-3" onClick={onBack} style={{
        color: "#16a2b9", fontSize: "1em",
      }}>
        ← Back to questions
      </button>
      <h2 className="mb-3 text-center">Rate the Songs</h2>
      <p className="mb-4 text-center">
        For each song, indicate if you know it (Yes/No). If you know it, rate how much you like it (1–5 ★) and how strongly you felt each emotion. If you’re unsure or need a reminder, you can listen to a few seconds of the song. The GEMS scale is used to measure your emotional response.<br />
        <strong>Note:</strong> You can read more about each emotion by clicking "Emotion Descriptions". You must answer all questions on each page to continue and submit.
      </p>

      <div className="text-center mb-4">
        <span
          style={{
            color: "#16a2b9",
            fontSize: "1em",
            fontWeight: 600,
            cursor: "pointer",
            textDecoration: "none"
          }}
          onClick={() => setShowModal("emotions")}
          role="button"
          tabIndex={0}
        >
          Emotion Descriptions
        </span>
      </div>

      {showModal && (
        <div
          className="info-modal"
          style={{
            position: "fixed",
            left: 0,
            top: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.45)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onClick={() => setShowModal(null)}
        >
          <div
            style={{
              background: "#fff",
              color: "#222",
              borderRadius: 12,
              padding: "22px 18px 18px 18px",
              maxWidth: 450,
              width: "90vw",
              maxHeight: "80vh",
              overflowY: "auto",
              boxShadow: "0 2px 16px rgba(0,0,0,0.18)",
              position: "relative",
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-start",
              alignItems: "stretch"
            }}
            onClick={e => e.stopPropagation()}
          >
            <button
              type="button"
              aria-label="Close"
              onClick={() => setShowModal(null)}
              style={{
                position: "absolute",
                top: 8,
                right: 12,
                background: "none",
                border: "none",
                fontSize: "1.5em",
                color: "#888",
                cursor: "pointer",
              }}
            >
              ×
            </button>
            {showModal === "emotions" && (
              <>
                <h5 style={{ textAlign: "center", marginBottom: 16, color: "#16a2b9" }}>
                  Emotion Descriptions
                </h5>
                <ul style={{ paddingLeft: 0, listStyle: "none", margin: 0 }}>
                  {[...emotions]
                    .sort((a, b) => a.id - b.id)
                    .map((e) => (
                      <li key={e.id} style={{ marginBottom: 10 }}>
                        <strong>{e.name}:</strong> {emotionInfo[e.id]}
                      </li>
                    ))}
                </ul>
              </>
            )}
          </div>
        </div>
      )}

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

      <div style={{
        fontSize: "0.9em",
        color: "#444",
        background: "#f8f9fa",
        borderRadius: 8,
        padding: "14px 20px",
        margin: "32px auto 0 auto",
        maxWidth: 700,
        textAlign: "justify",
      }}>
        <strong>
          <span style={{
            fontSize: "1.2em",
            verticalAlign: "middle",
            marginRight: 4,
            fontWeight: 700,
            letterSpacing: "1px",
            fontFamily: "Arial, Helvetica, sans-serif"
          }}>©</span>
          Copyright Notice:
        </strong><br />
        Please note that the above selection, ordering, and designation of music-evoked emotions (the “GEMS”) has been developed under the lead and responsibility of Prof. Marcel Zentner, PhD, Innsbruck University. The GEMS introduces a scientifically validated process to reliably measure musically evoked emotions. The GEMS will be amended and updated from time to time, following the results of its application in research and practice. The GEMS is protected by copyright laws worldwide. Any copying, communicating, disseminating, or making the GEMS otherwise available, is prohibited without the express permission of Prof. Marcel Zentner or his due representative.
      </div>

    </div>
  );
}