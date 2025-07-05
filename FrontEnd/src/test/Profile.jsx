import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FaEdit, FaBicycle, FaBox, FaDollarSign } from 'react-icons/fa';

gsap.registerPlugin(ScrollTrigger);

export default function BikeSellerProfile() {
  const profileRef = useRef(null);
  const [isBrowser, setIsBrowser] = useState(false);
  const [user, setUser] = useState({
    name: "Alex Turner",
    email: "alex@citybikes.com",
    phone: "+1 555 890 1234",
    location: "New York, NY"
  });
  const [products] = useState([
    { id: 1, name: "Road Bike Pro X1", price: 899, status: "Available" },
    { id: 2, name: "Mountain Climber V2", price: 1200, status: "Sold" },
    { id: 3, name: "Urban Commuter", price: 650, status: "Available" },
    { id: 4, name: "Vintage Cruiser", price: 450, status: "Pending" },
  ]);

  // Check if we're in the browser environment
  useEffect(() => {
    setIsBrowser(true);
  }, []);

  useEffect(() => {
    if (!isBrowser || !profileRef.current) return;
    
    gsap.from(profileRef.current, {
      duration: 1,
      opacity: 0,
      y: 30,
      ease: 'power2.out',
    });
  }, [isBrowser]);

  return (
    <div ref={profileRef} className="min-h-screen bg-black text-white p-8">
      {/* User Profile Section */}
      <section className="max-w-4xl mx-auto mb-16">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-8 border-b border-white/20 pb-6">
          <div>
            <h1 className="text-3xl font-light mb-2">{user.name}</h1>
            <div className="space-y-1 text-gray-400">
              <p>{user.email}</p>
              <p>{user.phone}</p>
              <p>{user.location}</p>
            </div>
          </div>
          <button className="p-2 hover:bg-white/10 rounded-lg transition mt-4 md:mt-0 self-start">
            <FaEdit className="text-xl" />
          </button>
        </div>
        
        {/* Product Archive */}
        <div>
          <h2 className="text-2xl font-light mb-6 flex items-center gap-2">
            <FaBox className="text-gray-400" /> Product Archive
          </h2>
          
          <div className="grid md:grid-cols-2 gap-4">
            {products.map(product => (
              <div key={product.id} className="p-4 border border-white/10 hover:border-white/20 transition">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg mb-1">{product.name}</h3>
                    <p className="text-gray-400 flex items-center gap-1">
                      <FaDollarSign /> {product.price}
                    </p>
                  </div>
                  <span className={`text-sm px-2 py-1 rounded 
                    ${product.status === 'Available' ? 'bg-white/10' : 
                      product.status === 'Sold' ? 'bg-black text-white/60 line-through' : 
                      'bg-white/20'}`}>
                    {product.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Sales Statistics */}
      <section className="max-w-4xl mx-auto mt-12 border-t border-white/10 pt-8">
        <h2 className="text-2xl font-light mb-6 flex items-center gap-2">
          <FaBicycle className="text-gray-400" /> Sales Overview
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 text-center">
          <StatCard title="Total Listings" value="24" />
          <StatCard title="Items Sold" value="18" />
          <StatCard title="Total Revenue" value="$14,200" />
        </div>
      </section>
    </div>
  );
}

const StatCard = ({ title, value }) => (
  <div className="p-4 border border-white/10">
    <p className="text-gray-400 mb-1">{title}</p>
    <p className="text-xl">{value}</p>
  </div>
);