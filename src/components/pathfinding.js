// Pathfinding (for enemies) component functions

const dirVectors = [
  {x: 0, y: -1}, // UP
  {x: 0, y: 1}, // Down
  {x: -1, y: 0}, // Left
  {x: 1, y: 0}, // Right
  {x: -1, y: -1}, // Up-left
  {x: 1, y: -1}, // Up-right
  {x: -1, y: 1}, // Down-left
  {x: 1, y: 1}, // Down-right
];

// Returns map index if valid location, -999 otherwise
const mapVal = (x, y, theMap) => {
  if (x < 0 || y < 0) {
    return -999;
  }
  if (x > theMap[0].length - 1 || y > theMap.length - 1) {
    return -999;
  }

  return theMap[y][x];
};

// Simply pass in a tilemap layer and this function will take care of the rest.
export const generatePathMap = (destX, destY, collidemap) => {
  // First, count how many accessible tiles there are starting from the destination point.
  let checkStack = [];
  let pathmap = [];

  // Use original map to create new path map
  for (let y = 0; y < collidemap.layer.height; y++) {
    pathmap.push(new Array(collidemap.layer.width));
    for (let x = 0; x < collidemap.layer.width; x++) {
      let curr = collidemap.layer.data[y][x].index;
      if (curr == -1) { // Space to be traversed and check
        pathmap[y][x] = 9999; // Just has to be some high number
      }
      else {
        pathmap[y][x] = -1;
      }
    }
  }

  // Add first element to stack
  checkStack.push({x: destX, y: destY, dist: 0});

  while (checkStack.length > 0) {
    // Get current coordinates to check
    let curr = checkStack.pop();

    if (pathmap[curr.y][curr.x] > curr.dist) {
      pathmap[curr.y][curr.x] = curr.dist;
    }


    // Add adjacent tiles to checkStack if they're accessible/unchecked
    // Iterate through possible directions (using vectors defined at beginning of this file)
    for (let i = 0; i < dirVectors.length; i++) {
      if (mapVal(curr.x + dirVectors[i].x, curr.y + dirVectors[i].y, pathmap) > curr.dist + 1) {
        checkStack.push({x: curr.x + dirVectors[i].x, y: curr.y + dirVectors[i].y, dist: curr.dist + 1});
      }
    }
  }

  return pathmap;
};

// You must pass in a pathmap generated by generatePathMap()
// Returns an object/vector with an x and y component that indicates the
// direction of the shortest path to the destination from the current location
export const nextDir = (x, y, pathmap) => {
  let pathVector = {x: 0, y: 0}; // Default case - don't move!

  // Edge cases - what to do if x/y values are out of bounds
  if (x < 0) {
    pathVector.x = 1;
  }
  if (y < 0) {
    pathVector.y = 1;
  }
  if (x > pathmap[0].length - 1) {
    pathVector.x = -1;
  }
  if (y > pathmap.length - 1) {
    pathVector.y = -1;
  }

  // Case for object within valid bounds
  if (x >= 0 && y >= 0 && x < pathmap[0].length && y < pathmap.length) {
    // Check all 8 possible paths for the lowest value
    let lowestValue = 9999;

    // Iterate through each possible direction, looking for the lowest value
    for (let i = 0; i < dirVectors.length; i++) {
      let curr = mapVal(x + dirVectors[i].x, y + dirVectors[i].y, pathmap);
      if (curr == -999 || curr == -1) curr = 44444; // inaccessible direction

      if (curr < lowestValue) { // New lowest value found. Update path
        lowestValue = curr;
        pathVector.x = dirVectors[i].x;
        pathVector.y = dirVectors[i].y;
      }
    }
  }

  return pathVector;
};
