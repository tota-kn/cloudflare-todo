import { describe, expect, it } from "vite-plus/test"
import { getFormString } from "~/utils/form"

describe("getFormString", () => {
  it("文字列の値をそのまま返す", () => {
    const formData = new FormData()
    formData.set("title", "買い物")

    expect(getFormString(formData, "title")).toBe("買い物")
  })

  it("キーが無ければ空文字を返す", () => {
    expect(getFormString(new FormData(), "title")).toBe("")
  })

  it("ファイルが送られてきたら空文字を返す", () => {
    const formData = new FormData()
    formData.set("title", new File(["x"], "a.txt"))

    expect(getFormString(formData, "title")).toBe("")
  })
})
