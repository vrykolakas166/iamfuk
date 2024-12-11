import Image from "next/image";

const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <Image
        src="/assets/loading.gif"
        alt="Loading..."
        width={200} // Adjust as needed
        height={200} // Adjust as needed
      />
    </div>
  );
};

export default LoadingSpinner;
