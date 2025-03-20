
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Plus, Minus } from 'lucide-react';
import { OperationType, formatExpression } from '@/utils/mathUtils';

interface ControlsProps {
  onAddBalloon: () => void;
  onRemoveBalloon: () => void;
  onAddSandbag: () => void;
  onRemoveSandbag: () => void;
  balloons: number;
  sandbags: number;
  operation: OperationType;
}

const Controls: React.FC<ControlsProps> = ({
  onAddBalloon,
  onRemoveBalloon,
  onAddSandbag,
  onRemoveSandbag,
  balloons,
  sandbags,
  operation
}) => {
  // Get operation symbol for display
  const getOperationSymbol = (op: OperationType): string => {
    switch (op) {
      case 'addition': return '+';
      case 'subtraction': return '-';
      case 'multiplication': return '×';
      case 'division': return '÷';
      default: return '';
    }
  };

  // Get item labels based on operation
  const getItemLabels = (): { balloonLabel: string, sandbagLabel: string } => {
    switch (operation) {
      case 'addition':
        return { balloonLabel: 'First Number', sandbagLabel: 'Second Number' };
      case 'multiplication':
        return { balloonLabel: 'First Factor', sandbagLabel: 'Second Factor' };
      case 'division':
        return { balloonLabel: 'Dividend', sandbagLabel: 'Divisor' };
      case 'subtraction':
      default:
        return { balloonLabel: 'Balloons (Positive)', sandbagLabel: 'Sandbags (Negative)' };
    }
  };

  const { balloonLabel, sandbagLabel } = getItemLabels();

  return (
    <div className="flex flex-col space-y-6">
      <motion.div 
        className="glass rounded-xl p-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h3 className="text-lg font-medium mb-3">{balloonLabel}</h3>
        <div className="flex items-center space-x-3">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={onAddBalloon}
            className="bg-white/80 backdrop-blur-sm hover:bg-balloon/10 transition-all duration-300"
          >
            <Plus className="h-4 w-4" />
          </Button>
          <div className="text-2xl font-semibold text-center w-8">{balloons}</div>
          <Button 
            variant="outline" 
            size="icon" 
            onClick={onRemoveBalloon} 
            disabled={balloons <= 0}
            className="bg-white/80 backdrop-blur-sm hover:bg-balloon/10 transition-all duration-300"
          >
            <Minus className="h-4 w-4" />
          </Button>
        </div>
      </motion.div>
      
      <motion.div 
        className="glass rounded-xl p-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h3 className="text-lg font-medium mb-3">{sandbagLabel}</h3>
        <div className="flex items-center space-x-3">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={onAddSandbag}
            className="bg-white/80 backdrop-blur-sm hover:bg-sandbag/10 transition-all duration-300"
          >
            <Plus className="h-4 w-4" />
          </Button>
          <div className="text-2xl font-semibold text-center w-8">{sandbags}</div>
          <Button 
            variant="outline" 
            size="icon" 
            onClick={onRemoveSandbag} 
            disabled={sandbags <= 0}
            className="bg-white/80 backdrop-blur-sm hover:bg-sandbag/10 transition-all duration-300"
          >
            <Minus className="h-4 w-4" />
          </Button>
        </div>
      </motion.div>
      
      <motion.div
        className="glass rounded-xl p-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h3 className="text-lg font-medium mb-2">My Expression</h3>
        <div className="text-3xl font-bold text-center py-2">
          {formatExpression(balloons, sandbags, operation)}
        </div>
      </motion.div>
    </div>
  );
};

export default Controls;
