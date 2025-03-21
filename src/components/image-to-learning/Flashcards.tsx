import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, RefreshCw } from 'lucide-react';

export interface Flashcard {
  term: string;
  definition: string;
}

interface FlashcardsProps {
  cards: Flashcard[];
  title?: string;
}

const Flashcards: React.FC<FlashcardsProps> = ({ cards, title = 'Flashcards' }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [direction, setDirection] = useState<'left' | 'right'>('right');
  
  const currentCard = cards[currentIndex];
  
  const flipCard = () => {
    setFlipped(!flipped);
  };
  
  const nextCard = () => {
    if (currentIndex < cards.length - 1) {
      setDirection('right');
      setFlipped(false);
      setTimeout(() => {
        setCurrentIndex(currentIndex + 1);
      }, 200);
    }
  };
  
  const prevCard = () => {
    if (currentIndex > 0) {
      setDirection('left');
      setFlipped(false);
      setTimeout(() => {
        setCurrentIndex(currentIndex - 1);
      }, 200);
    }
  };
  
  const cardVariants = {
    initial: (direction: 'left' | 'right') => ({
      x: direction === 'right' ? 100 : -100,
      opacity: 0,
    }),
    animate: {
      x: 0,
      opacity: 1,
      transition: {
        x: { type: 'spring', stiffness: 300, damping: 30 },
        opacity: { duration: 0.2 },
      },
    },
    exit: (direction: 'left' | 'right') => ({
      x: direction === 'right' ? -100 : 100,
      opacity: 0,
      transition: {
        x: { type: 'spring', stiffness: 300, damping: 30 },
        opacity: { duration: 0.2 },
      },
    }),
  };
  
  const flipVariants = {
    front: {
      rotateY: 0,
      transition: {
        duration: 0.5,
      },
    },
    back: {
      rotateY: 180,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold">{title}</h3>
          <div className="text-sm text-gray-500">
            {currentIndex + 1} of {cards.length}
          </div>
        </div>
        
        <div className="relative h-[260px] perspective">
          <AnimatePresence custom={direction} initial={false}>
            <motion.div
              key={currentIndex}
              custom={direction}
              variants={cardVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="absolute w-full h-full"
            >
              <motion.div
                className="relative w-full h-full cursor-pointer perspective"
                onClick={flipCard}
                animate={flipped ? 'back' : 'front'}
                variants={flipVariants}
                style={{ transformStyle: 'preserve-3d' }}
              >
                {/* Front side */}
                <div
                  className="absolute w-full h-full bg-white border rounded-lg p-6 flex items-center justify-center backface-hidden shadow-md"
                  style={{ backfaceVisibility: 'hidden' }}
                >
                  <div className="text-center">
                    <h4 className="text-lg font-medium mb-2">Term</h4>
                    <p className="text-2xl">{currentCard.term}</p>
                    <p className="text-sm text-gray-500 mt-4">
                      Tap to see the definition
                    </p>
                  </div>
                </div>
                
                {/* Back side */}
                <div
                  className="absolute w-full h-full bg-white border rounded-lg p-6 flex items-center justify-center backface-hidden shadow-md"
                  style={{
                    backfaceVisibility: 'hidden',
                    transform: 'rotateY(180deg)',
                  }}
                >
                  <div className="text-center">
                    <h4 className="text-lg font-medium mb-2">Definition</h4>
                    <p>{currentCard.definition}</p>
                    <p className="text-sm text-gray-500 mt-4">
                      Tap to see the term
                    </p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          size="icon"
          onClick={prevCard}
          disabled={currentIndex === 0}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        <Button variant="outline" size="icon" onClick={flipCard}>
          <RefreshCw className="h-4 w-4" />
        </Button>
        
        <Button
          variant="outline"
          size="icon"
          onClick={nextCard}
          disabled={currentIndex === cards.length - 1}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default Flashcards; 