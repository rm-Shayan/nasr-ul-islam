// components/Loader.tsx
type LoaderProps = {
  fullScreen?: boolean;
};

const Loader = ({ fullScreen = true }: LoaderProps) => {
  return (
    <div
      className={`flex items-center justify-center ${
        fullScreen ? "h-screen" : "h-full"
      } w-full bg-gradient-to-br from-green-100 to-green-200`}
    >
      <div className="w-12 h-12 border-4 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
    </div>
  );
};

export default Loader;
