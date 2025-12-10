export function formatDate(dateString: string): string {
  if (!dateString) return "-"
  const date = new Date(dateString)
  return date.toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  })
}

export function formatTime(timeString: string): string {
  if (!timeString) return "-"
  return timeString.substring(0, 5)
}
