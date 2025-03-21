import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ExplanationProps {
  explanation: string;
  title?: string;
}

const Explanation: React.FC<ExplanationProps> = ({ 
  explanation, 
  title = 'Explanation'
}) => {
  // Split the explanation into paragraphs for better rendering
  const paragraphs = explanation.split('\n\n').filter(Boolean);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="prose max-w-none">
        {paragraphs.map((paragraph, index) => (
          <p key={index} className="mb-4 last:mb-0">
            {paragraph}
          </p>
        ))}
      </CardContent>
    </Card>
  );
};

export default Explanation; 