import { useState } from "react";
import { useRouter } from "next/router";
import { v4 as uuidv4 } from "uuid";

export default function HomePage() {
  const [nickname, setNickname] = useState("");
  const [experience, setExperience] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [userId, setUserId] = useState("");
  const [joinMode, setJoinMode] = useState(false);
  const [joinCode, setJoinCode] = useState("");
  const router = useRouter();

  const experienceOptions = ["1年以下", "1~3年", "3年以上"];
  const winRateMap: Record<string, number> = {
    "1年以下": 35,
    "1~3年": 50,
    "3年以上": 65,
  };
  const winRate = winRateMap[experience] || 50;

  const handleSubmit = async () => {
    if (!nickname.trim() || !experience) return;

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

    const res = await fetch("https://script.google.com/macros/s/AKfycbwwLZRWLZlghHbqxOlSdXkER-HPbi1RnhzCzW_U06jipIqzEXWvd8LShFFo1UtunzyH1Q/exec", {
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
        <div style={{ marginTop: 10 }}>
          <label>球齡：</label>
          <div style={{ display: "flex", justifyContent: "center", gap: 10 }}>
            {experienceOptions.map((opt) => (
              <button
                key={opt}
                onClick={() => setExperience(opt)}
                style={{
                  background: experience === opt ? "#a0e7f8" : "white",
                  padding: "6px 12px",
                  border: "1px solid #ccc",
                  borderRadius: 4,
                }}
              >
                {opt}
              </button>
            ))}
          </div>
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
