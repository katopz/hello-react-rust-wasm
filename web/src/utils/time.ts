export function msToTime(duration: number) {
  const milliseconds = Math.floor((duration % 1000) / 100),
    seconds = Math.floor((duration / 1000) % 60),
    minutes = Math.floor((duration / (1000 * 60)) % 60),
    hours = Math.floor((duration / (1000 * 60 * 60)) % 24)

  if (hours > 0) {
    return `${hours} h ${minutes} m ${seconds}.${milliseconds} s`
  }

  if (minutes > 0) {
    return `${minutes} m ${seconds}.${milliseconds} s`
  }

  if (seconds > 0) {
    return `${seconds}.${milliseconds} s`
  }

  return `${milliseconds} ms`
}
