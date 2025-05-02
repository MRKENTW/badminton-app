// pages/activity/[activityId].tsx

import { useRouter } from "next/router";
import { useState, useEffect } from "react";

export default function ActivityDetail() {
  const router = useRouter();
  const { activityId } = router.query;

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
          const parsedData = {
            ...data.row,
            playerList: data.row["球友名單（JSON 格式）"],
            idleList: data.row["閒置名單（JSON 格式）"],
            courts: data.row["場上球友列表"],
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
    alert(`開始排場：${group}`);
  };

  const handleRest = (playerId: string) => {
    alert(`讓 ${playerId} 休息`);
  };

  if (!activityData) return <div>載入中...</div>;

  return (
    <div style={{ padding: 20 }}>
      <h2>{activityData["活動名稱"]}</h2>
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
            {player.nickname} (已排場次數: {player.playedCount})
          </li>
        ))}
      </ul>

      <h3>閒置名單</h3>
      <ul>
        {activityData.idleList.map((player: any) => (
          <li key={player.userId}>
            {player.nickname}
            {true && ( // 這裡僅閒置名單顯示按鈕
              <>
                {activityData.mode === "random" ? (
                  <>
                    <button onClick={() => handleStartMatch("random")}>開始排場</button>
                    <button onClick={() => handleRest(player.userId)}>休息一下</button>
                  </>
                ) : activityData.mode === "balance" ? (
                  <>
                    <button onClick={() => handleStartMatch("win")}>開始排場 - 勝組</button>
                    <button onClick={() => handleStartMatch("lose")}>開始排場 - 敗組</button>
                    <button onClick={() => handleRest(player.userId)}>休息一下</button>
                  </>
                ) : null}
              </>
            )}
          </li>
        ))}
      </ul>

      <h3>球場列表</h3>
      {activityData.courts.map((court: any, index: number) => (
        <div key={index} style={{ marginBottom: 20 }}>
          <div style={{ backgroundColor: "green", color: "white", padding: 10 }}>
            <h4>球場 {index + 1}</h4>
            <div>
              場上球友：
              {court.slice(0, 4).map((p: any, i: number) =>
                p ? <span key={i}>{p.nickname} </span> : <span key={i}>空位 </span>
              )}
            </div>
          </div>
          <div style={{ backgroundColor: "white", padding: 10 }}>
            <div>
              預計下輪：
              {court.slice(4, 8).map((p: any, i: number) =>
                p ? <span key={i}>{p.nickname} </span> : <span key={i}>空位 </span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

