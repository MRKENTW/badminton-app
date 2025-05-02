import { useState } from "react";
import { useRouter } from "next/router";
import { v4 as uuidv4 } from "uuid";

export default function HomePage() {
  const [nickname, setNickname] = useState("");
  const [experience, setExperience] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [userId, setUserId] = useState(""); // 新增 userId 狀態
  const router = useRouter();

  const experienceOptions = ["1年以下", "1~3年", "3年以上"];
  const winRateMap: Record<string, number> = {
    "1年以下": 35,
    "1~3年": 50,
    "3年以上": 65,
  };

  const handleSubmit = async () => {
    if (!nickname.trim() || !experience) return;

    const newUserId = uuidv4(); // 產生新的 userId
    const winRate = winRateMap[experience];
    const createdAt = new Date().toISOString();

    // 儲存 userId 到 state
    setUserId(newUserId);

    // 送出到 Google Sheet
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
              query: { userId, nickname},
            })
          }
        >
          + 建立活動
        </button>
        <button>+ 加入活動</button>
      </div>
    </div>
  );
}
