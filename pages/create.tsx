import { useState } from "react";

export default function CreateActivityPage() {
  const [name, setName] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [modes, setModes] = useState<string[]>([]);
  const [courtCount, setCourtCount] = useState(2);
  const [courtNames, setCourtNames] = useState<string[]>(["", ""]);

  const toggleMode = (mode: string) => {
    setModes(prev =>
      prev.includes(mode) ? prev.filter(m => m !== mode) : [...prev, mode]
    );
  };

  const handleCourtCountChange = (count: number) => {
    setCourtCount(count);
    const updated = [...courtNames];
    while (updated.length < count) updated.push("");
    if (updated.length > count) updated.length = count;
    setCourtNames(updated);
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>建立活動</h2>
      <input
        placeholder="活動名稱"
        value={name}
        onChange={e => setName(e.target.value)}
        style={{ marginBottom: 10, display: "block", width: "100%" }}
      />
      <label>
        開始時間：
        <input type="datetime-local" value={startTime} onChange={e => setStartTime(e.target.value)} />
      </label>
      <br />
      <label>
        結束時間：
        <input type="datetime-local" value={endTime} onChange={e => setEndTime(e.target.value)} />
      </label>
      <br />
      <label>
        是否公開：
        <select value={isPublic ? "public" : "private"} onChange={e => setIsPublic(e.target.value === "public")}>
          <option value="public">開放搜尋</option>
          <option value="private">秘密建立</option>
        </select>
      </label>

      <div style={{ marginTop: 20 }}>
        <div>排場模式：</div>
        {["A-1 隨機分配", "A-2 勝率平衡", "B-1 遲到少打", "B-2 遲到補打"].map((label, i) => {
          const value = `mode-${i + 1}`;
          return (
            <label key={value} style={{ display: "block" }}>
              <input
                type="checkbox"
                checked={modes.includes(value)}
                onChange={() => toggleMode(value)}
              />
              {label}
            </label>
          );
        })}
      </div>

      <div style={{ marginTop: 20 }}>
        <label>
          球場數量：
          <input
            type="number"
            value={courtCount}
            min={2}
            onChange={e => handleCourtCountChange(Number(e.target.value))}
          />
        </label>
        <div>
          {Array.from({ length: courtCount }).map((_, i) => (
            <input
              key={i}
              placeholder={`球場 ${i + 1} 顯示名（可選填）`}
              value={courtNames[i]}
              onChange={e => {
                const newNames = [...courtNames];
                newNames[i] = e.target.value;
                setCourtNames(newNames);
              }}
              style={{ display: "block", marginTop: 5 }}
            />
          ))}
        </div>
      </div>

      <button style={{ marginTop: 30 }}>確認建立</button>
    </div>
  );
}
