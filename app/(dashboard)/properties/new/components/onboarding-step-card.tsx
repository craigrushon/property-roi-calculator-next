'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader
} from '@/components/ui/card';

interface OnboardingStepCardProps {
  title: string;
  description: string;
  children: React.ReactNode;
  primaryAction: {
    label: string;
    onClick: () => void;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
}

function OnboardingStepCard({
  title,
  description,
  children,
  primaryAction,
  secondaryAction
}: OnboardingStepCardProps) {
  return (
    <Card>
      <CardHeader>
        <h2 className="text-xl font-bold text-center">{title}</h2>
        <p className="text-l text-center">{description}</p>
      </CardHeader>
      <CardContent>{children}</CardContent>
      <CardFooter className="justify-between border-t border-t-gray-200 pt-6">
        {secondaryAction && (
          <Button
            type="button"
            onClick={secondaryAction.onClick}
            size="sm"
            variant="outline"
            aria-label={secondaryAction.label}
          >
            {secondaryAction.label}
          </Button>
        )}
        <Button
          type="button" // Prevents accidental form submission
          onClick={primaryAction.onClick}
          size="sm"
          aria-label={primaryAction.label}
        >
          {primaryAction.label}
        </Button>
      </CardFooter>
    </Card>
  );
}

export default OnboardingStepCard;
