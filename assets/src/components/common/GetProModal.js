import React, { useState, useEffect } from 'react';
import { useMhubAdmin } from '../../App/MhubAdminContext';
import '../../scss/common/_get_pro.scss';
import CountdownTimer from './CountdownTimer';

const GetProModal = () => {
  const { isModalOpen, closeProModal } = useMhubAdmin();

  const [startTime, setStartTime] = useState('2024-10-21 16:00:00');
  const [endTime, setEndTime] = useState('2024-10-31 24:00:00');
  const [showTimer, setShowTimer] = useState(false);

  // Automatically show timer if the times are valid
  const startCountdown = () => {
    if (new Date(startTime) < new Date(endTime)) {
      setShowTimer(true);
    } else {
      alert('End time should be greater than start time.');
    }
  };

  useEffect(() => {
    startCountdown(); // Start countdown automatically
  }, []);

  const handleCheckout = () => {
    if (typeof mhubMeetingsData !== 'undefined') {
      // Determine the URL based on is_paying
      const url = mhubMeetingsData.is_paying
        ? mhubMeetingsData.pricing_url
        : mhubMeetingsData.checkout_url;

      if (url) {
        // If it's checkout_url, open in the same tab; otherwise, open in a new tab
        if (mhubMeetingsData.is_paying) {
          window.open(url, '_blank'); // Open in a new tab
        } else {
          window.location.href = url; // Redirect in the same tab
        }
      } else {
        console.error('URL not available');
      }
    } else {
      console.error('mhubMeetingsData not defined');
    }
  };

  if (!isModalOpen) return null;

  return (
    <div className="mhub-modal-overlay" onClick={closeProModal}>
      <div className="mhub-modal" onClick={e => e.stopPropagation()}>
        <button className="mhub-modal-close" onClick={closeProModal}>×</button>
        <div className="mhub-modal-content">
          <h2>Unlock access to all features 🎉</h2>
          
          {showTimer ? (
            <p className='ltd-title' >Best Lifetime Deal Ever</p>
          ) : (
            <p >Don't miss the attractive deal! Grab it fast!</p>
          )}

          {showTimer && (
            <CountdownTimer startTime={startTime} endTime={endTime} />
          )}

          {showTimer ? (
            <button className="mhub-cta-btn" onClick={handleCheckout}>
              Claim 84% OFF
            </button>
          ) : (
            <button className="mhub-modal-button" onClick={handleCheckout}>
              Get Premium
            </button>
          )}
  
        </div>
      </div>
    </div>
  );
};

export default GetProModal;
