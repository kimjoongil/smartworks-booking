import { useEffect } from "react";

type RefreshTime = {
  hours: number;
  minutes: number;
};

const useAutoRefresh = (refreshTimes: RefreshTime[]) => {
  useEffect(() => {
    const calculateTimeout = (targetTime: RefreshTime) => {
      const now = new Date();
      const targetDate = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        targetTime.hours,
        targetTime.minutes,
        0,
        0
      );

      // 이미 시간이 지났으면 다음 날로 설정
      if (now > targetDate) {
        targetDate.setDate(targetDate.getDate() + 1);
      }

      return targetDate.getTime() - now.getTime();
    };

    const setRefreshTimeouts = () => {
      for (const time of refreshTimes) {
        const timeout = calculateTimeout(time);
        setTimeout(() => {
          window.location.reload();
        }, timeout);
      }
    };

    setRefreshTimeouts();

    // 이 함수는 초기 마운트 때 한 번만 실행되어야 하기 때문에,
    // 언마운트시에 특별한 클린업은 필요하지 않습니다.
  }, [refreshTimes]);
};

export default useAutoRefresh;
