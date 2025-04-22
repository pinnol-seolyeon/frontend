import React from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import styles from './AttendanceCalendar.module.css';

export default function AttendanceCalendar({ attendedDates }) {
  const attendedDateSet = new Set(attendedDates); //

  const tileClassName = ({ date, view }) => {
    if (view === 'month') {
      const dateStr = date.toLocaleDateString('sv-SE'); //
      if (attendedDateSet.has(dateStr)) {
        return styles.attendedDay;
      }
    }
    return null;
  };

  return (
    <div className={styles.calendarWrapper}>
      <h3>이번 달 출석</h3>
      <Calendar
        tileClassName={tileClassName}
        locale="ko-KR"
      />
    </div>
  );
}
