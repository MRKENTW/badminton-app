import { useRouter } from "next/router";
import { useState, useEffect } from "react";

export default function ActivityDetail() {
  const router = useRouter();
  const { activityId } = router.query;

  const [activityData, setActivityData] = useState<any>(null);
  const [isModeA, setIsModeA] = useState<boolean>(false); // 隨機分配模式
  const [isModeB, setIsModeB] = useState<boolean>(false); // 勝率平衡模式

  // 從 query 或是 API 加載活動資料
  useEffect(() => {
    if (!activityId) return;

    const fetchActivityData = async () => {
      try {
        // 假設你從新部署的 Google Apps Script API 獲取活動資料
        const response = await fetch(`https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec?activityId=${activityId}`);
        const data = await response.json();

        if (data) {
          setActivityData(data);
          // 根據分配模式初始化狀態
          setIsModeA(data.modeA === "random");
          setIsModeB(data.modeA === "balance");
        } else {
          alert("無法加載活動資料");
        }
      } catch (error) {
        console.error("Error fetching activity data:", error);
        alert("發生錯誤，請稍後再試");
      }
    };

    fetchActivityData();
  }, [activityId]);

  // 開始排場的邏輯
  const handleStartMatch = (playerId: string) => {
    // 更新資料庫或狀態
  };

  // 讓球友進入閒置名單
  const handleRest = (playerId: string) => {
    // 將球友移動到閒置名單的邏輯
  };

  // 切換分配模式
  const handleModeChange = (mode: "random" | "balance") => {
    setIsModeA(mode === "random");
    setIsModeB(mode === "balance");
  };

  if (!activityData) {
    return <div>載入中...</div>;
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>{activityData.activityName}</h2>
      <p>活動代碼：{activityData.activityId}</p>
      <p>活動時間：{new Date(activityData.startTime).toLocaleString()} 至 {new Date(activityData.endTime).toLocaleString()}</p>

      <h3>已參加球友</h3>
      <ul>
        {activityData.playerList.map((player: any) => (
          <li key={player.userId}>
            {player.userId === activityData.creatorId ? `★${player.nickname}` : player.nickname} 
            (已排場次數: {player.playedCount})
          </li>
        ))}
      </ul>

      <h3>閒置名單</h3>
      <ul>
        {activityData.idleList.map((player: any) => (
          <li key={player.userId}>
            {player.nickname}
            <button
              onClick={() => handleRest(player.userId)}
              style={{ marginLeft: 10 }}
              disabled={activityData.playerList.some((p: any) => p.userId === player.userId)}
            >
              休息一下
            </button>
          </li>
        ))}
      </ul>

      <h3>球場資訊</h3>
      {activityData.courts.map((court: any, index: number) => (
        <div key={index} style={{ marginBottom: 20 }}>
          <div style={{ backgroundColor: "green", padding: 10, color: "white" }}>
            <h4>{court.courtName}</h4>
            <div>
              已上場球友：
              {court.players.map((player: any, i: number) => (
                player ? <span key={i}>{player.nickname} </span> : null
              ))}
            </div>
          </div>
          <div style={{ backgroundColor: "white", padding: 10 }}>
            <h4>預計下輪上場球友</h4>
            <div>
              {court.players.filter((player: any) => player === null).map((_, i: number) => (
                <span key={i}>空位 </span>
              ))}
            </div>
          </div>
        </div>
      ))}

      <h3>操作區域</h3>
      <div>
        {isModeA && (
          <div>
            <button onClick={() => handleStartMatch("random")}>開始排場</button>
            <button onClick={() => handleRest("idle")}>進閒置名單</button>
          </div>
        )}
        {isModeB && (
          <div>
            <button onClick={() => handleStartMatch("win")}>開始排場 - 勝組</button>
            <button onClick={() => handleStartMatch("lose")}>開始排場 - 敗組</button>
            <button onClick={() => handleRest("idle")}>進閒置名單</button>
          </div>
        )}
      </div>

      <button
        onClick={() => router.push(`/activity/${activityId}/edit`)}
        style={{
          marginTop: 20,
          padding: 10,
          backgroundColor: "#0070f3",
          color: "white",
          border: "none",
          borderRadius: 4,
        }}
      >
        編輯活動
      </button>
    </div>
  );
}
