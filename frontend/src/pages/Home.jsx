import { ArrowRight, Star, Truck, Shield, Medal } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-primary-50 py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-primary-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
          <div className="absolute top-0 right-60 w-72 h-72 bg-primary-300 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-primary-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center space-x-2 bg-primary-100 text-primary-800 px-4 py-2 rounded-full text-sm font-semibold">
                <Star className="w-4 h-4 text-primary-600 fill-current" />
                <span>Premium Wholesale Collection</span>
              </div>
              <h1 className="text-5xl lg:text-7xl font-extrabold text-gray-900 leading-tight tracking-tight">
                Divine Craftsmanship <br className="hidden lg:block"/> 
                <span className="text-primary-600">For Your Store.</span>
              </h1>
              <p className="text-lg text-gray-600 max-w-xl leading-relaxed">
                Elevate your inventory with our meticulously crafted idols. Authentic materials, intricate detailing, and unbeatable wholesale pricing to support your spiritual business.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link to="/products" className="btn-primary text-lg px-8 py-4 flex justify-center items-center gap-2 group">
                  Explore Catalog
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link to="/contact" className="btn-secondary text-lg px-8 py-4 flex justify-center items-center font-semibold">
                  Request Wholesale Pricing
                </Link>
              </div>
            </div>
            
            <div className="relative lg:h-[600px] flex justify-center items-center">
              {/* Decorative Circle */}
              <div className="absolute w-[300px] h-[300px] lg:w-[450px] lg:h-[450px] bg-primary-200 rounded-full -z-10 blur-xl opacity-60"></div>
              {/* Wait, we don't have images yet, we'll use a placeholder styled nicely */}
              <div className="w-full max-w-md h-[400px] lg:h-[500px] bg-white rounded-3xl shadow-2xl overflow-hidden border border-white flex flex-col p-4 transform lg:-rotate-3 hover:rotate-0 transition-transform duration-500 hover:shadow-primary-100/50">
                  <div className="w-full h-[70%] bg-primary-100 rounded-2xl flex items-center justify-center relative overflow-hidden">
                     <div className="text-primary-800 font-semibold text-2xl z-10 text-center px-4">Stunning Brass & Marble Idols</div>
                     {/* decorative swirls */}
                     <svg className="absolute w-full h-full text-primary-200 opacity-50" viewBox="0 0 100 100" preserveAspectRatio="none">
                       <path d="M0,50 Q25,0 50,50 T100,50" stroke="currentColor" strokeWidth="2" fill="none"/>
                       <path d="M0,70 Q25,20 50,70 T100,70" stroke="currentColor" strokeWidth="2" fill="none"/>
                     </svg>
                  </div>
                  <div className="mt-6 flex justify-between items-center px-2">
                    <div>
                      <h3 className="font-bold text-gray-900 text-xl">Intricate Designs</h3>
                      <p className="text-gray-500 text-sm mt-1">Handcrafted with devotion</p>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-primary-50 flex justify-center items-center text-primary-600">
                       <Star className="w-6 h-6 fill-current"/>
                    </div>
                  </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-primary-600 font-semibold tracking-wide uppercase">Why Choose Us</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              A Trusted Partner For Your Business
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="flex flex-col items-center text-center p-6 bg-gray-50 rounded-2xl border border-gray-100 hover:shadow-lg transition-shadow duration-300">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mb-6">
                <Medal className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Unmatched Quality</h3>
              <p className="text-gray-600">Every idol passes strict quality checks. Available in 100% pure brass, authentic marble, and detailed resin.</p>
            </div>
            
            <div className="flex flex-col items-center text-center p-6 bg-gray-50 rounded-2xl border border-gray-100 hover:shadow-lg transition-shadow duration-300">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mb-6">
                <Shield className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Secure Packaging</h3>
              <p className="text-gray-600">We utilize export-quality multi-layer packaging to ensure your delicate murtis arrive in pristine condition.</p>
            </div>

            <div className="flex flex-col items-center text-center p-6 bg-gray-50 rounded-2xl border border-gray-100 hover:shadow-lg transition-shadow duration-300">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mb-6">
                <Truck className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Global Shipping</h3>
              <p className="text-gray-600">Reliable logistics partners for both domestic and international wholesale fulfillment with tracking.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Categories (Placeholder layout) */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-extrabold text-gray-900">Explore Collections</h2>
              <p className="mt-2 text-gray-600 text-lg">Browse our most popular categories.</p>
            </div>
            <Link to="/categories" className="hidden sm:flex items-center text-primary-600 font-semibold hover:text-primary-700">
              View All Categories <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {['Ganesh', 'Krishna', 'Shiva', 'Brass Art'].map((cat, i) => (
              <div key={i} className="group relative h-64 rounded-2xl overflow-hidden cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300">
                <div className="absolute inset-0 bg-primary-900">
                   {/* We will add an image overlay here later */}
                   <div className="absolute inset-0 opacity-20 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4NiIgaGVpZ2h0PSIyOSI+PHBhdGggZmlsbD0iI2ZmZiIgZmlsbC1vcGFjaXR5PSIwLjExIiBkPSJNMTUgMTJj...')]"></div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-6">
                  <h3 className="text-2xl font-bold text-white mb-1 group-hover:text-primary-300 transition-colors">{cat}</h3>
                  <p className="text-gray-300 text-sm flex items-center opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                    Explore Collection <ArrowRight className="w-3 h-3 ml-2" />
                  </p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-8 sm:hidden flex justify-center">
             <Link to="/categories" className="btn-secondary flex items-center">
              View All Categories <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-900 relative overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-10">
            {/* Pattern overlay */}
      <svg className="absolute h-full w-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="pattern-boxes" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M0 40L40 0H20L0 20M40 40V20L20 40" fill="currentColor" fillOpacity="0.4"></path>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#pattern-boxes)"></rect>
      </svg>
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white space-y-8">
          <h2 className="text-4xl font-extrabold pb-2">Ready to fill your store with divine grace?</h2>
          <p className="text-xl text-primary-200">
            Join hundreds of retailers enjoying wholesale pricing and exclusive early access to new collections.
          </p>
          <div className="flex justify-center gap-4 pt-4">
             <Link to="/contact" className="bg-white text-primary-900 hover:bg-primary-50 font-bold py-4 px-8 rounded-md transition-colors duration-300 text-lg">
                Become a Partner
             </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
