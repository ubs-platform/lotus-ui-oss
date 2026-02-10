export function isTodayBetweenDates(startDate: Date, endDate: Date) {
  // Get today's date
  const today = new Date();

  // Convert all dates to timestamps (milliseconds)
  const todayTime = today.getTime();
  const startTimestamp = startDate.getTime();
  const endTimestamp = endDate.getTime();

  // Check if today is between the two dates
  return todayTime >= startTimestamp && todayTime <= endTimestamp;
}
