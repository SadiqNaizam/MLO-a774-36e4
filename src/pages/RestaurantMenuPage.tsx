import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuLink, navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import MenuItemCard from '@/components/MenuItemCard'; // Custom Component
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowLeft, ShoppingCart, Star, Clock } from 'lucide-react';
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "@/components/ui/use-toast";


// Placeholder data
const restaurantDetails = {
  id: '1',
  name: 'The Gourmet Place',
  description: 'Serving the best Italian dishes in town with fresh ingredients and love.',
  imageUrl: 'https://source.unsplash.com/random/800x400?restaurant,interior',
  logoUrl: 'https://source.unsplash.com/random/100x100?logo,food',
  cuisineTypes: ['Italian', 'Pizzeria', 'Pasta'],
  rating: 4.5,
  deliveryTime: '25-35 min',
  operatingHours: '11:00 AM - 10:00 PM',
  menu: {
    appetizers: [
      { id: 'm1', name: 'Bruschetta', description: 'Grilled bread rubbed with garlic and topped with olive oil and salt.', price: 8.99, imageUrl: 'https://source.unsplash.com/random/300x200?bruschetta' },
      { id: 'm2', name: 'Caprese Salad', description: 'Fresh mozzarella, tomatoes, and sweet basil.', price: 10.50, imageUrl: 'https://source.unsplash.com/random/300x200?caprese,salad' },
    ],
    mainCourses: [
      { id: 'm3', name: 'Margherita Pizza', description: 'Classic delight with 100% real mozzarella cheese.', price: 15.00, imageUrl: 'https://source.unsplash.com/random/300x200?margherita,pizza' },
      { id: 'm4', name: 'Pasta Carbonara', description: 'Spaghetti with eggs, cheese, pancetta, and black pepper.', price: 16.75, imageUrl: 'https://source.unsplash.com/random/300x200?pasta,carbonara' },
    ],
    desserts: [
        { id: 'm5', name: 'Tiramisu', description: 'Coffee-flavoured Italian dessert.', price: 7.50, imageUrl: 'https://source.unsplash.com/random/300x200?tiramisu' },
    ]
  }
};

interface MenuItem {
  id: string | number;
  name: string;
  price: number;
  // potentially other fields for customization
}

