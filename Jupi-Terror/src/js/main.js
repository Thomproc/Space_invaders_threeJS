import { World } from './world/world.js';

async function main() {
  // Get a reference to the container element
  const container = document.querySelector('#app');
  
  // create a new world
  const world = new World(container);

  // complete async tasks
  await world.init();
  
  // start the animation loop
  world.menu();
}

main().catch((err) => {
  console.error(err);
});
