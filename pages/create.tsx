import { useState, useEffect } from "react";
import { useRouter } from "next/router";

export default function CreateActivity() {
  const router = useRouter();
  const { userId, nickname, winRate} = router.query;

  const [activityName, setActivityName] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [modeA, setModeA] = useState<null | "random" | "balance">(null);
  const [modeB, setModeB] = useState<null | "less" | "makeup">(null);
  const [courtCount, setCourtCount] = useState(2);
  const [courtNames, setCourtNames] = useState<string[]>(["", ""]);

  // 確保 courtNames 長度跟 courtCount 一致
  const handleCourtCountChange = (count: number) => {
    setCourtCount(count);
    setCourtNames((prev) => {
      const newNames = [...prev];
      while (newNames.length < count) newNames.push("");
      return newNames.slice(0, count);
    });
  };

  const handleCreate = async () => {
    if (!activityName || !startTime || !endTime || !modeA || !modeB) {
      alert("請完整填寫所有欄位");
      return;
    }

    const now = new Date();
    const todayStr = now.toISOString().split("T")[0];
    const createdAt = new Date().toISOString();
    const startDate = new Date(`${todayStr}T${startTime}`);
    let endDate = new Date(`${todayStr}T${endTime}`);
    if (endDate <= startDate) {
      endDate.setDate(endDate.getDate() + 1);
    }

    // 建立者資訊（來自 query）
    const creatorId = userId || "unknown";
    const creatorNickname = nickname || "匿名球友";
    const creatorwinRate = winRate || "匿名球友";
  
    // 球友結構（含 playedCount）
    const playerInfo = {
      userId: creatorId,
      nickname: creatorNickname,
      winRate: creatorwinRate,
      playedCount: 0,
    };
  
    const activityData = {
      type: "createActivity",
      createdAt,
      activityName,
      isPublic,
      startTime: startDate.toISOString(),
      modeA,
      modeB,
      courtCount,
      courtNames,
      creatorId,
      creatorNickname,
  
      // ✅ 新增球友與閒置名單
      playerList: [playerInfo],
      idleList: [playerInfo],
  
      // ✅ 新增球場資訊，每場預留 8 位球友欄位
      courts: courtNames.map((name, index) => ({
        courtName: name || `球場 ${index + 1}`,
        players: Array(8).fill(null), // 預設為空位
      })),
    };
  
    try {
      const response = await fetch("https://script.google.com/macros/s/AKfycbxojawCndRPgD_v8mIWqy91X9UKGQSHb211ZbuF2iSOcIXxG0DxnBG_SPSoyEKOcbpy/exec", {
        method: "POST",
        headers: {
          "Content-Type": "text/plain;charset=utf-8",
        },
        body: JSON.stringify(activityData),
      });
  
      const result = await response.json();
      if (result.status === "Success") {
        alert("活動創建成功！活動代碼：" + result.activityId);
        // router.push(`/activity/${result.activityId}`);
      } else {
        alert("活動創建失敗！");
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        alert("發生錯誤：" + error.message);
      } else {
        alert("發生未知錯誤");
      }
      console.error("Error:", error);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2 style={{ fontSize: "20px" }}>建立活動</h2>

      <input
        placeholder="活動名稱"
        value={activityName}
        onChange={(e) => setActivityName(e.target.value)}
        style={{ padding: 12, fontSize: 18, width: "100%", margin: "10px 0" }}
      />

      <div style={{ marginTop: 10 }}>活動時間</div>
      <div style={{ display: "flex", gap: 10 }}>
        <input
          type="time"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          style={{ flex: 1 }}
        />
        <span>～</span>
        <input
          type="time"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
          style={{ flex: 1 }}
        />
      </div>

      <div style={{ marginTop: 20 }}>是否公開</div>
      <div style={{ display: "flex", gap: 10 }}>
        <button
          onClick={() => setIsPublic(true)}
          style={{
            padding: 10,
            backgroundColor: isPublic ? "#a0e7f7" : "#eee",
            flex: 1,
            border: "none",
            borderRadius: 4,
          }}
        >
          公開活動
        </button>
        <button
          onClick={() => setIsPublic(false)}
          style={{
            padding: 10,
            backgroundColor: !isPublic ? "#a0e7f7" : "#eee",
            flex: 1,
            border: "none",
            borderRadius: 4,
          }}
        >
          秘密活動
        </button>
      </div>

      <div style={{ marginTop: 20 }}>分配方式</div>
      <div style={{ display: "flex", gap: 10 }}>
        <button
          onClick={() => setModeA("random")}
          style={{
            padding: 10,
            backgroundColor: modeA === "random" ? "#a0e7f7" : "#eee",
            flex: 1,
            border: "none",
            borderRadius: 4,
          }}
        >
          隨機分配
        </button>
        <button
          onClick={() => setModeA("balance")}
          style={{
            padding: 10,
            backgroundColor: modeA === "balance" ? "#a0e7f7" : "#eee",
            flex: 1,
            border: "none",
            borderRadius: 4,
          }}
        >
          勝率平衡
        </button>
      </div>

      <div style={{ marginTop: 20 }}>上場方式</div>
      <div style={{ display: "flex", gap: 10 }}>
        <button
          onClick={() => setModeB("less")}
          style={{
            padding: 10,
            backgroundColor: modeB === "less" ? "#a0e7f7" : "#eee",
            flex: 1,
            border: "none",
            borderRadius: 4,
          }}
        >
          遲到少打
        </button>
        <button
          onClick={() => setModeB("makeup")}
          style={{
            padding: 10,
            backgroundColor: modeB === "makeup" ? "#a0e7f7" : "#eee",
            flex: 1,
            border: "none",
            borderRadius: 4,
          }}
        >
          遲到補打
        </button>
      </div>

      <div style={{ marginTop: 20 }}>
        球場數量：
        <input
          type="number"
          value={courtCount}
          min={2}
          onChange={(e) => handleCourtCountChange(Number(e.target.value))}
          style={{ marginLeft: 10 }}
        />
      </div>

      <div style={{ marginTop: 10 }}>
        {Array.from({ length: courtCount }).map((_, i) => (
          <input
            key={i}
            placeholder={`球場 ${i + 1} 顯示名（可選填）`}
            value={courtNames[i] || ""}
            onChange={(e) => {
              const newNames = [...courtNames];
              newNames[i] = e.target.value;
              setCourtNames(newNames);
            }}
            style={{ display: "block", marginTop: 5, width: "100%", padding: 8 }}
          />
        ))}
      </div>

      <button
        onClick={handleCreate}
        style={{
          marginTop: 30,
          width: "100%",
          padding: 12,
          fontSize: 18,
          backgroundColor: "#0070f3",
          color: "white",
          border: "none",
          borderRadius: 4,
        }}
      >
        建立活動
      </button>
    </div>
  );
}
