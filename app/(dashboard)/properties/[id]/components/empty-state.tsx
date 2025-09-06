import { Badge } from 'components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from 'components/ui/card';

interface EmptyStateProps {
  title: string;
  description: string;
  badgeText: string;
  badgeVariant?: 'default' | 'secondary' | 'destructive' | 'outline';
}

function EmptyState({
  title,
  description,
  badgeText,
  badgeVariant = 'secondary'
}: EmptyStateProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          {title}
          <Badge variant={badgeVariant}>{badgeText}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}

export default EmptyState;
