import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { PlusCircle } from 'lucide-react'; // Icon for Add button

interface MenuItemCardProps {
  id: string | number;
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  onAddToCart: (item: { id: string | number; name: string; price: number }) => void;
  // For cart display, you might add quantity and onQuantityChange props
  // For now, this is a menu display card
}

const MenuItemCard: React.FC<MenuItemCardProps> = ({
  id,
  name,
  description,
  price,
  imageUrl,
  onAddToCart,
}) => {
  console.log("Rendering MenuItemCard:", name);

  const handleAddToCart = () => {
    console.log("Adding to cart:", name, id, price);
    onAddToCart({ id, name, price });
    // Toast notification would be handled by the page/context calling this.
  };

  return (
    <Card className="w-full flex flex-col sm:flex-row overflow-hidden">
      {imageUrl && (
        <div className="sm:w-1/3">
          <AspectRatio ratio={1} className="sm:h-full">
            <img
              src={imageUrl || '/placeholder.svg'}
              alt={name}
              className="object-cover w-full h-full"
              onError={(e) => (e.currentTarget.src = '/placeholder.svg')}
            />
          </AspectRatio>
        </div>
      )}
      <div className={`flex flex-col justify-between ${imageUrl ? 'sm:w-2/3' : 'w-full'}`}>
        <CardHeader className="pb-2">
          <CardTitle className="text-md font-semibold">{name}</CardTitle>
          {description && (
            <CardDescription className="text-xs text-gray-600 line-clamp-2 mt-1">
              {description}
            </CardDescription>
          )}
        </CardHeader>
        <CardFooter className="flex justify-between items-center pt-2">
          <span className="text-lg font-bold text-green-700">${price.toFixed(2)}</span>
          <Button size="sm" onClick={handleAddToCart}>
            <PlusCircle className="mr-2 h-4 w-4" /> Add
          </Button>
        </CardFooter>
      </div>
    </Card>
  );
};

export default MenuItemCard;