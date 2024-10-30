import React, { useState, useEffect } from 'react';

const CountdownTimer = ({ startTime, endTime }) => {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(endTime));
  const [timerEnded, setTimerEnded] = useState(false);

  useEffect(() => {
    if (timeLeft.total > 0) {
      const interval = setInterval(() => {
        const newTimeLeft = calculateTimeLeft(endTime);
        setTimeLeft(newTimeLeft);

        // If the time has ended, stop the timer
        if (newTimeLeft.total <= 0) {
          setTimerEnded(true);
          clearInterval(interval);
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [timeLeft, endTime]);

  if (timerEnded) {
    return null; // Hide the timer when countdown ends
  }

  return (
    <div className="mhub-campaign">
      <div className="timer-main-wrapper">
        <h3 className="ends-in">Ends in</h3>
        
          <div className="mhub-countdown-wrapper">
            <div className="mhub-countdown-box">
              <div className="mhub-countdown-number" id="mhub-cnt-days">{timeLeft.days}</div>
              <div className="mhub-countdown-label">Days</div>
            </div>
            <div className="mhub-countdown-box">
              <div className="mhub-countdown-number" id="mhub-cnt-hours">{timeLeft.hours}</div>
              <div className="mhub-countdown-label">Hours</div>
            </div>
            <div className="mhub-countdown-box">
              <div className="mhub-countdown-number" id="mhub-cnt-minutes">{timeLeft.minutes}</div>
              <div className="mhub-countdown-label">Minutes</div>
            </div>
            <div className="mhub-countdown-box">
              <div className="mhub-countdown-number" id="mhub-cnt-seconds">{timeLeft.seconds}</div>
              <div className="mhub-countdown-label">Seconds</div>
            </div>
          </div>
      
      </div>
      <p className="mhub-countdown-note text-center">This offer won’t come again, we promise!</p>
    </div>
  );
};

// Utility function to calculate time left until the endTime
const calculateTimeLeft = (endTime) => {
  const difference = new Date(endTime) - new Date();
  let timeLeft = {};

  if (difference > 0) {
    timeLeft = {
      total: difference,
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  } else {
    timeLeft = { total: 0, days: 0, hours: 0, minutes: 0, seconds: 0 };
  }

  return timeLeft;
};

export default CountdownTimer;
