import DIULogo from "@/assets/page/home/diuLogoSide.png";
import IICLogo from "@/assets/page/home/IICLogo.jpg";

function PartnerSlider() {
  return (
    <section className="w-full pt-8 pb-6">
      {/* Title */}
      <div className="text-center mb-6">
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800">
          আমাদের পার্টনার ও সহযোগীতায়
        </h1>
        <div className="w-32 h-1 bg-blue-900 mx-auto mt-3 rounded-full"></div>
      </div>

      {/* Partner Logo */}
      <div className="flex justify-center items-center">
        <div className="flex gap-1 p-1 bg-gray-100 border rounded-md shadow-sm hover:shadow-md transition duration-500">
          {/* IIC */}
          <a
            // href="https://iic.daffodilvarsity.edu.bd/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex cursor-pointer items-center justify-center bg-white p-2 rounded-md hover:scale-y-105 transition duration-500"
          >
            <img
              src={IICLogo}
              alt="IIC Partner Logo"
              className="h-16 md:h-20 object-contain"
            />
          </a>

          {/* DIU */}
          <a
            // href="https://daffodilvarsity.edu.bd/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex cursor-pointer items-center justify-center bg-white p-2 rounded-md hover:scale-y-105 transition duration-500"
          >
            <img
              src={DIULogo}
              alt="DIU Partner Logo"
              className="h-16 md:h-20 object-contain"
            />
          </a>
        </div>
      </div>
    </section>
  );
}

export default PartnerSlider;
