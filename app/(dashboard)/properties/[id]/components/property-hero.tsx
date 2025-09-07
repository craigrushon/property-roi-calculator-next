import { Card, CardContent } from 'components/ui/card';
import { Badge } from 'components/ui/badge';
import { Button } from 'components/ui/button';
import { formatCurrency } from 'lib/utils';
import { Property } from 'models/types';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Percent,
  Calendar,
  Edit,
  Bed,
  Bath,
  Square
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface PropertyHeroProps {
  property: Property;
}

function PropertyHero({ property }: PropertyHeroProps) {
  const { returnOnInvestment, cashflow, price, address, imageUrl, id } =
    property;

  // Calculate additional metrics
  const monthlyCashflow = cashflow / 12;
  const monthlyROI = returnOnInvestment / 12;

  // Determine if cashflow is positive or negative
  const isPositiveCashflow = cashflow > 0;
  const isPositiveROI = returnOnInvestment > 0;

  // Get appropriate colors and icons
  const cashflowColor = isPositiveCashflow ? 'text-green-600' : 'text-red-600';
  const cashflowBgColor = isPositiveCashflow ? 'bg-green-50' : 'bg-red-50';
  const cashflowIcon = isPositiveCashflow ? TrendingUp : TrendingDown;
  const CashflowIcon = cashflowIcon;

  const roiColor = isPositiveROI ? 'text-green-600' : 'text-red-600';
  const roiBgColor = isPositiveROI ? 'bg-green-50' : 'bg-red-50';
  const roiIcon = isPositiveROI ? TrendingUp : TrendingDown;
  const ROIIcon = roiIcon;

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-6">
          {/* Top: Property Image and Basic Info */}
          <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-6">
            {/* Left: Property Image */}
            <div className="relative">
              {imageUrl ? (
                <Image
                  src={imageUrl}
                  alt={address}
                  width={400}
                  height={400}
                  className="w-full aspect-square object-cover rounded-lg shadow-md"
                />
              ) : (
                <div className="w-full aspect-square bg-gray-200 rounded-lg flex items-center justify-center">
                  <span className="text-gray-500">No image available</span>
                </div>
              )}
            </div>

            {/* Right: Property Details and Investment Metrics */}
            <div className="space-y-6">
              {/* Property Details */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="text-3xl font-bold text-green-600">
                    {formatCurrency(price).replace('.00', '')}
                  </div>
                  <Link href={`/properties/${id}/edit`}>
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
                <div className="flex gap-4 text-md text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Bed className="h-4 w-4" />
                    <span>3 beds</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Bath className="h-4 w-4" />
                    <span>2 baths</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Square className="h-4 w-4" />
                    <span>1,200 sqft</span>
                  </div>
                </div>
              </div>

              {/* Investment Metrics */}
              <div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Annual Cashflow */}
                  <div className={`${cashflowBgColor} p-4 rounded-lg`}>
                    <div className="flex items-center gap-2 mb-2">
                      <CashflowIcon className={`h-4 w-4 ${cashflowColor}`} />
                      <div className="text-sm font-medium text-gray-600">
                        Annual Cashflow
                      </div>
                    </div>
                    <div className={`text-2xl font-bold ${cashflowColor}`}>
                      {formatCurrency(cashflow)}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {isPositiveCashflow ? 'Positive' : 'Negative'} cashflow
                    </div>
                  </div>

                  {/* Monthly Cashflow */}
                  <div className={`${cashflowBgColor} p-4 rounded-lg`}>
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className={`h-4 w-4 ${cashflowColor}`} />
                      <div className="text-sm font-medium text-gray-600">
                        Monthly Cashflow
                      </div>
                    </div>
                    <div className={`text-2xl font-bold ${cashflowColor}`}>
                      {formatCurrency(monthlyCashflow)}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">Per month</div>
                  </div>

                  {/* Annual ROI */}
                  <div className={`${roiBgColor} p-4 rounded-lg`}>
                    <div className="flex items-center gap-2 mb-2">
                      <ROIIcon className={`h-4 w-4 ${roiColor}`} />
                      <div className="text-sm font-medium text-gray-600">
                        Annual ROI
                      </div>
                    </div>
                    <div className={`text-2xl font-bold ${roiColor}`}>
                      {returnOnInvestment.toFixed(2)}%
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      Return on investment
                    </div>
                  </div>

                  {/* Monthly ROI */}
                  <div className={`${roiBgColor} p-4 rounded-lg`}>
                    <div className="flex items-center gap-2 mb-2">
                      <Percent className={`h-4 w-4 ${roiColor}`} />
                      <div className="text-sm font-medium text-gray-600">
                        Monthly ROI
                      </div>
                    </div>
                    <div className={`text-2xl font-bold ${roiColor}`}>
                      {monthlyROI.toFixed(2)}%
                    </div>
                    <div className="text-xs text-gray-500 mt-1">Per month</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default PropertyHero;
