import React from 'react';
import { CheckCircle2, CircleDot, Truck, PackageCheck } from 'lucide-react'; // Example icons

interface OrderStatusStep {
  name: string;
  icon: React.ElementType;
  isCompleted: boolean;
  isCurrent: boolean;
}

interface OrderStatusTrackerProps {
  currentStatus: 'PLACED' | 'PREPARING' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'CANCELLED' | 'FAILED';
  // You might also pass an array of historical status updates with timestamps
}

const OrderStatusTracker: React.FC<OrderStatusTrackerProps> = ({ currentStatus }) => {
  console.log("Rendering OrderStatusTracker, current status:", currentStatus);

  const steps: OrderStatusStep[] = [
    { name: 'Order Placed', icon: CheckCircle2, isCompleted: false, isCurrent: false },
    { name: 'Preparing', icon: CircleDot, isCompleted: false, isCurrent: false }, // Using CircleDot for "in progress"
    { name: 'Out for Delivery', icon: Truck, isCompleted: false, isCurrent: false },
    { name: 'Delivered', icon: PackageCheck, isCompleted: false, isCurrent: false },
  ];

  let activeIndex = -1;
  if (currentStatus === 'PLACED') activeIndex = 0;
  else if (currentStatus === 'PREPARING') activeIndex = 1;
  else if (currentStatus === 'OUT_FOR_DELIVERY') activeIndex = 2;
  else if (currentStatus === 'DELIVERED') activeIndex = 3;

  steps.forEach((step, index) => {
    if (index < activeIndex) {
      step.isCompleted = true;
      step.isCurrent = false;
    } else if (index === activeIndex) {
      step.isCompleted = false; // Or true if "Delivered" is the final completed state
      step.isCurrent = true;
    } else {
      step.isCompleted = false;
      step.isCurrent = false;
    }
    if (currentStatus === 'DELIVERED' && index === 3) { // Ensure "Delivered" is marked completed
        step.isCompleted = true;
        step.isCurrent = true; // Or false if we consider it done. For UI, showing it as current completed makes sense.
    }
  });

  if (currentStatus === 'CANCELLED' || currentStatus === 'FAILED') {
    return (
      <div className="p-4 text-center bg-red-100 border border-red-300 rounded-md">
        <h3 className="text-lg font-semibold text-red-700">
          Order {currentStatus === 'CANCELLED' ? 'Cancelled' : 'Failed'}
        </h3>
        {/* Add more details if needed */}
      </div>
    );
  }

  return (
    <div className="w-full p-4">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <React.Fragment key={step.name}>
            <div className="flex flex-col items-center text-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center
                            ${step.isCompleted || step.isCurrent ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'}
                            ${step.isCurrent && !step.isCompleted ? 'ring-2 ring-green-500 ring-offset-2' : ''}`}
              >
                <step.icon className="w-5 h-5" />
              </div>
              <p
                className={`mt-2 text-xs sm:text-sm font-medium ${
                  step.isCompleted || step.isCurrent ? 'text-green-700' : 'text-gray-500'
                }`}
              >
                {step.name}
              </p>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`flex-1 h-1 mx-2 sm:mx-4 ${
                  step.isCompleted ? 'bg-green-500' : 'bg-gray-200'
                }`}
              />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default OrderStatusTracker;