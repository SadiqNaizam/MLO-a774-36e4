import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuLink, navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import AddressSelectorCard from '@/components/AddressSelectorCard'; // Custom component
import { ArrowLeft, CreditCard, MapPin, Terminal } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { toast } from "@/components/ui/use-toast";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const addressSchema = z.object({
  line1: z.string().min(5, "Street address is required"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  zip: z.string().min(5, "Zip code is required").max(10),
  country: z.string().min(2, "Country is required"),
});

const paymentSchema = z.object({
  cardNumber: z.string().length(16, "Card number must be 16 digits").regex(/^\d+$/, "Invalid card number"),
  expiryDate: z.string().regex(/^(0[1-9]|1[0-2])\/\d{2}$/, "Invalid expiry date (MM/YY)"),
  cvv: z.string().length(3, "CVV must be 3 digits").regex(/^\d+$/, "Invalid CVV"),
});

const checkoutSchema = z.object({
  address: addressSchema,
  paymentMethod: z.enum(["card", "cod"]),
  paymentDetails: paymentSchema.optional(),
}).refine(data => {
    if (data.paymentMethod === 'card') {
        return !!data.paymentDetails;
    }
    return true;
}, {
    message: "Payment details are required for card payment",
    path: ["paymentDetails"],
});


type CheckoutFormValues = z.infer<typeof checkoutSchema>;


// Placeholder data
const savedAddresses = [
  { id: 'addr1', line1: '123 Main St', city: 'Anytown', state: 'CA', zip: '90210', country: 'USA', isDefault: true },
  { id: 'addr2', line1: '456 Oak Ave', city: 'Otherville', state: 'NY', zip: '10001', country: 'USA' },
];

const CheckoutPage = () => {
  const [selectedAddressId, setSelectedAddressId] = useState(savedAddresses.find(a => a.isDefault)?.id || '');
  const [showNewAddressForm, setShowNewAddressForm] = useState(!savedAddresses.find(a => a.isDefault));
  const [paymentMethod, setPaymentMethod] = useState('card'); // 'card' or 'cod'
  const navigate = useNavigate();

  const { control, handleSubmit, formState: { errors }, setValue, watch } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      address: { line1: "", city: "", state: "", zip: "", country: "USA" },
      paymentMethod: "card",
      paymentDetails: { cardNumber: "", expiryDate: "", cvv: "" }
    }
  });
  
  const watchedPaymentMethod = watch("paymentMethod");

  useEffect(() => {
    console.log('CheckoutPage loaded');
    if (selectedAddressId) {
        const addr = savedAddresses.find(a => a.id === selectedAddressId);
        if(addr) {
            setValue("address.line1", addr.line1);
            setValue("address.city", addr.city);
            setValue("address.state", addr.state);
            setValue("address.zip", addr.zip);
            setValue("address.country", addr.country);
        }
    }
  }, [selectedAddressId, setValue]);

  const onSubmit = (data: CheckoutFormValues) => {
    console.log('Placing order with data:', data);
    // Simulate API call for placing order
    toast({
      title: "Order Placed!",
      description: "Your order has been successfully placed. You will be redirected shortly.",
    });
    setTimeout(() => {
      navigate('/order-tracking'); // Navigate to order tracking page
    }, 2000);
  };

  // Dummy order summary for display
  const orderSummary = {
    subtotal: 23.99,
    delivery: 5.00,
    taxes: 1.92,
    total: 30.91,
  };

  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <Button variant="ghost" size="icon" onClick={() => navigate('/cart')}>
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

      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-center md:text-left">Checkout</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Address & Payment */}
          <div className="lg:col-span-2 space-y-8">
            {/* Delivery Address Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><MapPin className="h-6 w-6 text-primary" /> Delivery Address</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <RadioGroup value={selectedAddressId} onValueChange={(id) => { setSelectedAddressId(id); setShowNewAddressForm(false); }} name="address-selection">
                  {savedAddresses.map(addr => (
                    <AddressSelectorCard
                      key={addr.id}
                      address={addr}
                      isSelected={selectedAddressId === addr.id && !showNewAddressForm}
                      onSelect={() => {setSelectedAddressId(addr.id); setShowNewAddressForm(false);}}
                      radioGroupId="address-selection"
                    />
                  ))}
                </RadioGroup>
                <Button variant="outline" onClick={() => {setShowNewAddressForm(true); setSelectedAddressId('');}} className="mt-2">
                  Add New Address
                </Button>
                {(showNewAddressForm || !savedAddresses.length) && (
                  <div className="space-y-3 mt-4 p-4 border rounded-md">
                    <h3 className="font-medium">New Address Details</h3>
                    <div>
                        <Label htmlFor="line1">Street Address</Label>
                        <Controller name="address.line1" control={control} render={({ field }) => <Input id="line1" {...field} />} />
                        {errors.address?.line1 && <p className="text-sm text-red-500 mt-1">{errors.address.line1.message}</p>}
                    </div>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="city">City</Label>
                            <Controller name="address.city" control={control} render={({ field }) => <Input id="city" {...field} />} />
                            {errors.address?.city && <p className="text-sm text-red-500 mt-1">{errors.address.city.message}</p>}
                        </div>
                        <div>
                            <Label htmlFor="state">State/Province</Label>
                            <Controller name="address.state" control={control} render={({ field }) => <Input id="state" {...field} />} />
                            {errors.address?.state && <p className="text-sm text-red-500 mt-1">{errors.address.state.message}</p>}
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="zip">ZIP/Postal Code</Label>
                            <Controller name="address.zip" control={control} render={({ field }) => <Input id="zip" {...field} />} />
                            {errors.address?.zip && <p className="text-sm text-red-500 mt-1">{errors.address.zip.message}</p>}
                        </div>
                        <div>
                            <Label htmlFor="country">Country</Label>
                            <Controller name="address.country" control={control} render={({ field }) => <Input id="country" {...field} />} />
                            {errors.address?.country && <p className="text-sm text-red-500 mt-1">{errors.address.country.message}</p>}
                        </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Payment Method Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><CreditCard className="h-6 w-6 text-primary" /> Payment Method</CardTitle>
              </CardHeader>
              <CardContent>
                <Controller
                  name="paymentMethod"
                  control={control}
                  render={({ field }) => (
                    <RadioGroup value={field.value} onValueChange={field.onChange} className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="card" id="payment-card" />
                        <Label htmlFor="payment-card">Credit/Debit Card</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="cod" id="payment-cod" />
                        <Label htmlFor="payment-cod">Cash on Delivery</Label>
                      </div>
                    </RadioGroup>
                  )}
                />
                {watchedPaymentMethod === 'card' && (
                  <div className="mt-6 space-y-4 p-4 border rounded-md">
                    <h3 className="font-medium">Card Details</h3>
                    <div>
                      <Label htmlFor="cardNumber">Card Number</Label>
                      <Controller name="paymentDetails.cardNumber" control={control} render={({ field }) => <Input id="cardNumber" placeholder="0000 0000 0000 0000" {...field} />} />
                      {errors.paymentDetails?.cardNumber && <p className="text-sm text-red-500 mt-1">{errors.paymentDetails.cardNumber.message}</p>}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="expiryDate">Expiry Date</Label>
                        <Controller name="paymentDetails.expiryDate" control={control} render={({ field }) => <Input id="expiryDate" placeholder="MM/YY" {...field} />} />
                        {errors.paymentDetails?.expiryDate && <p className="text-sm text-red-500 mt-1">{errors.paymentDetails.expiryDate.message}</p>}
                      </div>
                      <div>
                        <Label htmlFor="cvv">CVV</Label>
                        <Controller name="paymentDetails.cvv" control={control} render={({ field }) => <Input id="cvv" placeholder="123" {...field} />} />
                        {errors.paymentDetails?.cvv && <p className="text-sm text-red-500 mt-1">{errors.paymentDetails.cvv.message}</p>}
                      </div>
                    </div>
                  </div>
                )}
                {errors.paymentDetails && watchedPaymentMethod === 'card' && !errors.paymentDetails.cardNumber && !errors.paymentDetails.expiryDate && !errors.paymentDetails.cvv && (
                     <p className="text-sm text-red-500 mt-1">{errors.paymentDetails.message}</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between"><span>Subtotal:</span> <span>${orderSummary.subtotal.toFixed(2)}</span></div>
                <div className="flex justify-between"><span>Delivery:</span> <span>${orderSummary.delivery.toFixed(2)}</span></div>
                <div className="flex justify-between"><span>Taxes:</span> <span>${orderSummary.taxes.toFixed(2)}</span></div>
                <Separator />
                <div className="flex justify-between font-bold text-lg"><span>Total:</span> <span>${orderSummary.total.toFixed(2)}</span></div>
                 {Object.keys(errors).length > 0 && (
                  <Alert variant="destructive" className="mt-4">
                    <Terminal className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>Please correct the errors in the form before placing your order.</AlertDescription>
                  </Alert>
                )}
                <Button type="submit" className="w-full mt-6" size="lg">Place Order</Button>
              </CardContent>
            </Card>
          </div>
        </form>
      </main>

      <footer className="py-6 text-center text-sm text-muted-foreground border-t">
        © {new Date().getFullYear()} FoodApp, Inc. All rights reserved.
      </footer>
    </div>
  );
};

export default CheckoutPage;