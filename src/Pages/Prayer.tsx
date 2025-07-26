import { Outlet } from "react-router-dom"
import { CurrentTime } from "../Components"


export const Prayer = () => {
  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString("ur-PK", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <>
      {/* Header with CurrentTime and Date */}
      <div className="flex flex-col md:flex-row justify-between items-center bg-green-100 p-6 rounded-2xl shadow-md overflow-hidden mx-4 md:mx-6 lg:mx-10 mt-4">
        <CurrentTime />
        <div className="text-sm text-green-900 font-medium mt-3 md:mt-0">
          {formattedDate}
        </div>
      </div>

      {/* Main content area, including NamazAukkat and Outlet */}
      {/* The h-[80vh] and overflow-y-auto ensures this section is scrollable if content exceeds height */}
    
        {/* NamazAukkat component integrated here */}
        
        {/* This is where other routed components (like PrayerCards) will be rendered */}
        <main className="mt-8"> {/* Added margin-top for spacing */}
          <Outlet />
        </main>

    </>
  );
};
export default Prayer