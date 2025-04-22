export default function TodayStudyTime({ hours, minutes }) {
  return (
    <div className="study-time">
      <h3>오늘 학습 시간</h3>
      <p>
        <strong>
          {hours > 0 && `${hours}시간 `}{minutes}분
        </strong>{" "}
        공부했어요!
      </p>
    </div>
  );
}
