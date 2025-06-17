import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Star, Clock } from 'lucide-react'; // Example icons

interface RestaurantCardProps {
  id: string | number;
  name: string;
  imageUrl: string;
  cuisineTypes: string[];
  rating?: number; // Optional
  deliveryTime?: string; // e.g., "25-35 min"
  onClick?: (id: string | number) => void;
}

const RestaurantCard: React.FC<RestaurantCardProps> = ({
  id,
  name,
  imageUrl,
  cuisineTypes,
  rating,
  deliveryTime,
  onClick,
}) => {
  console.log("Rendering RestaurantCard:", name);

  const handleCardClick = () => {
    if (onClick) {
      onClick(id);
    }
    console.log("RestaurantCard clicked:", name, id);
  };

  return (
    <Card
      className="w-full overflow-hidden transition-shadow duration-300 hover:shadow-lg cursor-pointer"
      onClick={handleCardClick}
    >
      <CardHeader className="p-0">
        <AspectRatio ratio={16 / 9}>
          <img
            src={imageUrl || '/placeholder.svg'}
            alt={name}
            className="object-cover w-full h-full"
            onError={(e) => (e.currentTarget.src = '/placeholder.svg')}
          />
        </AspectRatio>
      </CardHeader>
      <CardContent className="p-4 space-y-2">
        <CardTitle className="text-lg font-semibold truncate">{name}</CardTitle>
        <div className="flex flex-wrap gap-1">
          {cuisineTypes.slice(0, 3).map((cuisine) => (
            <Badge key={cuisine} variant="secondary" className="text-xs">
              {cuisine}
            </Badge>
          ))}
        </div>
      </CardContent>
      {(rating || deliveryTime) && (
        <CardFooter className="p-4 pt-0 flex justify-between items-center text-sm text-gray-600">
          {rating && (
            <div className="flex items-center">
              <Star className="h-4 w-4 text-yellow-500 mr-1" fill="currentColor" />
              <span>{rating.toFixed(1)}</span>
            </div>
          )}
          {deliveryTime && (
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              <span>{deliveryTime}</span>
            </div>
          )}
        </CardFooter>
      )}
    </Card>
  );
};

export default RestaurantCard;