import { useState } from "react";
import { useRouter } from "next/router";

export default function CreateActivity() {
  const router = useRouter();
  const [activityName, setActivityName] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [modeA, setModeA] = useState<null | "random" | "balance" >(null);
  const [modeB, setModeB] = useState<null | "less" | "makeup" >(null);
  const [courtCount, setCourtCount] = useState(2);
  const [courtNames, setCourtNames] = useState<string[]>(["", ""]);

  const handleCourtCountChange = (count: number) => {
    setCourtCount(count);
    setCourtNames((prev) => {
      const newNames = [...prev];
      while (newNames.length < count) newNames.push("");
      return newNames.slice(0, count);
    });
  };

  const handleCreate = () => {
    if (!activityName || !startTime || !endTime || !modeA || !modeB) {
      alert("請完整填寫所有欄位");
      return;
    }

    const now = new Date();
    const todayStr = now.toISOString().split("T")[0];

    const startDate = new Date(`${todayStr}T${startTime}`);
    let endDate = new Date(`${todayStr}T${endTime}`);

    if (endDate <= startDate) {
      endDate.setDate(endDate.getDate() + 1);
    }

    alert(`活動：${activityName}
公開：${isPublic}
時間：${startDate.toLocaleString()} ～ ${endDate.toLocaleString()}
球場數：${courtCount}
分配方式：${modeA}
上場方式：${modeB}`);
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

      <div style={{ marginTop: 10 }}>活動時間 (24 小時制)</div>
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
