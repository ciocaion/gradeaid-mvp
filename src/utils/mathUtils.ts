
// This file contains utility functions for mathematical operations

export type OperationType = 'addition' | 'subtraction' | 'multiplication' | 'division';

// Calculate the final value based on operation
export const calculateValue = (balloons: number, sandbags: number, operation: OperationType = 'subtraction'): number => {
  switch (operation) {
    case 'addition':
      return balloons + sandbags;
    case 'multiplication':
      return balloons * sandbags;
    case 'division':
      return sandbags === 0 ? 0 : balloons / sandbags;
    case 'subtraction':
    default:
      return balloons - sandbags;
  }
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

// Generate hint based on the current state and operation
export const generateHint = (balloons: number, sandbags: number, operation: OperationType = 'subtraction'): string => {
  const total = calculateValue(balloons, sandbags, operation);
  
  switch (operation) {
    case 'addition':
      if (balloons > 0 && sandbags > 0) {
        return `You have ${balloons} balloons and ${sandbags} sandbags. 
                When adding them together: ${balloons} + ${sandbags} = ${total}`;
      } else if (balloons > 0) {
        return `You have ${balloons} balloons. The total is ${total}.`;
      } else if (sandbags > 0) {
        return `You have ${sandbags} sandbags. The total is ${total}.`;
      }
      break;
    
    case 'multiplication':
      if (balloons > 0 && sandbags > 0) {
        return `You have ${balloons} balloons and ${sandbags} sandbags. 
                When multiplying them: ${balloons} × ${sandbags} = ${total}`;
      } else if (balloons > 0) {
        return `You have ${balloons} balloons. With no sandbags to multiply, the result is 0.`;
      } else if (sandbags > 0) {
        return `You have ${sandbags} sandbags. With no balloons to multiply, the result is 0.`;
      }
      break;
      
    case 'division':
      if (balloons > 0 && sandbags > 0) {
        return `You have ${balloons} balloons and ${sandbags} sandbags. 
                When dividing them: ${balloons} ÷ ${sandbags} = ${total}`;
      } else if (balloons > 0) {
        return `You have ${balloons} balloons. Without sandbags, division isn't possible.`;
      } else if (sandbags > 0) {
        return `You have ${sandbags} sandbags. With no balloons, the result is 0.`;
      }
      break;
      
    case 'subtraction':
    default:
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
      }
  }
  
  return "Add balloons or sandbags to see how they interact!";
};

// Format value as an expression based on operation
export const formatExpression = (balloons: number, sandbags: number, operation: OperationType = 'subtraction'): string => {
  const total = calculateValue(balloons, sandbags, operation);
  
  if (balloons === 0 && sandbags === 0) {
    return "0";
  }
  
  switch (operation) {
    case 'addition':
      if (balloons > 0 && sandbags > 0) {
        return `${balloons} + ${sandbags} = ${total}`;
      } else if (balloons > 0) {
        return `${balloons}`;
      } else {
        return `${sandbags}`;
      }
    
    case 'multiplication':
      if (balloons > 0 && sandbags > 0) {
        return `${balloons} × ${sandbags} = ${total}`;
      } else {
        return "0";
      }
      
    case 'division':
      if (balloons > 0 && sandbags > 0) {
        return `${balloons} ÷ ${sandbags} = ${sandbags === 0 ? "undefined" : total}`;
      } else if (balloons > 0) {
        return `${balloons} ÷ 0 = undefined`;
      } else {
        return "0";
      }
      
    case 'subtraction':
    default:
      if (balloons > 0 && sandbags > 0) {
        return `${balloons} - ${sandbags} = ${total}`;
      } else if (balloons > 0) {
        return `${balloons}`;
      } else if (sandbags > 0) {
        return `-${sandbags}`;
      } else {
        return "0";
      }
  }
};

// Determine the basket position based on the total value
// This is changed to work with a wider range of values
export const getBasketPosition = (value: number, maxHeight: number, minHeight: number = 0): number => {
  // The max range we want to represent visually
  const visualRange = 15;
  
  // Clamp value between -visualRange and visualRange for positioning
  const clampedValue = Math.max(-visualRange, Math.min(visualRange, value));
  
  // Map from [-visualRange, visualRange] to [minHeight, maxHeight]
  const range = maxHeight - minHeight;
  const mappedValue = ((clampedValue + visualRange) / (2 * visualRange)) * range + minHeight;
  
  return mappedValue;
};
