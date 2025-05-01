// src/components/ThankYouPage.js
import React from 'react';
import './ThankYou.css';

export default function ThankYou({ participantId }) {
  return (
    <div className="thankyou-bg">
      <div className="thankyou-card">
        <h2>Thank you for participating!</h2>
        <p>Your responses have been saved.</p>
        <p>Your unique ID is:</p>
        <div className="thankyou-id">{participantId}</div>
        <p className="thankyou-note">
          If you ever wish your data to be deleted, please email{' '}
          <a href="mailto:youremail@example.com">kristina,djukic.002@gmail.com</a> with that ID.
        </p>
      </div>
    </div>
  );
}
