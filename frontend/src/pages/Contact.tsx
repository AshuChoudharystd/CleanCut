import { Mail, Phone, MapPin, Instagram, Twitter, MessageCircle, Send, Clock, Star, ArrowRight } from "lucide-react";
import { useState } from "react";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isHovered, setIsHovered] = useState(null);

  const contactMethods = [
    {
      icon: <Mail className="w-8 h-8" />,
      title: "Drop Us a Line",
      description: "For general inquiries and collabs",
      contact: "hello@cleancut.com",
      action: "Send Email",
      gradient: "from-gray-50 to-white",
      emoji: "📧"
    },
    {
      icon: <Phone className="w-8 h-8" />,
      title: "Call Our Team",
      description: "Need immediate style advice?",
      contact: "+1 (555) 123-CUTS",
      action: "Call Now",
      gradient: "from-gray-100 to-gray-50",
      emoji: "📞"
    },
    {
      icon: <MessageCircle className="w-8 h-8" />,
      title: "Live Chat",
      description: "Instant support, real humans",
      contact: "Available 24/7",
      action: "Start Chat",
      gradient: "from-gray-50 to-white",
      emoji: "💬"
    },
    {
      icon: <MapPin className="w-8 h-8" />,
      title: "Visit Our Studio",
      description: "See where the magic happens",
      contact: "123 Style St, Fashion District",
      action: "Get Directions",
      gradient: "from-gray-100 to-gray-50",
      emoji: "📍"
    }
  ];

  const socialLinks = [
    { icon: <Instagram className="w-6 h-6" />, platform: "Instagram", handle: "@cleancut", followers: "150K" },
    { icon: <Twitter className="w-6 h-6" />, platform: "Twitter", handle: "@cleancut_co", followers: "45K" },
    { icon: <MessageCircle className="w-6 h-6" />, platform: "TikTok", handle: "@cleancut", followers: "280K" }
  ];

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Handle form submission
  };

  return (
    <div className="bg-white overflow-hidden">
      {/* Hero Section */}
      <section className="relative px-6 py-24 lg:py-32">
        {/* Background Elements */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-10 w-32 h-32 border-2 border-black rotate-12"></div>
          <div className="absolute top-32 right-20 w-24 h-24 bg-black rounded-full"></div>
          <div className="absolute bottom-20 left-1/4 w-40 h-1 bg-gray-400"></div>
          <div className="absolute bottom-32 right-1/3 w-16 h-16 border border-gray-300 rotate-45"></div>
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
              Let's <span className="text-gray-300 italic">Connect</span>
            </h1>
            
            <p className="text-2xl lg:text-3xl text-gray-700 font-light leading-relaxed max-w-4xl mx-auto mb-12">
              Got questions? Ideas? Just want to chat about fashion? 
              <span className="italic font-medium"> We're all ears and ready to vibe.</span>
            </p>

            {/* Quick Stats */}
            <div className="flex flex-wrap justify-center gap-8 text-center">
              <div className="group">
                <div className="text-2xl font-black text-black group-hover:scale-110 transition-transform duration-300">
                  <Clock className="w-6 h-6 inline mr-2" />
                  24/7
                </div>
                <p className="text-gray-600 text-sm">Response Time</p>
              </div>
              <div className="group">
                <div className="text-2xl font-black text-black group-hover:scale-110 transition-transform duration-300">
                  💝 98%
                </div>
                <p className="text-gray-600 text-sm">Happy Customers</p>
              </div>
              <div className="group">
                <div className="text-2xl font-black text-black group-hover:scale-110 transition-transform duration-300">
                  🌍 Global
                </div>
                <p className="text-gray-600 text-sm">Community</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Methods Grid */}
      <section className="px-6 py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-black text-black mb-6 tracking-tight">
              Choose Your Vibe
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Multiple ways to reach us because we know everyone communicates differently
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactMethods.map((method, index) => (
              <div 
                key={index} 
                className="group relative"
                onMouseEnter={() => setIsHovered(index)}
                onMouseLeave={() => setIsHovered(null)}
              >
                <div className={`relative bg-gradient-to-br ${method.gradient} rounded-3xl p-8 hover:shadow-2xl transition-all duration-700 hover:-translate-y-4 overflow-hidden border border-gray-100 hover:border-gray-200 h-full`}>
                  {/* Background Pattern */}
                  <div className="absolute inset-0 opacity-5">
                    <div className="absolute top-4 right-4 w-16 h-16 border border-black rounded-full"></div>
                    <div className="absolute bottom-4 left-4 w-12 h-1 bg-black"></div>
                  </div>
                  
                  <div className="relative z-10 text-center">
                    <div className="text-4xl mb-6">{method.emoji}</div>
                    <div className="text-black mb-6 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 flex justify-center">
                      {method.icon}
                    </div>
                    <h3 className="text-2xl font-black text-black mb-4 tracking-tight">
                      {method.title}
                    </h3>
                    <p className="text-gray-600 mb-4 text-sm">
                      {method.description}
                    </p>
                    <p className="text-black font-semibold mb-6">
                      {method.contact}
                    </p>
                    <button className="w-full py-3 bg-black text-white font-semibold rounded-xl hover:bg-gray-800 transition-colors duration-300 group-hover:scale-105">
                      {method.action}
                    </button>
                  </div>
                  
                  {/* Hover Effect */}
                  <div className={`absolute inset-0 bg-gradient-to-br from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl`}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="relative px-6 py-32 bg-gradient-to-br from-black via-gray-900 to-black text-white overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/4 left-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            {/* Form */}
            <div>
              <div className="mb-12">
                <h2 className="text-4xl lg:text-5xl font-black mb-6 tracking-tight">
                  Send Us a Message
                </h2>
                <p className="text-xl text-gray-300 font-light">
                  Whether it's feedback, collaboration ideas, or just saying hi – we love hearing from our community.
                </p>
              </div>

              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="relative">
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Your Name"
                      className="w-full px-6 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-white/40 focus:bg-white/15 transition-all duration-300 backdrop-blur-sm"
                      required
                    />
                  </div>
                  <div className="relative">
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Your Email"
                      className="w-full px-6 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-white/40 focus:bg-white/15 transition-all duration-300 backdrop-blur-sm"
                      required
                    />
                  </div>
                </div>
                
                <div className="relative">
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    placeholder="Subject"
                    className="w-full px-6 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-white/40 focus:bg-white/15 transition-all duration-300 backdrop-blur-sm"
                  />
                </div>
                
                <div className="relative">
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Your Message"
                    rows="6"
                    className="w-full px-6 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-white/40 focus:bg-white/15 transition-all duration-300 backdrop-blur-sm resize-none"
                    required
                  ></textarea>
                </div>
                
                <button 
                  onClick={handleSubmit}
                  className="group w-full py-5 bg-white text-black font-bold text-lg tracking-wide hover:bg-gray-100 transition-all duration-500 rounded-xl relative overflow-hidden"
                >
                  <span className="relative z-10 flex items-center justify-center">
                    Send Message
                    <Send className="w-5 h-5 ml-3 group-hover:translate-x-2 group-hover:-translate-y-1 transition-transform duration-300" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-gray-100 to-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
                </button>
                </div>
            </div>

            {/* Social & Info */}
            <div className="space-y-12">
              <div>
                <h3 className="text-3xl font-black mb-8 tracking-tight">
                  Follow Our Journey
                </h3>
                <div className="space-y-6">
                  {socialLinks.map((social, index) => (
                    <div key={index} className="group">
                      <div className="flex items-center p-6 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 hover:border-white/20 transition-all duration-300 cursor-pointer">
                        <div className="text-white mr-4 group-hover:scale-110 transition-transform duration-300">
                          {social.icon}
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold text-white">{social.platform}</div>
                          <div className="text-gray-400 text-sm">{social.handle}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-white font-bold">{social.followers}</div>
                          <div className="text-gray-400 text-xs">followers</div>
                        </div>
                        <ArrowRight className="w-5 h-5 text-gray-400 ml-4 group-hover:translate-x-1 transition-transform duration-300" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative">
                <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/20 rounded-3xl p-8">
                  <h4 className="text-2xl font-black mb-4">Quick Tips</h4>
                  <div className="space-y-4 text-gray-300">
                    <p className="flex items-start">
                      <span className="text-white mr-2">💡</span>
                      Need style advice? Include your measurements and style preferences
                    </p>
                    <p className="flex items-start">
                      <span className="text-white mr-2">📦</span>
                      Order issues? Have your order number ready
                    </p>
                    <p className="flex items-start">
                      <span className="text-white mr-2">🤝</span>
                      Business inquiries? We love collaborating with creators
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Location & Hours */}
      <section className="px-6 py-20 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-black text-black mb-6 tracking-tight">
              Visit Our Space
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our studio is where creativity meets community. Drop by anytime during our open hours.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="bg-gradient-to-br from-gray-50 to-white border border-gray-100 rounded-3xl p-8 hover:shadow-lg transition-all duration-300">
                <h3 className="text-2xl font-black text-black mb-6">Studio Hours</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                    <span className="font-semibold text-black">Monday - Friday</span>
                    <span className="text-gray-600">9:00 AM - 8:00 PM</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                    <span className="font-semibold text-black">Saturday</span>
                    <span className="text-gray-600">10:00 AM - 6:00 PM</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="font-semibold text-black">Sunday</span>
                    <span className="text-gray-600">12:00 PM - 5:00 PM</span>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-gray-100 to-gray-50 border border-gray-100 rounded-3xl p-8 hover:shadow-lg transition-all duration-300">
                <h3 className="text-2xl font-black text-black mb-4">Find Us</h3>
                <p className="text-gray-700 mb-4">
                  <MapPin className="w-5 h-5 inline mr-2" />
                  123 Style Street, Fashion District<br />
                  New York, NY 10001
                </p>
                <button className="w-full py-3 bg-black text-white font-semibold rounded-xl hover:bg-gray-800 transition-colors duration-300">
                  Get Directions
                </button>
              </div>
            </div>

            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl flex items-center justify-center border border-gray-200">
                <div className="text-center">
                  <div className="text-6xl mb-4">🗺️</div>
                  <p className="text-2xl font-bold text-black">Interactive Map</p>
                  <p className="text-gray-600 mt-2">Click to view location</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}