const RestaurantMenuPage = () => {
  const { restaurantId } = useParams<{ restaurantId: string }>(); // In a real app, fetch details based on this ID
  const navigate = useNavigate();
  const [isCustomizationDialogOpen, setIsCustomizationDialogOpen] = useState(false);
  const [selectedItemForCustomization, setSelectedItemForCustomization] = useState<MenuItem | null>(null);

  useEffect(() => {
    console.log('RestaurantMenuPage loaded for restaurant ID:', restaurantId);
    // Fetch actual restaurant data using restaurantId here
  }, [restaurantId]);

  const handleAddToCart = (item: MenuItem) => {
    console.log('Adding item to cart (from page):', item);
    // For items with customization, this might trigger the dialog first
    // For simplicity, we'll assume some items might need customization
    if (item.id === 'm3') { // Example: Margherita Pizza has customization
        setSelectedItemForCustomization(item);
        setIsCustomizationDialogOpen(true);
    } else {
        // Add directly to cart (logic would be here or in a context)
        toast({ title: "Added to cart!", description: `${item.name} has been added to your cart.` });
    }
  };
  
  const handleConfirmCustomization = () => {
    if(selectedItemForCustomization){
        // Add customized item to cart (logic would be here)
        console.log("Confirmed customization for:", selectedItemForCustomization.name);
        toast({ title: "Added to cart!", description: `${selectedItemForCustomization.name} (customized) has been added.` });
    }
    setIsCustomizationDialogOpen(false);
    setSelectedItemForCustomization(null);
  };


  return (
    <div className="flex flex-col min-h-screen">
       <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuLink href="/" className={navigationMenuTriggerStyle() + " font-bold text-lg"}>
                  FoodApp
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
          <Button variant="ghost" size="icon" onClick={() => navigate('/cart')}>
            <ShoppingCart className="h-5 w-5" />
          </Button>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8">
        {/* Restaurant Header */}
        <section className="mb-8 p-4 md:p-6 rounded-lg shadow-md bg-card">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6">
            <Avatar className="h-24 w-24 md:h-32 md:w-32 border-2 border-primary">
              <AvatarImage src={restaurantDetails.logoUrl} alt={restaurantDetails.name} />
              <AvatarFallback>{restaurantDetails.name.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-bold">{restaurantDetails.name}</h1>
              <p className="text-muted-foreground mt-1">{restaurantDetails.description}</p>
              <div className="flex flex-wrap gap-2 mt-3">
                {restaurantDetails.cuisineTypes.map(cuisine => (
                  <Badge key={cuisine} variant="secondary">{cuisine}</Badge>
                ))}
              </div>
              <div className="flex items-center gap-4 mt-3 text-sm">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-yellow-500 fill-current" />
                  <span>{restaurantDetails.rating.toFixed(1)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>{restaurantDetails.deliveryTime}</span>
                </div>
              </div>
               <p className="text-sm text-muted-foreground mt-1">Hours: {restaurantDetails.operatingHours}</p>
            </div>
          </div>
           {restaurantDetails.imageUrl && (
            <img src={restaurantDetails.imageUrl} alt={`${restaurantDetails.name} interior`} className="mt-4 rounded-lg object-cover w-full h-48 md:h-64" />
           )}
        </section>

        {/* Menu Section */}
        <section>
          <h2 className="text-2xl font-semibold mb-6">Menu</h2>
          <ScrollArea className="h-[calc(100vh-450px)]" > {/* Adjust height as needed */}
            <Accordion type="multiple" defaultValue={Object.keys(restaurantDetails.menu)} className="w-full">
              {Object.entries(restaurantDetails.menu).map(([category, items]) => (
                <AccordionItem key={category} value={category}>
                  <AccordionTrigger className="text-xl font-medium capitalize">{category}</AccordionTrigger>
                  <AccordionContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-1">
                      {items.map(item => (
                        <MenuItemCard
                          key={item.id}
                          {...item}
                          onAddToCart={() => handleAddToCart(item)}
                        />
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </ScrollArea>
        </section>
      </main>
      
      {/* Item Customization Dialog */}
       <Dialog open={isCustomizationDialogOpen} onOpenChange={setIsCustomizationDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Customize {selectedItemForCustomization?.name}</DialogTitle>
            <DialogDescription>
              Make changes to your item before adding to cart.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            {/* Example Customization: Size */}
            <div>
                <Label className="text-sm font-medium">Size</Label>
                <RadioGroup defaultValue="regular" className="mt-2">
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="regular" id="size-regular" />
                        <Label htmlFor="size-regular">Regular</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="large" id="size-large" />
                        <Label htmlFor="size-large">Large (+$2.00)</Label>
                    </div>
                </RadioGroup>
            </div>
            {/* Example Customization: Toppings */}
            <div>
                <Label className="text-sm font-medium">Extra Toppings</Label>
                <div className="mt-2 space-y-2">
                    <div className="flex items-center space-x-2">
                        <Checkbox id="topping-cheese" />
                        <Label htmlFor="topping-cheese">Extra Cheese (+$1.00)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Checkbox id="topping-olives" />
                        <Label htmlFor="topping-olives">Olives (+$0.50)</Label>
                    </div>
                </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCustomizationDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleConfirmCustomization}>Add to Cart</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <footer className="py-6 text-center text-sm text-muted-foreground border-t">
        © {new Date().getFullYear()} FoodApp, Inc. All rights reserved.
      </footer>
    </div>
  );
};

export default RestaurantMenuPage;