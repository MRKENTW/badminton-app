import { useState } from "react";
import { useRouter } from "next/router";
import { v4 as uuidv4 } from "uuid";

export default function HomePage() {
  const [nickname, setNickname] = useState("");
  const [experienceValue, setExperienceValue] = useState(20); // default 新手
  const [submitted, setSubmitted] = useState(false);
  const [userId, setUserId] = useState("");
  const [joinMode, setJoinMode] = useState(false);
  const [joinCode, setJoinCode] = useState("");
  const router = useRouter();

  const levelMarks = [
    { label: "新手", value: 20 },
    { label: "初階", value: 30 },
    { label: "初中", value: 40 },
    { label: "中階", value: 50 },
    { label: "中高", value: 60 },
    { label: "高階", value: 70 },
    { label: "職業", value: 80 },
  ];

  const winRateMap: Record<number, number> = {
    20: 30,
    30: 40,
    40: 50,
    50: 60,
    60: 65,
    70: 75,
    80: 85,
  };

  const winRate = winRateMap[experienceValue] || 50;
  const experienceLabel = levelMarks.find((m) => m.value === experienceValue)?.label || "中階";

  const handleSubmit = async () => {
    if (!nickname.trim()) return;

    const newUserId = uuidv4();
    const createdAt = new Date().toISOString();

    setUserId(newUserId);

    await fetch("https://script.google.com/macros/s/AKfycbwwLZRWLZlghHbqxOlSdXkER-HPbi1RnhzCzW_U06jipIqzEXWvd8LShFFo1UtunzyH1Q/exec", {
      method: "POST",
      body: JSON.stringify({
        type: "createUser",
        nickname,
        userId: newUserId,
        winRate,
        activityId: "",
        createdAt,
      }),
    });

    setSubmitted(true);
  };

  const handleJoinActivity = async () => {
    if (!joinCode.trim()) return alert("請輸入活動代碼");

    const playerInfo = {
      userId,
      nickname,
      winRate,
      playedCount: 0,
    };

    const res = await fetch("https://script.google.com/macros/s/AKfycbzTJcn9OvJx2m7H1ysHq3tdYuSscCEUJY1DnbWtPEU_lGMqlKgxZgBzhqsdooRNT6q9/exec", {
      method: "POST",
      body: JSON.stringify({
        type: "joinActivity",
        activityId: joinCode,
        playerInfo,
      }),
    });

    const result = await res.json();
    if (result.success) {
      router.push({
        pathname: `/activity/${joinCode}`,
        query: { userId, nickname, winRate },
      });
    } else {
      alert("加入失敗，請確認活動代碼是否正確！");
    }
  };

  if (!submitted) {
    return (
      <div style={{ padding: 20, textAlign: "center" }}>
        <h1>輸入暱稱開始</h1>
        <input
          placeholder="輸入你的暱稱"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          style={{ padding: 10, width: "80%", margin: 10 }}
        />

        <div style={{ marginTop: 20 }}>
          <label>選擇球技等級：</label>
          <input
            type="range"
            min={20}
            max={80}
            step={10}
            value={experienceValue}
            onChange={(e) => setExperienceValue(parseInt(e.target.value))}
            style={{ width: "100%", marginTop: 10 }}
          />
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.9rem", marginTop: 5 }}>
            {levelMarks.map((mark) => (
              <span key={mark.value}>{mark.label}</span>
            ))}
          </div>
          <p style={{ marginTop: 10 }}>目前等級：<strong>{experienceLabel}</strong>，預估勝率：<strong>{winRate}%</strong></p>
        </div>

        <button style={{ marginTop: 20 }} onClick={handleSubmit}>
          進入活動系統
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>你好，{nickname}</h1>
      <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
        <button
          onClick={() =>
            router.push({
              pathname: "/create",
              query: { userId, nickname, winRate },
            })
          }
        >
          + 建立活動
        </button>
        {!joinMode ? (
          <button onClick={() => setJoinMode(true)}>+ 加入活動</button>
        ) : (
          <>
            <input
              placeholder="請輸入活動代碼"
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value)}
              style={{ padding: 10, flex: 1 }}
            />
            <button onClick={handleJoinActivity}>確認加入</button>
          </>
        )}
      </div>
    </div>
  );
}
