import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuLink, navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Label } from "@/components/ui/label";
import RestaurantCard from '@/components/RestaurantCard'; // Custom Component
import { Filter, Search, ShoppingCart, User } from 'lucide-react';

// Placeholder Restaurant Data
const placeholderRestaurants = [
  { id: '1', name: 'The Gourmet Place', imageUrl: 'https://source.unsplash.com/random/400x300?food,gourmet', cuisineTypes: ['Italian', 'Pizzeria'], rating: 4.5, deliveryTime: '25-35 min' },
  { id: '2', name: 'Spice Route', imageUrl: 'https://source.unsplash.com/random/400x300?food,indian', cuisineTypes: ['Indian', 'Vegetarian'], rating: 4.2, deliveryTime: '30-40 min' },
  { id: '3', name: 'Burger Hub', imageUrl: 'https://source.unsplash.com/random/400x300?food,burger', cuisineTypes: ['American', 'Fast Food'], rating: 4.0, deliveryTime: '20-30 min' },
  { id: '4', name: 'Sushi Central', imageUrl: 'https://source.unsplash.com/random/400x300?food,sushi', cuisineTypes: ['Japanese', 'Sushi'], rating: 4.8, deliveryTime: '35-45 min' },
];

const HomePage = () => {
  const [loading, setLoading] = useState(true);
  const [restaurants, setRestaurants] = useState<typeof placeholderRestaurants>([]);
  const navigate = useNavigate();

  useEffect(() => {
    console.log('HomePage loaded');
    // Simulate API call
    setTimeout(() => {
      setRestaurants(placeholderRestaurants);
      setLoading(false);
    }, 1500);
  }, []);

  const handleRestaurantClick = (id: string | number) => {
    console.log(`Navigating to restaurant with id: ${id}`);
    navigate(`/restaurant-menu/${id}`); // Dynamic route would be better in a real app
  };

  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuLink href="/" className={navigationMenuTriggerStyle() + " font-bold text-lg"}>
                  FoodApp
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
          <div className="flex items-center gap-4">
             <Button variant="ghost" size="icon" onClick={() => navigate('/cart')}>
                <ShoppingCart className="h-5 w-5" />
             </Button>
             <Button variant="ghost" size="icon" onClick={() => navigate('/order-tracking')}> {/* Assuming user profile or orders */}
                <User className="h-5 w-5" />
             </Button>
          </div>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8">
        <section className="mb-8">
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="relative flex-grow w-full sm:w-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input type="search" placeholder="Search restaurants or cuisines..." className="pl-10 w-full" />
            </div>
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" /> Filter
            </Button>
          </div>
        </section>

        <section>
          <Label htmlFor="restaurant-list" className="text-2xl font-semibold mb-6 block">Popular Restaurants</Label>
          <ScrollArea className="h-[calc(100vh-250px)]" id="restaurant-list"> {/* Adjust height as needed */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-1">
              {loading ? (
                Array.from({ length: 8 }).map((_, index) => (
                  <div key={index} className="space-y-3">
                    <Skeleton className="h-[180px] w-full rounded-xl" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                    </div>
                  </div>
                ))
              ) : (
                restaurants.map(resto => (
                  <RestaurantCard
                    key={resto.id}
                    {...resto}
                    onClick={() => handleRestaurantClick(resto.id)}
                  />
                ))
              )}
            </div>
          </ScrollArea>
        </section>
      </main>

      <footer className="py-6 text-center text-sm text-muted-foreground border-t">
        © {new Date().getFullYear()} FoodApp, Inc. All rights reserved.
      </footer>
    </div>
  );
};

export default HomePage;