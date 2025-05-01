import { useState } from "react";

export default function CreateActivityPage() {
  const [activityName, setActivityName] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [mode, setMode] = useState("A1"); // 預設為 A1
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const handleCreate = () => {
    // 建立活動邏輯（之後可加上後端儲存）
    alert(`活動：${activityName}\n公開：${isPublic}\n模式：${mode}\n時間：${startTime} - ${endTime}`);
  };

  return (
    <div style={{ padding: 20 }}>
      <h2 style={{ marginBottom: 10 }}>建立活動</h2>

      <input
        type="text"
        placeholder="活動名稱"
        value={activityName}
        onChange={(e) => setActivityName(e.target.value)}
        style={{ padding: 12, fontSize: 18, width: "100%", marginBottom: 20 }}
      />

      <div style={{ marginBottom: 20 }}>
        <strong>是否公開</strong>
        <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
          <button
            onClick={() => setIsPublic(true)}
            style={{
              padding: "8px 16px",
              backgroundColor: isPublic ? "#b3e5fc" : "#eee",
              border: "1px solid #ccc",
              borderRadius: 4,
            }}
          >
            公開
          </button>
          <button
            onClick={() => setIsPublic(false)}
            style={{
              padding: "8px 16px",
              backgroundColor: !isPublic ? "#b3e5fc" : "#eee",
              border: "1px solid #ccc",
              borderRadius: 4,
            }}
          >
            秘密
          </button>
        </div>
      </div>

      <div style={{ marginBottom: 20 }}>
        <strong>活動時間（只輸入時:分）</strong>
        <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
          <input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            style={{ padding: 8, flex: 1 }}
          />
          <span>～</span>
          <input
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            style={{ padding: 8, flex: 1 }}
          />
        </div>
      </div>

      <div style={{ marginBottom: 20 }}>
        <strong>排場模式</strong>
        <div style={{ display: "flex", gap: 20, marginTop: 8 }}>
          <div style={{ flex: 1 }}>
            <div style={{ marginBottom: 4 }}>分組 A</div>
            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={() => setMode("A1")}
                style={{
                  flex: 1,
                  padding: 10,
                  backgroundColor: mode === "A1" ? "#b3e5fc" : "#eee",
                  border: "1px solid #ccc",
                  borderRadius: 4,
                }}
              >
                隨機分配
              </button>
              <button
                onClick={() => setMode("A2")}
                style={{
                  flex: 1,
                  padding: 10,
                  backgroundColor: mode === "A2" ? "#b3e5fc" : "#eee",
                  border: "1px solid #ccc",
                  borderRadius: 4,
                }}
              >
                勝率平衡
              </button>
            </div>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ marginBottom: 4 }}>分組 B</div>
            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={() => setMode("B1")}
                style={{
                  flex: 1,
                  padding: 10,
                  backgroundColor: mode === "B1" ? "#b3e5fc" : "#eee",
                  border: "1px solid #ccc",
                  borderRadius: 4,
                }}
              >
                遲到少打
              </button>
              <button
                onClick={() => setMode("B2")}
                style={{
                  flex: 1,
                  padding: 10,
                  backgroundColor: mode === "B2" ? "#b3e5fc" : "#eee",
                  border: "1px solid #ccc",
                  borderRadius: 4,
                }}
              >
                遲到補打
              </button>
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={handleCreate}
        style={{
          padding: 12,
          width: "100%",
          backgroundColor: "#1976d2",
          color: "white",
          fontSize: 16,
          border: "none",
          borderRadius: 6,
        }}
      >
        建立活動
      </button>
    </div>
  );
}
