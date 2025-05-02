import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function ActivityPage() {
  const router = useRouter();
  const { activityId } = router.query;  // 從路由參數中讀取活動 ID
  const [activityData, setActivityData] = useState<any>(null);

  useEffect(() => {
    if (activityId) {
      // 假設有一個 API 可以根據 activityId 加載活動資料
      fetch(`/api/activity/${activityId}`)
        .then((res) => res.json())
        .then((data) => setActivityData(data))
        .catch((error) => console.error("活動資料加載失敗：", error));
    }
  }, [activityId]);

  if (!activityData) {
    return <div>載入中...</div>;
  }

  return (
    <div>
      <h1>{activityData.activityName}</h1>
      <p>活動時間：{activityData.startTime} - {activityData.endTime}</p>
      <p>活動代碼：{activityId}</p>
      {/* 顯示其他活動資訊 */}
    </div>
  );
}
