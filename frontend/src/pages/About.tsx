import { Scissors, Heart, Users, Zap, ArrowRight, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function About() {
  const stats = [
    { number: "50K+", label: "Gen-Z Customers", icon: "👥" },
    { number: "100%", label: "Sustainable Materials", icon: "🌱" },
    { number: "24/7", label: "Style Support", icon: "💬" },
    { number: "2019", label: "Founded", icon: "⚡" }
  ];

  const navigate = useNavigate();

  const values = [
    {
      icon: <Scissors className="w-10 h-10" />,
      title: "Clean Cuts Only",
      description: "We curate pieces that are crisp, minimal, and effortlessly cool. No mid fashion here.",
      gradient: "from-gray-50 to-white"
    },
    {
      icon: <Heart className="w-10 h-10" />,
      title: "Made for Gen-Z",
      description: "By Gen-Z, for Gen-Z. We get your vibe and create pieces that match your energy.",
      gradient: "from-gray-100 to-gray-50"
    },
    {
      icon: <Users className="w-10 h-10" />,
      title: "Community First",
      description: "Your fits inspire us. Tag us, share your style, and let's build this movement together.",
      gradient: "from-gray-50 to-white"
    },
    {
      icon: <Zap className="w-10 h-10" />,
      title: "Fast & Fresh",
      description: "Trends move fast, and so do we. New drops, quick shipping, always ahead of the curve.",
      gradient: "from-gray-100 to-gray-50"
    }
  ];

  return (
    <div className="bg-white overflow-hidden">
      {/* Hero Section with Geometric Elements */}
      <section className="relative px-6 py-24 lg:py-40">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-10 w-32 h-32 border border-black rotate-45"></div>
          <div className="absolute top-40 right-20 w-24 h-24 bg-black rounded-full"></div>
          <div className="absolute bottom-20 left-1/4 w-16 h-16 border-2 border-gray-400"></div>
          <div className="absolute bottom-32 right-1/3 w-20 h-1 bg-black"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-20">
            {/* Elegant Brand Mark */}
            <div className="inline-flex items-center mb-8">
              <div className="w-16 h-1 bg-black mr-6"></div>
              <Star className="w-6 h-6 text-black" />
              <div className="w-16 h-1 bg-black ml-6"></div>
            </div>
            
            <h1 className="text-6xl lg:text-8xl font-black text-black mb-8 tracking-tighter leading-none">
              clean<span className="text-gray-300 italic">Cut</span>
            </h1>
            
            <div className="max-w-4xl mx-auto mb-12">
              <p className="text-2xl lg:text-3xl text-gray-700 font-light leading-relaxed mb-6">
                Redefining minimalist fashion for the generation 
                <span className="italic font-medium"> that writes tomorrow's rules</span>
              </p>
            </div>

            {/* Elegant CTA */}
            <button className="group inline-flex items-center px-12 py-5 bg-black text-white font-semibold text-lg tracking-wide hover:bg-gray-900 transition-all duration-500 relative overflow-hidden">
              <span className="relative z-10">Discover Our Story</span>
              <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-2 transition-transform duration-300 relative z-10" />
              <div className="absolute inset-0 bg-gradient-to-r from-gray-900 to-black transform translate-x-full group-hover:translate-x-0 transition-transform duration-500"></div>
            </button>
          </div>

          {/* Elevated Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {stats.map((stat, index) => (
              <div key={index} className="group text-center">
                <div className="relative bg-white border border-gray-100 rounded-3xl p-8 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 hover:border-gray-200">
                  <div className="text-4xl mb-4">{stat.icon}</div>
                  <div className="text-4xl lg:text-5xl font-black text-black mb-3 group-hover:scale-110 transition-transform duration-300">
                    {stat.number}
                  </div>
                  <div className="text-gray-600 font-medium text-sm uppercase tracking-wide">
                    {stat.label}
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sophisticated Story Section */}
      <section className="relative px-6 py-32 bg-gradient-to-br from-black via-gray-900 to-black text-white overflow-hidden">
        {/* Elegant Background Elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/4 left-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-5xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <div className="inline-block mb-8">
              <div className="w-24 h-1 bg-white mx-auto mb-4"></div>
              <h2 className="text-5xl lg:text-6xl font-black mb-4 tracking-tight">
                Our Story
              </h2>
              <div className="w-24 h-1 bg-white mx-auto"></div>
            </div>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="relative">
                <div className="absolute -left-4 top-0 w-1 h-full bg-gradient-to-b from-white to-transparent"></div>
                <p className="text-xl lg:text-2xl leading-relaxed font-light pl-8">
                  Born from a dorm room vision in 2019, we started as rebels against fast fashion's chaos. 
                  Three college friends with scissors, dreams, and an obsession with clean aesthetics.
                </p>
              </div>
              
              <div className="relative">
                <div className="absolute -left-4 top-0 w-1 h-full bg-gradient-to-b from-white via-white to-transparent"></div>
                <p className="text-xl lg:text-2xl leading-relaxed font-light pl-8">
                  Today, we're the sanctuary for 50,000+ Gen-Z visionaries who refuse to compromise on style, 
                  sustainability, or authenticity. Every thread tells a story of conscious rebellion.
                </p>
              </div>
            </div>
            
            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-gray-800 to-black rounded-3xl border border-gray-700 flex items-center justify-center group hover:scale-105 transition-transform duration-700">
                <div className="text-center">
                  <div className="text-6xl mb-6">✨</div>
                  <p className="text-2xl font-bold italic">
                    "Fashion that gets it."
                  </p>
                  <p className="text-lg text-gray-300 mt-2">
                    - The cleanCut Generation
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Premium Values Section */}
      <section className="px-6 py-32 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl lg:text-6xl font-black text-black mb-6 tracking-tight">
              Our Philosophy
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Four pillars that define everything we create, every decision we make, 
              and every relationship we build.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            {values.map((value, index) => (
              <div key={index} className="group relative">
                <div className={`relative bg-gradient-to-br ${value.gradient} rounded-3xl p-10 hover:shadow-3xl transition-all duration-700 hover:-translate-y-3 overflow-hidden border border-gray-100 hover:border-gray-200`}>
                  {/* Subtle Pattern Overlay */}
                  <div className="absolute inset-0 opacity-5">
                    <div className="absolute top-4 right-4 w-20 h-20 border border-black rounded-full"></div>
                    <div className="absolute bottom-4 left-4 w-16 h-1 bg-black"></div>
                  </div>
                  
                  <div className="relative z-10">
                    <div className="text-black mb-8 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500">
                      {value.icon}
                    </div>
                    <h3 className="text-3xl font-black text-black mb-6 tracking-tight">
                      {value.title}
                    </h3>
                    <p className="text-gray-700 leading-relaxed text-lg font-light">
                      {value.description}
                    </p>
                  </div>
                  
                  {/* Hover Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Luxurious CTA Section */}
      <section className="relative px-6 py-32 bg-black text-white overflow-hidden">
        {/* Premium Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-2 h-full bg-gradient-to-b from-transparent via-white to-transparent"></div>
          <div className="absolute top-0 right-1/3 w-1 h-full bg-gradient-to-b from-transparent via-white to-transparent"></div>
          <div className="absolute top-1/3 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white to-transparent"></div>
        </div>

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="mb-12">
            <div className="inline-flex items-center mb-8">
              <div className="w-20 h-1 bg-white mr-6"></div>
              <div className="w-3 h-3 bg-white rounded-full"></div>
              <div className="w-20 h-1 bg-white ml-6"></div>
            </div>
          </div>
          
          <h2 className="text-5xl lg:text-7xl font-black mb-8 tracking-tighter leading-none">
            Ready to Join the
            <span className="italic text-gray-300"> Revolution?</span>
          </h2>
          
          <p className="text-2xl text-gray-300 mb-16 max-w-3xl mx-auto font-light leading-relaxed">
            Step into a world where minimalism meets maximum impact. 
            Where every piece is a statement, and every statement matters.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <button className="group relative px-12 py-6 bg-white text-black font-bold text-lg tracking-wide hover:bg-gray-100 transition-all duration-500 overflow-hidden" onClick={()=>{navigate("/collection")}}>
              <span className="relative z-10 flex items-center">
                Explore Collections
                <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-2 transition-transform duration-300" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-gray-100 to-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-500" onClick={()=>{navigate("/collection")}}></div>
            </button>
            
            <button className="group px-12 py-6 border-2 border-white text-white font-bold text-lg tracking-wide hover:bg-white hover:text-black transition-all duration-500 relative overflow-hidden">
              <span className="relative z-10">Join Our Community</span>
              <div className="absolute inset-0 bg-white transform translate-x-full group-hover:translate-x-0 transition-transform duration-500"></div>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}