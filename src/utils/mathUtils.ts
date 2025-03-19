
// This file contains utility functions for mathematical operations

// Calculate the final value of balloons and sandbags
export const calculateValue = (balloons: number, sandbags: number): number => {
  return balloons - sandbags;
};

// Convert a value to balloons and sandbags
export const valueToBalloonsAndSandbags = (value: number): { balloons: number; sandbags: number } => {
  if (value >= 0) {
    return { balloons: value, sandbags: 0 };
  } else {
    return { balloons: 0, sandbags: Math.abs(value) };
  }
};

// Add balloons
export const addBalloons = (current: number, amount: number): number => {
  return current + amount;
};

// Add sandbags
export const addSandbags = (current: number, amount: number): number => {
  return current + amount;
};

// Remove balloons
export const removeBalloons = (current: number, amount: number): number => {
  return Math.max(0, current - amount);
};

// Remove sandbags
export const removeSandbags = (current: number, amount: number): number => {
  return Math.max(0, current - amount);
};

// Generate hint based on the current state
export const generateHint = (balloons: number, sandbags: number): string => {
  const total = calculateValue(balloons, sandbags);
  
  if (balloons > 0 && sandbags > 0) {
    return `You have ${balloons} balloons (positive) and ${sandbags} sandbags (negative). 
            The balloons pull up and the sandbags pull down. 
            ${balloons} - ${sandbags} = ${total}`;
  } else if (balloons > 0) {
    return `You have ${balloons} balloons (positive). 
            The balloons pull up, resulting in a value of ${total}.`;
  } else if (sandbags > 0) {
    return `You have ${sandbags} sandbags (negative). 
            The sandbags pull down, resulting in a value of ${total}.`;
  } else {
    return "Add balloons (positive) or sandbags (negative) to see how they affect the basket!";
  }
};

// Format value as an expression
export const formatExpression = (balloons: number, sandbags: number): string => {
  if (balloons > 0 && sandbags > 0) {
    return `${balloons} - ${sandbags} = ${calculateValue(balloons, sandbags)}`;
  } else if (balloons > 0) {
    return `${balloons}`;
  } else if (sandbags > 0) {
    return `-${sandbags}`;
  } else {
    return "0";
  }
};

// Determine the basket position based on the total value
export const getBasketPosition = (value: number, maxHeight: number, minHeight: number = 0): number => {
  // Clamp value between -10 and 10 for positioning
  const clampedValue = Math.max(-10, Math.min(10, value));
  
  // Map from [-10, 10] to [minHeight, maxHeight]
  const range = maxHeight - minHeight;
  const mappedValue = ((clampedValue + 10) / 20) * range + minHeight;
  
  return mappedValue;
};
