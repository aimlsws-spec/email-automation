// Import Dependencies
import clsx from "clsx";

// Local Imports
import { Button, Card } from "components/ui";
import { useBreakpointsContext } from "app/contexts/breakpoint/context";
import TeacherWelcome from "assets/illustrations/teacher-welcome.svg?react";

// ----------------------------------------------------------------------

export function Welcome() {
  const { smAndUp } = useBreakpointsContext();
  return (
    <Card
      className={clsx(
        smAndUp && "via-purple-300",
        "mt-12 flex flex-col bg-linear-to-l from-pink-300 to-indigo-400 p-5 sm:mt-0 sm:flex-row",
      )}
    >
      <div className="flex justify-center sm:order-last">
        <TeacherWelcome className="-mt-16 h-40 sm:mt-0" />
      </div>

      <div className="mt-2 flex-1 pt-2 text-center text-white sm:mt-0 sm:text-start">
        <h3 className="text-xl">
          Welcome Back, <span className="font-semibold">Caleb</span>
        </h3>
        <p className="mt-2 leading-relaxed">
          Your student completed
          <span className="font-semibold text-black/90"> 85%</span> of tasks
        </p>
        <p>
          Progress is <span className="font-semibold">excellent!</span>
        </p>

        <Button
          unstyled
          className="mt-6 rounded-lg bg-white/90 px-5 py-2.5 text-gray-900 hover:bg-white/70 focus:bg-white/70"
        >
          View Lessons
        </Button>
      </div>
    </Card>
  );
}
