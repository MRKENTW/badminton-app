import { useState } from "react";
import { useRouter } from "next/router";

export default function HomePage() {
  const [nickname, setNickname] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [experience, setExperience] = useState(""); // 球齡
  const router = useRouter();

  const handleSubmit = () => {
    if (nickname.trim() && experience) {
      const experienceMap: Record<string, number> = {
        "1年以下": 35,
        "1~3年": 50,
        "3年以上": 65,
      };
      const winRate = experienceMap[experience]; // 可用於後端儲存

      console.log("暱稱:", nickname);
      console.log("球齡:", experience);
      console.log("預設勝率:", winRate);

      setSubmitted(true);
    }
  };

  const handleCreate = () => {
    router.push("/create");
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
          <label style={{ marginRight: 10 }}>選擇球齡：</label>
          {["1年以下", "1~3年", "3年以上"].map((level) => (
            <button
              key={level}
              onClick={() => setExperience(level)}
              style={{
                margin: 5,
                padding: "5px 10px",
                backgroundColor: experience === level ? "#b3e5fc" : "#f0f0f0",
                border: "none",
                borderRadius: 5,
              }}
            >
              {level}
            </button>
          ))}
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
        <button onClick={handleCreate}>+ 建立活動</button>
        <button>+ 加入活動</button>
      </div>
    </div>
  );
}
