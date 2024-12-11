import Image from "next/image";

const LoadingSpinner = () => {
  return (
    <Image
      src="/assets/loading.gif"
      alt="Loading..."
      width={150} // Adjust as needed
      height={150} // Adjust as needed
    />
  );
};

export default LoadingSpinner;
