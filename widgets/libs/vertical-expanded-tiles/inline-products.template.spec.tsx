import { stripMetaCurrencySymbols } from "./inline-products.template"

describe("should test stripMetaCurrencySymbols", () => {
  test("should return empty string for empty string input", () => {
    expect(stripMetaCurrencySymbols("")).toBe("")
  })
  test("should keep currency symbols and numbers", () => {
    expect(stripMetaCurrencySymbols("$100")).toBe("$100")
    expect(stripMetaCurrencySymbols("€200.50")).toBe("€200.50")
    expect(stripMetaCurrencySymbols("£300,00")).toBe("£300,00")
    expect(stripMetaCurrencySymbols("¥400")).toBe("¥400")
  })
  test("should remove non-currency characters", () => {
    expect(stripMetaCurrencySymbols("Price: $100")).toBe("$100")
    expect(stripMetaCurrencySymbols("Total: €200.50")).toBe("€200.50")
    expect(stripMetaCurrencySymbols("Cost: £300,00")).toBe("£300,00")
    expect(stripMetaCurrencySymbols("Amount: ¥400")).toBe("¥400")
  })
  test("should handle multiple currency symbols", () => {
    expect(stripMetaCurrencySymbols("$100€200")).toBe("$100€200")
    expect(stripMetaCurrencySymbols("£300,00¥400")).toBe("£300,00¥400")
  })
  test("should remove GBP symbol but keep the number", () => {
    expect(stripMetaCurrencySymbols("GBP£300,00")).toBe("£300,00")
  })
})
