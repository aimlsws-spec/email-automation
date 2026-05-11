// Local Imports
import { Page } from "components/shared/Page";
import { Welcome } from "./Welcome";
import { AppointmentsRequestsList } from "./AppointmentsRequestsList";
import { NextPatient } from "./NextPatient";
import { PatientsChart } from "./PatientsChart";
import { Calendar } from "./Calendar";
import { AppointmentsTable } from "./AppointmentsTable";

// ----------------------------------------------------------------------

export default function Doctor() {
  return (
    <Page title="Doctor Dashboard">
      <div className="transition-content w-full px-(--margin-x) pb-8">
        <div className="mt-4 grid grid-cols-12 gap-4 sm:mt-5 sm:gap-5 lg:mt-6 lg:gap-6">
          <div className="col-span-12 lg:col-span-8 xl:col-span-9">
            <Welcome />
            <AppointmentsRequestsList />
            <AppointmentsTable />
          </div>
          <div className="col-span-12 lg:col-span-4 xl:col-span-3">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:sticky lg:top-20 lg:grid-cols-1 lg:gap-6 lg:self-start">
              <NextPatient />
              <PatientsChart />
              <Calendar />
            </div>
          </div>
        </div>
      </div>
    </Page>
  );
}
