/**
 * Port of the Python `SSRPGtest.py` example.
 *
 * 1. Launch Stone Story RPG (v4.25.0 or above).
 * 2. Enable the mindstone and make `//MindConnect: sync` the very first line
 *    of your Stonescript.
 * 3. Enter any location.
 * 4. Run `bun run examples/test.ts`.
 */
import { MindConnectError, SSRPGInterface, type StepContext } from "../src/index";

const ssrpg = new SSRPGInterface({ mode: "sync" });

// Keep script state outside the interface.
let yPos = 0;

async function testStep(context: StepContext): Promise<void> {
  // In sync mode we can act before ('pre') or after ('post') the in-game
  // script. Here everything happens in the 'pre' step.
  if (context !== "pre") return;

  // The cache is cleared at the start of every step, so repeated reads of the
  // same value cost a single round trip.
  if (await ssrpg.loc.begin()) {
    yPos = 0;
    // Commands are queued and sent as one batch when this callback returns.
    ssrpg.brew("tar", "wood");
  }

  yPos = (yPos + 1) % 30;
  ssrpg.print(`hello bun! ${new Date().toLocaleTimeString()}`, { x: 1, y: yPos });

  // One round trip for everything, with each value narrowed to its own type.
  const state = await ssrpg.readAll({
    foe: "foe",
    distance: "foe.distance",
    time: "time",
    totaltime: "totaltime",
  });
  const { foe: currentFoe, distance: foeDistance } = state;
  console.log(`(pre) foe: ${currentFoe}, distance: ${foeDistance}`);
  console.log(`(pre) time: ${state.time}, totaltime: ${state.totaltime}`);
  console.log(await ssrpg.getScreen(0, 0, 10, 10));

  console.log(`var: ${await ssrpg.var.get("mode")}`);
  await ssrpg.var.set("mode", "heal");

  if (currentFoe?.includes("boss")) {
    ssrpg.equipR("sword");
    ssrpg.equipL("hammer");
    ssrpg.loc.Pause();
    return;
  }

  ssrpg.equip("arm");

  const canActivate = await ssrpg.item.CanActivate("skeleton_arm");
  if (foeDistance !== null && foeDistance < 8 && canActivate) {
    ssrpg.activate("R");
  }

  const cooldown = await ssrpg.item.GetCooldown("skeleton_arm");
  console.log(`(pre) skeleton arm cooldown: ${cooldown}, can activate: ${canActivate}`);
}

const controller = new AbortController();
process.on("SIGINT", () => {
  console.log("\nStopping...");
  controller.abort();
});

try {
  console.log("Connecting to Stone Story RPG in SYNC mode...");
  await ssrpg.connect();
  console.log("Connected. Starting loop... (press Ctrl+C to stop)");

  // step() is called once per 'pre' and once per 'post' half of a game frame.
  await ssrpg.run(testStep, { signal: controller.signal });
  console.log("Connection closed by the game.");
} catch (error) {
  if (error instanceof MindConnectError) {
    console.error(`\n${error.name}: ${error.message}`);
    process.exitCode = 1;
  } else {
    throw error;
  }
} finally {
  console.log("Disconnecting...");
  ssrpg.disconnect();
}
