import React from 'react';
import './Welcome.css';

export default function Welcome({ onStart }) {
  return (
    <div className="welcome-container">
      <div className="welcome-card">
        <h1>Welcome to the Music Survey</h1>

        <p>
         Hi! I’m Kristina Đukić and I’m conducting research for my bachelors's thesis at the University of Primorska, Faculty of Natural Sciences, Mathematics, and Information Technology, under the supervision of Professor Dr. Marko Tkalčič. This research aims to examine how musical education of listeners and harmonic properties of songs influence emotional responses and song preferences.
        </p>
        <p>
         In this survery you will be asked to answer a few questions about your musical background, as well as rate 50 songs and rate how strongly you felt each listed emotion in response to the music. If you do not know the song or need a reminder you can listen to a couple of seconds of the song. The survey takes approximately 15 minutes to complete.
        </p>
        <p>
        Your anonymous responses will be securely stored on University of Primorska’s servers for academic analysis. No personal or identifiable information will be collected, ensuring your anonymity. Your participation is completely voluntary, and you can withdraw at any time without any consequences. At the end of the survery you will be given a unique ID that you can use to request deletion of your data at any time.

</p>
        <p>
        By clicking the "Start" button, you confirm that you have read and understood the above statement and agree to participate in this research.
        </p>

        <div className="text-center mt-4">
          <button className="btn btn-info btn-lg" onClick={onStart} style={{ width: '220px',  padding: '0.75rem 1.5rem'}}>
            Start 
          </button>
        </div>
      </div>
    </div>
  );
}
