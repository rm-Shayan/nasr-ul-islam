import { useEffect, useState } from "react";

const CurrentTime = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timerId = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timerId);
  }, []);

  return (
    <div className="text-xl font-bold text-green-900">
      {time.toLocaleTimeString()}
    </div>
  );
};
export default CurrentTime;
