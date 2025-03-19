
import React from 'react';
import { motion } from 'framer-motion';
import { Lightbulb } from 'lucide-react';

interface GuidanceProps {
  message: string;
}

const Guidance: React.FC<GuidanceProps> = ({ message }) => {
  return (
    <motion.div
      className="glass rounded-xl p-4 relative overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
    >
      <div className="flex items-start space-x-3">
        <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center flex-shrink-0">
          <Lightbulb className="h-5 w-5 text-yellow-600" />
        </div>
        <div>
          <h3 className="text-lg font-medium mb-2">Guidance</h3>
          <p className="text-gray-700 leading-relaxed">
            {message}
          </p>
        </div>
      </div>
      
      {/* Decorative element */}
      <div className="absolute -bottom-8 -right-8 w-24 h-24 bg-yellow-100/30 rounded-full blur-xl" />
    </motion.div>
  );
};

export default Guidance;
