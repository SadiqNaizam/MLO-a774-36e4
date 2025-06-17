import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroupItem } from "@/components/ui/radio-group"; // To indicate selection
import { Label } from "@/components/ui/label";
import { Edit3, Trash2 } from 'lucide-react'; // Example icons for actions

interface Address {
  id: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  isDefault?: boolean;
}

interface AddressSelectorCardProps {
  address: Address;
  isSelected: boolean;
  onSelect: (addressId: string) => void;
  onEdit?: (addressId: string) => void; // Optional edit handler
  onDelete?: (addressId: string) => void; // Optional delete handler
  radioGroupId?: string; // Name for the radio group if used in a list
}

const AddressSelectorCard: React.FC<AddressSelectorCardProps> = ({
  address,
  isSelected,
  onSelect,
  onEdit,
  onDelete,
  radioGroupId = "address-selection"
}) => {
  console.log("Rendering AddressSelectorCard for:", address.id, "Selected:", isSelected);

  const handleSelect = () => {
    onSelect(address.id);
  };

  return (
    <Label htmlFor={`address-${address.id}`} className="block cursor-pointer">
        <Card className={`transition-all ${isSelected ? 'border-green-500 ring-2 ring-green-500' : 'border-gray-200 hover:border-gray-400'}`}>
            <CardHeader className="flex flex-row items-start justify-between pb-2">
                <div className="flex items-center space-x-3">
                    <RadioGroupItem
                        value={address.id}
                        id={`address-${address.id}`}
                        checked={isSelected}
                        onClick={handleSelect}
                        aria-label={`Select address ${address.line1}`}
                        name={radioGroupId}
                    />
                    <CardTitle className="text-base font-medium">{address.line1}</CardTitle>
                </div>
                <div className="flex space-x-2">
                    {onEdit && (
                        <Button variant="ghost" size="icon" onClick={() => onEdit(address.id)} aria-label="Edit address">
                            <Edit3 className="h-4 w-4" />
                        </Button>
                    )}
                    {onDelete && (
                         <Button variant="ghost" size="icon" onClick={() => onDelete(address.id)} className="text-red-500 hover:text-red-700" aria-label="Delete address">
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    )}
                </div>
            </CardHeader>
            <CardContent className="pl-10 text-sm text-gray-600"> {/* Indent content to align with radio button */}
                {address.line2 && <p>{address.line2}</p>}
                <p>{address.city}, {address.state} {address.zip}</p>
                <p>{address.country}</p>
                {address.isDefault && <span className="text-xs text-green-600 font-semibold mt-1 block">Default</span>}
            </CardContent>
        </Card>
    </Label>
  );
};

export default AddressSelectorCard;