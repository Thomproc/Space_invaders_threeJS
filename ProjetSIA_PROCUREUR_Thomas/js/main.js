import { World } from "./world/world.js";

async function main() {
  // Get a reference to the container element
  const container = document.querySelector("#app");
  const loading = document.querySelector("#loading");

  // Create a new world
  const world = new World(container);

  // Display loading animation
  loading.style.display = "flex";

  try {
    // Complete async tasks
    await world.init();
  } catch (error) {
    console.error("Error during initialization:", error);
  } finally {
    // Hide loading animation
    loading.style.display = "none";
  }

  // Start the animation loop
  world.menu();
}

main().catch((err) => {
  console.error(err);
});
