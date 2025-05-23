import { ISdk } from "packages/widget-utils/dist/esm"

declare const sdk: ISdk

export function getMyMoodBorder(mood: string) {
  switch (mood) {
    case "happy":
      return "3px solid green"
    case "sad":
      return "3px solid red"
    case "angry":
      return "3px solid black"
    default:
      return "blue"
  }
}

export function createToast(message: string) {
  const toastContainer = sdk.querySelector("#toast-container")
  const toast = document.createElement("div")
  toast.className = "toast"
  toast.textContent = message

  toastContainer?.appendChild(toast)

  // Show the toast
  requestAnimationFrame(() => {
    toast.classList.add("show")
  })

  // Remove the toast after 3 seconds
  setTimeout(() => {
    toast.classList.remove("show")
    setTimeout(() => toast.remove(), 300)
  }, 3000)
}
