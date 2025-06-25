
import { ChevronDown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface OrderSummaryCardProps {
  total: number;
}

const OrderSummaryCard = ({ total }: OrderSummaryCardProps) => {
  return (
    <Card className="mb-6">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <span className="font-medium">ملخص الطلب</span>
          <ChevronDown className="w-5 h-5 text-gray-400" />
        </div>
        <div className="text-right">
          <span className="text-xl font-bold">د.ع {total.toLocaleString()}</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderSummaryCard;
