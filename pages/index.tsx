import { useState } from "react";
import { useRouter } from "next/router";  // 加入這行

export default function HomePage() {
  const [nickname, setNickname] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const router = useRouter(); // 使用 router

  const handleSubmit = () => {
    if (nickname.trim()) {
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
        <button onClick={handleSubmit}>進入活動系統</button>
      </div>
    );
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>你好，{nickname}</h1>
      <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
        <button onClick={handleCreate}>+ 建立活動</button>
        <button>+ 加入活動</button>
      </div>
    </div>
  );
}
