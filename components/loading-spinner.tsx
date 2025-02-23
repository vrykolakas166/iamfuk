import Image from "next/image";

const LoadingSpinner = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="text-gray-500/60 animate-pulse">please wait</div>
      <Image
        src="/assets/loading.gif"
        alt="Loading..."
        width={200}
        height={200}
        className="w-[180px]"
        priority={true}
      />
    </div>
  );
};

export default LoadingSpinner;
