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

    try {
      const response = await fetch("https://script.google.com/macros/s/AKfycbwwLZRWLZlghHbqxOlSdXkER-HPbi1RnhzCzW_U06jipIqzEXWvd8LShFFo1UtunzyH1Q/exec", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "createUser",
          nickname,
          userId,
          winRate,
          activityId: "",
          createdAt,
        }),
      });

      if (response.ok) {
        setSubmitted(true);
      } else {
        console.error("Failed to submit data.");
      }
    } catch (error) {
      console.error("Error during submit:", error);
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
        <button onClick={() => router.push("/create")}>+ 建立活動</button>
        <button>+ 加入活動</button>
      </div>
    </div>
  );
}
