import { AppState, AppStateStatus } from "react-native";
import { useEffect, useMemo, useRef, useState } from "react";

// deadlineMs までの残り秒数を返すタイマーフック
// - 残りは常に (deadline - Date.now()) の差分で計算し、ドリフトを回避
// - AppState で foreground に戻った際に即再計算
export function useCountdown(deadlineMs: number | null | undefined, onFinish?: () => void) {
  const [remainSec, setRemainSec] = useState<number>(() => calcRemain(deadlineMs));
  const finishedRef = useRef(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // 残り秒の計算
  function calcRemain(ms: number | null | undefined) {
    if (!ms) return 0;
    const diff = Math.ceil((ms - Date.now()) / 1000);
    return diff > 0 ? diff : 0;
  }

  // 1秒おきに見た目を更新（差分で算出）
  useEffect(() => {
    setRemainSec(calcRemain(deadlineMs));

    // 新しいカウントダウンが始まるときは finished をリセット
    if (deadlineMs && deadlineMs > Date.now()) {
      finishedRef.current = false;
    }

    // 既存intervalをクリア
    if (intervalRef.current) clearInterval(intervalRef.current);

    if (deadlineMs && deadlineMs > Date.now()) {
      intervalRef.current = setInterval(() => {
        setRemainSec(calcRemain(deadlineMs));
      }, 1000);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [deadlineMs]);

  // AppState: active 復帰時に即再計算
  useEffect(() => {
    const sub = AppState.addEventListener("change", (state: AppStateStatus) => {
      if (state === "active") {
        setRemainSec(calcRemain(deadlineMs));
      }
    });
    return () => {
      sub.remove();
    };
  }, [deadlineMs]);

  // 終了検知（1回だけ）
  // 初回に deadlineMs が設定された直後は remainSec が 0 のままのフレームがあり得るため、
  // 実際に締切を過ぎたか（ms差分）でも判定してフライング完了を防止する。
  useEffect(() => {
    if (!deadlineMs || finishedRef.current) return;
    const diffMs = deadlineMs - Date.now();
    if (remainSec <= 0 && diffMs <= 0) {
      finishedRef.current = true;
      onFinish?.();
    }
  }, [remainSec, deadlineMs, onFinish]);

  // 表示用の MM:SS をメモ化
  const mmss = useMemo(() => formatMMSS(remainSec), [remainSec]);

  return { remainSec, mmss } as const;
}

export function formatMMSS(totalSec: number) {
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  const mm = String(m).padStart(2, "0");
  const ss = String(s).padStart(2, "0");
  return `${mm}:${ss}`;
}
