import { useState, type FormEvent } from 'react';
import { Mail, Send } from 'lucide-react';

const NewsLetterBox = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (email.trim()) {
      setIsSubscribed(true);
      setTimeout(() => {
        setIsSubscribed(false);
        setEmail('');
      }, 3000);
    }
  };

  return (
    <div className="bg-white text-black py-16 px-4">
      <div className="max-w-4xl mx-auto text-center">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center">
            <Mail className="w-8 h-8 text-white" />
          </div>
        </div>

        {/* Heading */}
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Stay Updated
        </h2>

        {/* Subheading */}
        <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto">
          Subscribe to our newsletter and be the first to know about new arrivals,
          exclusive offers, and fashion trends.
        </p>

        {/* Newsletter Form */}
        {!isSubscribed ? (
          <form onSubmit={handleSubmit} className="max-w-md mx-auto">
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="flex-1 px-4 py-3 rounded-lg bg-gray-100 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-all duration-200"
                required
              />
              <button
                type="submit"
                className="px-8 py-3 bg-black text-white font-semibold rounded-lg hover:bg-gray-800 transition-all duration-200 flex items-center justify-center gap-2 group"
              >
                Subscribe
                <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
              </button>
            </div>
          </form>
        ) : (
          <div className="max-w-md mx-auto">
            <div className="bg-black text-white py-4 px-6 rounded-lg font-semibold">
              ✓ Thank you for subscribing!
            </div>
          </div>
        )}

        {/* Additional Info */}
        <p className="text-gray-500 text-sm mt-6">
          We respect your privacy. Unsubscribe at any time.
        </p>
      </div>
    </div>
  );
};

export default NewsLetterBox;
