import { stripMetaCurrencySymbols } from "./inline-products.template"

describe("should test stripMetaCurrencySymbols", () => {
  it("should return empty string for empty string input", () => {
    expect(stripMetaCurrencySymbols("")).toBe("")
  })
  it("should keep currency symbols and numbers", () => {
    expect(stripMetaCurrencySymbols("$100")).toBe("$100")
    expect(stripMetaCurrencySymbols("€200.50")).toBe("€200.50")
    expect(stripMetaCurrencySymbols("£300,00")).toBe("£300,00")
    expect(stripMetaCurrencySymbols("¥400")).toBe("¥400")
  })
  it("should remove non-currency characters", () => {
    expect(stripMetaCurrencySymbols("Price: $100")).toBe("$100")
    expect(stripMetaCurrencySymbols("Total: €200.50")).toBe("€200.50")
    expect(stripMetaCurrencySymbols("Cost: £300,00")).toBe("£300,00")
    expect(stripMetaCurrencySymbols("Amount: ¥400")).toBe("¥400")
  })
  it("should handle multiple currency symbols", () => {
    expect(stripMetaCurrencySymbols("$100€200")).toBe("$100€200")
    expect(stripMetaCurrencySymbols("£300,00¥400")).toBe("£300,00¥400")
  })
  it("should remove GBP symbol but keep the number", () => {
    expect(stripMetaCurrencySymbols("GBP£300,00")).toBe("£300,00")
  })
})
