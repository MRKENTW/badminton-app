// pages/activity/[activityId].tsx

import { useRouter } from "next/router";
import { useState, useEffect } from "react";

export default function ActivityDetail() {
  const router = useRouter();
  const { activityId, userId, nickname } = router.query;

  const [activityData, setActivityData] = useState<any>(null);

  useEffect(() => {
    if (!activityId) return;

    const fetchActivityData = async () => {
      try {
        const response = await fetch(
          `https://script.google.com/macros/s/AKfycbzTJcn9OvJx2m7H1ysHq3tdYuSscCEUJY1DnbWtPEU_lGMqlKgxZgBzhqsdooRNT6q9/exec?activityId=${activityId}`
        );
        const data = await response.json();
        
        if (data.success) {
          // 取出所有欄位
          const entries = Object.entries(data.row);
          // 取得第13欄（index從0開始）之後的欄位值作為 courtNames
          const courtNames = entries.slice(12).map(([_, value]) => value);
        
          // 將每個場地加上對應名稱（若名稱有）
          const namedCourts = (data.row["場上球友列表"] || []).map((court: any, index: number) => ({
            courtName: courtNames[index] || `球場 ${index + 1}`,
            players: court,
          }));
        
          const parsedData = {
            ...data.row,
            playerList: data.row["球友名單（JSON 格式）"],
            idleList: data.row["閒置名單（JSON 格式）"],
            courts: namedCourts,
            mode: data.row["分配方式"],
          };
        
          setActivityData(parsedData);
        } else {
          alert("找不到該活動！");
        }
      } catch (err) {
        console.error(err);
        alert("取得活動資料時發生錯誤！");
      }
    };

    fetchActivityData();
  }, [activityId]);

  const handleStartMatch = (group: string) => {
    alert(`${nickname} 開始排場：${group}`);
  };

  const handleRest = (targetUserId: string) => {
    alert(`${nickname} 讓 ${targetUserId} 休息`);
  };

  if (!activityData) return <div>載入中...</div>;

  return (
    <div style={{ padding: 20 }}>
      
      <h2>{activityData["活動名稱"]}</h2>
      
      <p style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span>我的暱稱：{nickname}</span>
        {activityData.playerList.some((p: any) => p.userId === userId) && (
          <div style={{ display: "flex", gap: 8 }}>
            {activityData.mode === "random" ? (
              <button onClick={() => handleStartMatch("random")}>開始排場</button>
            ) : activityData.mode === "balance" ? (
              <>
                <button onClick={() => handleStartMatch("win")}>勝組</button>
                <button onClick={() => handleStartMatch("lose")}>敗組</button>
              </>
            ) : null}
            <button onClick={() => handleRest(userId as string)}>我要休息</button>
          </div>
        )}
      </p>

      <p>活動代碼：{activityData["活動代碼"]}</p>
      <p>
        活動時間：
        {new Date(activityData["活動開始時間"]).toLocaleString()}
      </p>

      <h3>已參加球友</h3>
      <ul>
        {activityData.playerList.map((player: any) => (
          <li key={player.userId}>
            {player.userId === activityData["創建者 ID"] ? `★` : ""}
            {player.nickname} (已排場次數: {player.matchCount ?? 0})
          </li>
        ))}
      </ul>

      <h3>等候名單</h3>
      <ul style={{ paddingLeft: 0 }}>
        {activityData.idleList.map((player: any) => (
          <li
            key={player.userId}
            style={{
              listStyle: "none",
              marginBottom: 8,
              padding: "4px 8px",
              border: "1px solid #ccc",
              borderRadius: 4,
            }}
          >
            {player.nickname}
          </li>
        ))}
      </ul>

      <h3>球場列表</h3>
      {activityData.courts.map((court: any, index: number) => {
        const courtName = court.courtName || `球場 ${index + 1}`;
        const onCourt = court.players?.slice(0, 4) || [];
        const nextRound = court.players?.slice(4, 8) || [];

        return (
          <div key={index} style={{ marginBottom: 12 }}>
            <div style={{ backgroundColor: "green", color: "white", padding: "4px 8px" }}>
              <strong>{courtName}</strong>
              <div style={{ marginTop: 4 }}>
                場上球友：
                {onCourt.map((p: any, i: number) =>
                  p ? <span key={i}>{p.nickname} </span> : <span key={i}>空位 </span>
                )}
              </div>
            </div>
            <div style={{ backgroundColor: "white", padding: "4px 8px" }}>
              預計下輪：
              {nextRound.map((p: any, i: number) =>
                p ? <span key={i}>{p.nickname} </span> : <span key={i}>空位 </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
