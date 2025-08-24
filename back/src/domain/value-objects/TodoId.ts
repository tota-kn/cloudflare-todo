/**
 * TodoのIDを表す値オブジェクト
 * IDの形式をバリデーションし、型安全性を提供する
 */
export class TodoId {
  /**
   * TodoIdを作成する
   * @param value ID文字列
   * @throws {Error} valueが空文字列の場合にエラーを投げる
   */
  constructor(private readonly value: string) {
    this.validate()
  }

  /**
   * IDのバリデーションを行う
   * @throws {Error} IDが空の場合にエラーを投げる
   */
  private validate(): void {
    if (!this.value || this.value === "") {
      throw new Error("TodoId cannot be empty")
    }
  }

  /**
   * IDの値を取得する
   * @returns ID文字列
   */
  getValue(): string {
    return this.value
  }

  /**
   * IDを文字列として取得する
   * @returns ID文字列
   */
  toString(): string {
    return this.value
  }

  /**
   * 他のTodoIdと等価性を比較する
   * @param other 比較対象のTodoId
   * @returns 等しい場合はtrue、そうでなければfalse
   */
  equals(other: TodoId): boolean {
    return this.value === other.value
  }
}
