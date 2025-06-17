import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuLink, navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import OrderStatusTracker from '@/components/OrderStatusTracker'; // Custom component
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ArrowLeft, RefreshCcw, Star, ShoppingBag } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

// Placeholder Data
type OrderStatus = 'PLACED' | 'PREPARING' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'CANCELLED' | 'FAILED';

interface PastOrder {
  id: string;
  date: string;
  restaurantName: string;
  totalAmount: number;
  status: OrderStatus;
  items: { name: string; quantity: number; price: number }[];
}

const currentOrderData = {
  id: 'ORD12345XYZ',
  restaurantName: 'The Gourmet Place',
  estimatedDelivery: '3:45 PM',
  currentStatus: 'PREPARING' as OrderStatus,
  items: [
    { name: 'Margherita Pizza', quantity: 1, price: 15.00 },
    { name: 'Bruschetta', quantity: 2, price: 8.99 },
  ],
  totalAmount: 32.98,
};

const pastOrdersData: PastOrder[] = [
  { id: 'ORD001', date: '2023-10-25', restaurantName: 'Spice Route', totalAmount: 45.50, status: 'DELIVERED', items: [{ name: 'Chicken Biryani', quantity: 2, price: 18.00 }, { name: 'Garlic Naan', quantity: 3, price: 3.50}] },
  { id: 'ORD002', date: '2023-10-20', restaurantName: 'Burger Hub', totalAmount: 22.00, status: 'CANCELLED', items: [{ name: 'Classic Burger', quantity: 1, price: 12.00 }, { name: 'Fries', quantity: 1, price: 5.00}] },
];

const OrderTrackingPage = () => {
  const [currentOrder, setCurrentOrder] = useState(currentOrderData); // Can be null if no active order
  const [pastOrders, setPastOrders] = useState(pastOrdersData);
  const navigate = useNavigate();

  useEffect(() => {
    console.log('OrderTrackingPage loaded');
    // Fetch real order data here
  }, []);
  
  const handleReorder = (orderId: string) => {
    console.log(`Reordering order: ${orderId}`);
    // Add items from pastOrder to cart and navigate to cart
    navigate('/cart'); 
  };

  const handleRateOrder = (orderId: string) => {
    console.log(`Rating order: ${orderId}`);
    // Navigate to a rating page or open a rating dialog
  };


  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
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
          <div className="w-10"></div>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8 space-y-12">
        {/* Current Order Section */}
        {currentOrder ? (
          <section>
            <h1 className="text-3xl font-bold mb-6">Track Your Order</h1>
            <Card>
              <CardHeader>
                <CardTitle>Order #{currentOrder.id} from {currentOrder.restaurantName}</CardTitle>
                <CardDescription>Estimated Delivery: {currentOrder.estimatedDelivery}</CardDescription>
              </CardHeader>
              <CardContent>
                <OrderStatusTracker currentStatus={currentOrder.currentStatus} />
                <div className="mt-6">
                    <h4 className="font-semibold mb-2">Items:</h4>
                    <ul className="list-disc list-inside text-sm text-muted-foreground">
                        {currentOrder.items.map(item => (
                            <li key={item.name}>{item.name} (x{item.quantity}) - ${(item.price * item.quantity).toFixed(2)}</li>
                        ))}
                    </ul>
                    <p className="font-bold mt-2 text-right">Total: ${currentOrder.totalAmount.toFixed(2)}</p>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end gap-2">
                {/* <Button variant="outline">Contact Support</Button> */}
                {/* Conditional buttons based on status */}
              </CardFooter>
            </Card>
          </section>
        ) : (
            <div className="text-center py-10">
                <ShoppingBag className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
                <h1 className="text-2xl font-bold mb-2">No Active Orders</h1>
                <p className="text-muted-foreground">You don't have any orders currently in progress.</p>
                <Button onClick={() => navigate('/')} className="mt-6">Start Shopping</Button>
            </div>
        )}

        {/* Past Orders Section */}
        <section>
          <h2 className="text-2xl font-semibold mb-6">Order History</h2>
          {pastOrders.length > 0 ? (
            <Card>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                        <TableRow>
                            <TableHead>Order ID</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Restaurant</TableHead>
                            <TableHead>Total</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                        </TableHeader>
                        <TableBody>
                        {pastOrders.map(order => (
                            <TableRow key={order.id}>
                            <TableCell className="font-medium">#{order.id}</TableCell>
                            <TableCell>{order.date}</TableCell>
                            <TableCell>{order.restaurantName}</TableCell>
                            <TableCell>${order.totalAmount.toFixed(2)}</TableCell>
                            <TableCell>
                                <Badge variant={
                                    order.status === 'DELIVERED' ? 'default' : 
                                    (order.status === 'CANCELLED' || order.status === 'FAILED' ? 'destructive' : 'secondary')
                                } className={order.status === 'DELIVERED' ? 'bg-green-500 hover:bg-green-600' : ''}>
                                    {order.status}
                                </Badge>
                            </TableCell>
                            <TableCell className="text-right space-x-2">
                                <Button variant="outline" size="sm" onClick={() => handleReorder(order.id)}>
                                <RefreshCcw className="mr-1 h-3 w-3" /> Reorder
                                </Button>
                                {order.status === 'DELIVERED' && (
                                <Button variant="outline" size="sm" onClick={() => handleRateOrder(order.id)}>
                                    <Star className="mr-1 h-3 w-3" /> Rate
                                </Button>
                                )}
                            </TableCell>
                            </TableRow>
                        ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
             /* Example with Accordion for details, if Table isn't enough */
             /*
            <Accordion type="single" collapsible className="w-full mt-4">
              {pastOrders.map(order => (
                <AccordionItem value={order.id} key={order.id}>
                  <AccordionTrigger>
                    Order #{order.id} - {order.date} - ${order.totalAmount.toFixed(2)} - {order.status}
                  </AccordionTrigger>
                  <AccordionContent className="p-4 bg-muted/50 rounded-md">
                    <p><strong>Restaurant:</strong> {order.restaurantName}</p>
                    <p><strong>Items:</strong></p>
                    <ul className="list-disc pl-5">
                      {order.items.map(item => (
                        <li key={item.name}>{item.name} (x{item.quantity})</li>
                      ))}
                    </ul>
                    <div className="mt-4 flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleReorder(order.id)}>Reorder</Button>
                      {order.status === 'DELIVERED' && <Button variant="outline" size="sm" onClick={() => handleRateOrder(order.id)}>Rate Order</Button>}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
            */
          ) : (
            <p className="text-muted-foreground">You have no past orders.</p>
          )}
        </section>
      </main>

      <footer className="py-6 text-center text-sm text-muted-foreground border-t">
        © {new Date().getFullYear()} FoodApp, Inc. All rights reserved.
      </footer>
    </div>
  );
};

export default OrderTrackingPage;