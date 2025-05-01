import { useState } from "react";
import { useRouter } from "next/router";
import { v4 as uuidv4 } from "uuid";

export default function HomePage() {
  const [nickname, setNickname] = useState("");
  const [experience, setExperience] = useState(""); // 新增球齡
  const [submitted, setSubmitted] = useState(false);
  const router = useRouter();

  const experienceOptions = ["1年以下", "1~3年", "3年以上"];
  const winRateMap: Record<string, number> = {
    "1年以下": 35,
    "1~3年": 50,
    "3年以上": 65,
  };

  const handleSubmit = async () => {
    if (!nickname.trim() || !experience) return;

    const userId = uuidv4();
    const winRate = winRateMap[experience];
    const createdAt = new Date().toISOString(); // 加入建立時間

    await fetch("https://script.google.com/macros/s/AKfycbwwLZRWLZlghHbqxOlSdXkER-HPbi1RnhzCzW_U06jipIqzEXWvd8LShFFo1UtunzyH1Q/exec", {
      method: "POST",
      body: JSON.stringify({
        type: "createUser", // 指定為 createUser 類型
        nickname,
        userId,
        winRate,
        activityId: "", // 沒有活動 ID 時填空
        createdAt, // 傳送建立時間
      }),
    });
    
    setSubmitted(true);
  };

  if (!submitted) {
    return (
      <div style={{ padding: 20, textAlign: "center" }}>
        <h1>輸入暱稱開始</h1>
        <input ... />
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
