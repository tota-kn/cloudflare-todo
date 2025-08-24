/**
 * 現在のUTC時間を取得する
 * @returns 現在のUTC時間のDateオブジェクト
 */
export const getCurrentUtcTime = (): Date => {
  return new Date(Date.now())
}
