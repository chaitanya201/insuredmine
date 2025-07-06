import os from "os";
import { exec } from "child_process";

const CPU_THRESHOLD = 70;
const MONITOR_INTERVAL = 5000;

function getCpuUsage() {
  return new Promise((resolve) => {
    const startCpu = os.cpus();
    const startTime = process.hrtime();

    setTimeout(() => {
      const endCpu = os.cpus();
      const endTime = process.hrtime(startTime);

      let totalIdle = 0;
      let totalTick = 0;

      for (let i = 0; i < startCpu.length; i++) {
        const idleDifference = endCpu[i].times.idle - startCpu[i].times.idle;
        const totalDifference =
          Object.values(endCpu[i].times).reduce((acc, val) => acc + val, 0) -
          Object.values(startCpu[i].times).reduce((acc, val) => acc + val, 0);

        totalIdle += idleDifference;
        totalTick += totalDifference;
      }

      const cpuUsage = 100 - (totalIdle / totalTick) * 100;
      resolve(cpuUsage);
    }, 1000); // Sample over 1 second
  });
}

function cpuMonitoring() {
  setInterval(async () => {
    try {
      const cpuUsage = await getCpuUsage();
      console.log(`Current CPU Utilization: ${cpuUsage.toFixed(2)}%`);

      if (cpuUsage > CPU_THRESHOLD) {
        console.warn(
          `WARNING: CPU utilization (${cpuUsage.toFixed(
            2
          )}%) exceeded ${CPU_THRESHOLD}%!`
        );
        console.warn("Simulating server restart...");
        // process.exit(1);
        exec("pm2 restart all");
      }
    } catch (error) {
      console.error("Error monitoring CPU:", error);
    }
  }, MONITOR_INTERVAL);
  console.log(
    `CPU monitoring started. Threshold: ${CPU_THRESHOLD}%. Checking every ${
      MONITOR_INTERVAL / 1000
    } seconds.`
  );
}
export { cpuMonitoring, getCpuUsage };
