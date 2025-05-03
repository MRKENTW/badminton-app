// pages/activity/[activityId].tsx
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function ActivityPage() {
  const router = useRouter();
  const { activityId, nickname, userId } = router.query;

  const [activityData, setActivityData] = useState<any>(null);

  useEffect(() => {
    if (!activityId) return;
    const fetchData = async () => {
      const res = await fetch(
        `https://script.google.com/macros/s/AKfycbwHt5Cv4RJ1a7NN0ExRCyHVmXJ2nXyGF0h7r3QdY7jHnQ7NJPQAoWkehyKfWUi8xuVxTQ/exec?action=getActivity&activityId=${activityId}`
      );
      const data = await res.json();
      if (data.success) {
        const entries = Object.entries(data.row);
        const courtNames = entries.slice(12).map(([_, value]) => value);
        const parsedData = {
          ...data.row,
          playerList: data.row["球友名單（JSON 格式）"],
          idleList: data.row["閒置名單（JSON 格式）"],
          courts: data.row["場上球友列表"],
          courtNames,
        };
        setActivityData(parsedData);
      }
    };
    fetchData();
  }, [activityId]);

  if (!activityData) return <div>載入中...</div>;

  return (
    <div style={{ padding: 20 }}>
      <p>目前使用者：{nickname}（ID: {userId}）</p>

      <h2>{activityData["活動名稱"]}</h2>

      <h3>參加球友</h3>
      <ul>
        {activityData.playerList.map((player: any, index: number) => (
          <li key={index}>
            {player.nickname}（勝率: {player.winRate}%，上場次數: {player.matchCount})
            {player.userId === activityData["創建者 ID"] ? " 👑" : ""}
          </li>
        ))}
      </ul>

      <h3>閒置球友</h3>
      <ul>
        {activityData.idleList.map((player: any, index: number) => (
          <li key={index}>
            {player.nickname}（勝率: {player.winRate}%，上場次數: {player.matchCount})
          </li>
        ))}
      </ul>

      <h3>球場列表</h3>
      {activityData.courts.map((court: any, index: number) => {
        const courtName =
          activityData.courtNames?.[index] || `球場 ${index + 1}`;
        return (
          <div key={index} style={{ marginBottom: 20 }}>
            <h4>{courtName}</h4>
            <ul>
              {court.map((player: any, idx: number) => (
                <li key={idx}>
                  {player.nickname}（勝率: {player.winRate}%，上場次數: {player.matchCount})
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
}
