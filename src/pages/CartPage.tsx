import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuLink, navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import MenuItemCard from '@/components/MenuItemCard'; // Custom component
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Trash2, PlusCircle, MinusCircle } from 'lucide-react';
import { toast } from "@/components/ui/use-toast";

// Placeholder Cart Item Data Type
interface CartItem extends Omit<React.ComponentProps<typeof MenuItemCard>, 'onAddToCart'> {
  quantity: number;
}

const initialCartItems: CartItem[] = [
  { id: 'm3', name: 'Margherita Pizza', description: 'Classic delight with 100% real mozzarella cheese.', price: 15.00, imageUrl: 'https://source.unsplash.com/random/300x200?margherita,pizza', quantity: 1 },
  { id: 'm1', name: 'Bruschetta', description: 'Grilled bread rubbed with garlic and topped with olive oil and salt.', price: 8.99, imageUrl: 'https://source.unsplash.com/random/300x200?bruschetta', quantity: 2 },
];

const CartPage = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>(initialCartItems);
  const [promoCode, setPromoCode] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    console.log('CartPage loaded');
  }, []);

  const handleQuantityChange = (itemId: string | number, newQuantity: number) => {
    if (newQuantity < 1) {
      // Optionally remove item if quantity is less than 1, or just cap at 1
      setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));
      toast({ title: "Item removed", description: "Item quantity reduced to zero and removed from cart."});
      return;
    }
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const handleRemoveItem = (itemId: string | number) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));
    toast({ title: "Item removed", description: "Successfully removed item from cart."});
  };
  
  const handleApplyPromo = () => {
    if(promoCode.toUpperCase() === "SAVE10"){
        toast({ title: "Promo Applied!", description: "10% discount has been applied to your order."});
        // Actual discount logic would be here
    } else {
        toast({ title: "Invalid Promo", description: "The promo code entered is not valid.", variant: "destructive"});
    }
  };

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const deliveryFee = cartItems.length > 0 ? 5.00 : 0; // Example fee
  const taxes = subtotal * 0.08; // Example tax rate
  const total = subtotal + deliveryFee + taxes;

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
          <div className="w-10"></div> {/* Placeholder for symmetry if no right-side icon */}
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-center md:text-left">Your Cart</h1>
        
        {cartItems.length === 0 ? (
            <div className="text-center py-10">
                <ShoppingCart className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
                <p className="text-xl text-muted-foreground">Your cart is empty.</p>
                <Button onClick={() => navigate('/')} className="mt-6">Start Shopping</Button>
            </div>
        ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Cart Items List */}
                <section className="lg:col-span-2">
                    <ScrollArea className="h-[calc(100vh-350px)] pr-4"> {/* Adjust height */}
                        <div className="space-y-6">
                        {cartItems.map(item => (
                            <Card key={item.id} className="flex flex-col sm:flex-row items-center p-4 gap-4">
                                <div className="w-full sm:w-1/3 md:w-1/4">
                                    {/* Using MenuItemCard for display, but it has its own Add button.
                                        Here we'll simplify and show image and details, then quantity. */}
                                    <img src={item.imageUrl || 'https://source.unsplash.com/random/100x100?food'} alt={item.name} className="w-full h-auto object-cover rounded-md aspect-square" />
                                </div>
                                <div className="flex-grow">
                                    <h3 className="text-lg font-semibold">{item.name}</h3>
                                    <p className="text-sm text-muted-foreground">{item.description}</p>
                                    <p className="text-md font-bold mt-1">${item.price.toFixed(2)}</p>
                                </div>
                                <div className="flex items-center gap-2 mt-2 sm:mt-0">
                                    <Button variant="outline" size="icon" onClick={() => handleQuantityChange(item.id, item.quantity - 1)}>
                                        <MinusCircle className="h-4 w-4" />
                                    </Button>
                                    <Input
                                        type="number"
                                        value={item.quantity}
                                        onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value))}
                                        className="w-16 text-center h-9"
                                        min="1"
                                    />
                                    <Button variant="outline" size="icon" onClick={() => handleQuantityChange(item.id, item.quantity + 1)}>
                                        <PlusCircle className="h-4 w-4" />
                                    </Button>
                                </div>
                                <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700" onClick={() => handleRemoveItem(item.id)}>
                                    <Trash2 className="h-5 w-5" />
                                </Button>
                            </Card>
                        ))}
                        </div>
                    </ScrollArea>
                </section>

                {/* Order Summary */}
                <section className="lg:col-span-1">
                    <Card>
                        <CardHeader>
                        <CardTitle>Order Summary</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                        <div className="flex justify-between">
                            <span>Subtotal</span>
                            <span>${subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Delivery Fee</span>
                            <span>${deliveryFee.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Taxes (8%)</span>
                            <span>${taxes.toFixed(2)}</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between text-lg font-bold">
                            <span>Total</span>
                            <span>${total.toFixed(2)}</span>
                        </div>
                        <div className="flex gap-2 pt-2">
                            <Input 
                                type="text" 
                                placeholder="Promo Code" 
                                value={promoCode}
                                onChange={(e) => setPromoCode(e.target.value)}
                            />
                            <Button variant="outline" onClick={handleApplyPromo}>Apply</Button>
                        </div>
                        </CardContent>
                        <CardFooter>
                        <Button className="w-full" size="lg" onClick={() => navigate('/checkout')}>
                            Proceed to Checkout
                        </Button>
                        </CardFooter>
                    </Card>
                </section>
            </div>
        )}
      </main>

      <footer className="py-6 text-center text-sm text-muted-foreground border-t">
        © {new Date().getFullYear()} FoodApp, Inc. All rights reserved.
      </footer>
    </div>
  );
};

export default CartPage;