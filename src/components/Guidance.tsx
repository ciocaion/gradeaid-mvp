import React from 'react';
import { motion } from 'framer-motion';
import { LightbulbIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface GuidanceProps {
  message: string;
}

const Guidance: React.FC<GuidanceProps> = ({ message }) => {
  const { t } = useTranslation();
  
  return (
    <motion.div
      className="glass rounded-xl p-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
    >
      <div className="flex items-center mb-2">
        <LightbulbIcon className="h-5 w-5 mr-2 text-yellow-500" />
        <h3 className="text-lg font-medium">{t('balloonGame.guidance.title')}</h3>
      </div>
      <p className="text-sm leading-relaxed">
        {message.replace(/\./g, '! 🎯').replace(/integer/g, 'number').replace(/equation/g, 'math problem')}
      </p>
    </motion.div>
  );
};

export default Guidance;
