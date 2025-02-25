export function getItemFromItemId(data: Battle, itemId: string): ItemType {
  // Check if the 'boxes' property exists and is an array
  if (!data.boxes || !Array.isArray(data.boxes)) {
    throw new Error("Invalid response, please try again later");
  }

  // Iterate through each box
  for (const box of data.boxes) {
    // Check if the 'items' property exists and is an array
    if (!box.items || !Array.isArray(box.items)) {
      continue; // Skip to the next box if there are no items
    }

    // Iterate through each item in the box
    for (const itemEntry of box.items) {
      // Check if the current item matches the given itemId
      if (itemEntry.item && itemEntry.item.id === itemId) {
        return itemEntry.item;
      }
    }
  }

  throw new Error("Invalid response, please try again later");
}

export function getBoxFromBoxId(data: Battle, boxId: string): BoxType {
  // Check if the 'boxes' property exists and is an array
  if (!data.boxes || !Array.isArray(data.boxes)) {
    throw new Error("Invalid response, please try again later");
  }

  // Iterate through each box
  for (const box of data.boxes) {
    // Check if the 'items' property exists and is an array
    if (box.id === boxId) {
      return box;
    }
  }

  throw new Error("Invalid response, please try again later");
}
