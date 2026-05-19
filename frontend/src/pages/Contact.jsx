import { Mail, Phone, MapPin, Send } from 'lucide-react';
import toast from 'react-hot-toast';

const Contact = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate sending an inquiry
    toast.success('Your wholesale inquiry has been sent! We will contact you soon.', {
        duration: 4000,
        position: 'top-center'
    });
    e.target.reset();
  };

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-primary-600 font-semibold tracking-wide uppercase">Contact Us</h2>
          <h1 className="mt-2 text-4xl leading-10 font-extrabold tracking-tight text-gray-900 sm:text-5xl">
            Let's Make a Deal
          </h1>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
            Interested in wholesale inventory? Have custom requirements? Reach out to our dedicated B2B team.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Info */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex items-start gap-4">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex justify-center items-center flex-shrink-0">
                <Phone className="w-6 h-6 text-primary-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Phone Support</h3>
                <p className="text-gray-500 mt-1 mb-2">Mon-Sat, 9AM to 6PM IST</p>
                <p className="text-primary-700 font-semibold">+91 98765 43210</p>
              </div>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex items-start gap-4">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex justify-center items-center flex-shrink-0">
                <Mail className="w-6 h-6 text-primary-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Email Inquiry</h3>
                <p className="text-gray-500 mt-1 mb-2">We reply within 24 hours.</p>
                <p className="text-primary-700 font-semibold">wholesale@divineidols.com</p>
              </div>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex items-start gap-4">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex justify-center items-center flex-shrink-0">
                <MapPin className="w-6 h-6 text-primary-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Head Office</h3>
                <p className="text-gray-500 mt-1">123 Devotion Lane,<br/>Artisans District,<br/>Mumbai, 400001, India</p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2 bg-white p-10 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Send a Wholesale Inquiry</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">Company / Full Name *</label>
                  <input type="text" id="name" required className="mt-1 w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors" placeholder="Sri Traders" />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address *</label>
                  <input type="email" id="email" required className="mt-1 w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors" placeholder="contact@sritraders.com" />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone Number *</label>
                  <input type="tel" id="phone" required className="mt-1 w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors" placeholder="+91 00000 00000" />
                </div>
                <div>
                  <label htmlFor="interest" className="block text-sm font-medium text-gray-700">Primary Category Interest</label>
                  <select id="interest" className="mt-1 w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors bg-white">
                    <option>Mixed Assortment</option>
                    <option>Ganesh Idols</option>
                    <option>Krishna Idols</option>
                    <option>Brass Artworks</option>
                    <option>Marble Artifacts</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message / Minimum Order Quantity *</label>
                <textarea id="message" rows="5" required className="mt-1 w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors resize-y" placeholder="Tell us about your requirements..."></textarea>
              </div>

              <div>
                <button type="submit" className="btn-primary w-full py-4 text-lg font-bold flex justify-center items-center gap-2">
                  <Send className="w-5 h-5" /> Submit Inquiry
                </button>
              </div>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Contact;
