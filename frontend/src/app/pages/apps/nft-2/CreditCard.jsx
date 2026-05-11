// Import Dependencies
import { FaBitcoin } from "react-icons/fa6";

// Local Imports
import { Card } from "components/ui";

// ----------------------------------------------------------------------

export function CreditCard() {
  return (
    <Card className="bg-linear-to-br from-info to-info-darker p-4">
      <div className="flex justify-between text-white">
        <FaBitcoin className="size-6" />
        <p>**** **** 4995</p>
      </div>
      <div className="mt-12">
        <p className="text-white/90">Bitcoin</p>
        <div className="flex justify-between">
          <p className="truncate text-2xl font-semibold text-white">2.656651</p>
          <img
            src="/images/payments/cc-visa-white.svg"
            className="w-10 rounded-lg"
            alt="creditcard"
          />
        </div>
      </div>
    </Card>
  );
}
