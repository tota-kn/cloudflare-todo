/**
 * 日付をUTC時間で表示用にフォーマットする
 *
 * タイムゾーンを明示しないと実行環境（SSR の Workers とブラウザ）ごとに
 * 結果が変わり、ハイドレーション不一致を起こすため UTC に固定している。
 */
export const formatDateTime = (dateString: string): string => {
  return new Date(dateString).toLocaleString("ja-JP", {
    timeZone: "UTC",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  })
}
