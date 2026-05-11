// Local Imports
import Doctor from "assets/illustrations/doctor.svg?react";
import { Button, Card } from "components/ui";

// ----------------------------------------------------------------------

export function Welcome() {
  return (
    <Card className="col-span-12 mt-12 flex flex-col bg-linear-to-r from-blue-500 to-blue-600 p-5 sm:col-span-8 sm:mt-0 sm:flex-row">
      <div className="flex justify-center sm:order-last">
        <Doctor className="-mt-16 h-40 sm:mt-0" />
      </div>
      <div className="mt-2 flex-1 pt-2 text-center text-white sm:mt-0 sm:text-start">
        <h3 className="text-xl">
          Good morning, <span className="font-semibold">Dr. Adam</span>
        </h3>
        <p className="mt-2 leading-relaxed">Have a nice day at work</p>
        <p>
          Progress is <span className="font-semibold">excellent!</span>
        </p>

        <Button
          unstyled
          className="mt-6 rounded-lg px-5 py-2 border border-white/10 bg-white/20 text-white hover:bg-white/30 focus:bg-white/30"
        >
          View Schedule
        </Button>
      </div>
    </Card>
  );
}
