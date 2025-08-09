import { RefreshCw, Shield, Headphones } from 'lucide-react';

const OurPolicy = () => {
  const policies = [
    {
      icon: <RefreshCw className="w-8 h-8 text-gray-700" />,
      title: "Easy Exchange Policy",
      description: "We offer hassle free exchange policy"
    },
    {
      icon: <Shield className="w-8 h-8 text-gray-700" />,
      title: "7 Days Return Policy",
      description: "We provide 7 days free return policy"
    },
    {
      icon: <Headphones className="w-8 h-8 text-gray-700" />,
      title: "Best customer support",
      description: "we provide 24/7 customer support"
    }
  ];

  return (
    <div className=" py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-3 gap-4 md:gap-8">
          {policies.map((policy, index) => (
            <div key={index} className="text-center">
              {/* Icon Container */}
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-200">
                  {policy.icon}
                </div>
              </div>
              
              {/* Title */}
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                {policy.title}
              </h3>
              
              {/* Description */}
              <p className="text-gray-600 text-sm leading-relaxed">
                {policy.description}
              </p>
            </div>
          ))}
        </div>
      </div>
      
      {/* Red accent dot (matching the original design) */}
      <div className="absolute left-0 top-1/2 w-2 h-2 bg-red-500 rounded-full transform -translate-y-1/2 hidden md:block"></div>
    </div>
  );
};

export default OurPolicy;