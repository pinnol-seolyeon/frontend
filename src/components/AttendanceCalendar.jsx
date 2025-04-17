import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

export default function AttendanceCalendar({ attendedDates }) {
  return (
    <div>
      <h3>출석 캘린더</h3>
      <Calendar
        tileClassName={({ date }) =>
          attendedDates.includes(date.toISOString().split('T')[0]) ? 'attended' : ''
        }
      />
    </div>
  );
}
