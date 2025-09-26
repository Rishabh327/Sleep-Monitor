// Simple rules-based analysis to compute sleep metrics

export function analyzeSleepLogs(logs) {
  if (!logs || logs.length === 0) {
    return {
      totalNights: 0,
      averageDurationHours: 0,
      averageBedTime: null,
      averageWakeTime: null,
      efficiencyPercent: 0,
      flags: ['no_data'],
    };
  }

  let totalMs = 0;
  let bedMinutes = 0;
  let wakeMinutes = 0;
  let disturbances = 0;
  let caffeine = 0;

  logs.forEach((log) => {
    const duration = new Date(log.sleepEnd) - new Date(log.sleepStart);
    totalMs += Math.max(0, duration);
    const bed = new Date(log.sleepStart);
    bedMinutes += bed.getHours() * 60 + bed.getMinutes();
    const wake = new Date(log.sleepEnd);
    wakeMinutes += wake.getHours() * 60 + wake.getMinutes();
    disturbances += log.disturbances || 0;
    caffeine += log.caffeine || 0;
  });

  const avgDurationHours = totalMs / logs.length / (1000 * 60 * 60);
  const avgBedMinutes = Math.round(bedMinutes / logs.length);
  const avgWakeMinutes = Math.round(wakeMinutes / logs.length);

  const toHHMM = (mins) => `${String(Math.floor(mins / 60)).padStart(2, '0')}:${String(mins % 60).padStart(2, '0')}`;

  const flags = [];
  if (avgDurationHours < 7) flags.push('low_average_sleep');
  if (avgDurationHours > 9) flags.push('long_average_sleep');
  if (disturbances / logs.length > 2) flags.push('frequent_disturbances');
  if (caffeine / logs.length > 200) flags.push('high_caffeine');

  return {
    totalNights: logs.length,
    averageDurationHours: Number(avgDurationHours.toFixed(2)),
    averageBedTime: toHHMM(avgBedMinutes),
    averageWakeTime: toHHMM(avgWakeMinutes),
    efficiencyPercent: Math.min(100, Math.max(50, Math.round((avgDurationHours / 8) * 100))),
    flags,
  };
}


