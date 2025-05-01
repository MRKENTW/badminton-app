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
        nickname,
        userId,
        winRate,
        activityId: "",
        createdAt, // <-- 傳送新增欄位
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
