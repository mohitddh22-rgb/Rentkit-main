import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Equipment } from "@/entities/Equipment";
import { User } from "@/entities/User";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Search, 
  MapPin, 
  Star, 
  Shield, 
  Clock, 
  Zap,
  ArrowRight,
  Hammer,
  Settings,
  Wrench,
  Drill
} from "lucide-react";

export default function Home() {
  const [user, setUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchLocation, setSearchLocation] = useState("");
  const [featuredEquipment, setFeaturedEquipment] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const userData = await User.me();
      setUser(userData);
    } catch (error) {
      setUser(null);
    }

    try {
      const equipment = await Equipment.list("-created_date", 6);
      setFeaturedEquipment(equipment);
    } catch (error) {
      console.error("Error loading equipment:", error);
    }
    
    setLoading(false);
  };

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchQuery) params.append('q', searchQuery);
    if (searchLocation) params.append('location', searchLocation);
    
    window.location.href = createPageUrl("Browse") + (params.toString() ? `?${params.toString()}` : '');
  };

  const categories = [
    { name: "Power Tools", icon: Drill, count: "150+" },
    { name: "Garden Tools", icon: Settings, count: "80+" }, 
    { name: "Hand Tools", icon: Wrench, count: "200+" },
    { name: "Construction", icon: Hammer, count: "120+" }
  ];

  const features = [
    {
      icon: Shield,
      title: "Fully Insured",
      description: "All rentals covered by comprehensive insurance for peace of mind"
    },
    {
      icon: Clock,
      title: "Flexible Rentals",
      description: "From a few hours to several weeks - rent exactly as long as you need"
    },
    {
      icon: Zap,
      title: "Instant Booking",
      description: "Book equipment instantly and get confirmation within minutes"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-6">
                <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                  Rent Tools,
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400">
                    {" "}Build Dreams
                  </span>
                </h1>
                <p className="text-xl text-blue-100 leading-relaxed max-w-lg">
                  Access professional-grade tools and equipment from local owners across the UK. 
                  From DIY projects to professional jobs - we've got you covered.
                </p>
              </div>

              {/* Search Bar */}
              <div className="bg-white rounded-2xl p-6 shadow-2xl">
                <div className="grid sm:grid-cols-2 gap-4 mb-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      placeholder="What do you need?"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-11 h-12 text-gray-900 border-gray-200"
                    />
                  </div>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      placeholder="Location (e.g. London, M1 1AA)"
                      value={searchLocation}
                      onChange={(e) => setSearchLocation(e.target.value)}
                      className="pl-11 h-12 text-gray-900 border-gray-200"
                    />
                  </div>
                </div>
                <Button 
                  onClick={handleSearch}
                  className="w-full h-12 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl"
                >
                  <Search className="w-5 h-5 mr-2" />
                  Search Equipment
                </Button>
              </div>

              <div className="flex flex-wrap gap-4">
                {!user && (
                  <Link to={createPageUrl("Browse")}>
                    <Button size="lg" variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                      Start Renting
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </Link>
                )}
                <Link to={createPageUrl("ListEquipment")}>
                  <Button size="lg" variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                    List Your Tools
                  </Button>
                </Link>
              </div>
            </div>

            {/* Categories Preview */}
            <div className="grid grid-cols-2 gap-6">
              {categories.map((category) => (
                <Card key={category.name} className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-all cursor-pointer">
                  <CardContent className="p-6 text-center">
                    <category.icon className="w-12 h-12 mx-auto mb-4 text-green-400" />
                    <h3 className="font-semibold text-white mb-2">{category.name}</h3>
                    <p className="text-blue-100 text-sm">{category.count} available</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Why Choose RentKit?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We make tool and equipment rental simple, safe, and affordable for everyone in the UK.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-12">
            {features.map((feature, index) => (
              <div key={index} className="text-center group">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-105 transition-transform shadow-lg">
                  <feature.icon className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Equipment */}
      {featuredEquipment.length > 0 && (
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-end mb-12">
              <div>
                <h2 className="text-4xl font-bold text-gray-900 mb-4">Featured Equipment</h2>
                <p className="text-xl text-gray-600">Popular tools and equipment available near you</p>
              </div>
              <Link to={createPageUrl("Browse")}>
                <Button variant="outline" className="hidden sm:flex">
                  View All
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredEquipment.slice(0, 6).map((equipment) => (
                <Link key={equipment.id} to={createPageUrl(`Equipment?id=${equipment.id}`)}>
                  <Card className="hover:shadow-xl transition-all duration-300 group cursor-pointer border-0 shadow-lg">
                    <div className="aspect-[4/3] bg-gray-100 rounded-t-xl overflow-hidden">
                      {equipment.images && equipment.images[0] ? (
                        <img 
                          src={equipment.images[0]} 
                          alt={equipment.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Hammer className="w-16 h-16 text-gray-300" />
                        </div>
                      )}
                    </div>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="font-semibold text-gray-900 text-lg group-hover:text-blue-600 transition-colors">
                          {equipment.name}
                        </h3>
                        <div className="flex items-center text-yellow-400">
                          <Star className="w-4 h-4 fill-current" />
                          <span className="text-sm text-gray-600 ml-1">4.8</span>
                        </div>
                      </div>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{equipment.description}</p>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center text-gray-500 text-sm">
                          <MapPin className="w-4 h-4 mr-1" />
                          {equipment.location}
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-green-600">£{equipment.price_per_day}</div>
                          <div className="text-sm text-gray-500">per day</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-green-600 to-green-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to Get Started?</h2>
          <p className="text-xl text-green-100 mb-10 leading-relaxed">
            Join thousands of UK users who save money and time by renting instead of buying.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to={createPageUrl("Browse")}>
              <Button size="lg" variant="secondary" className="bg-white text-green-700 hover:bg-gray-100">
                <Search className="w-5 h-5 mr-2" />
                Start Renting Now
              </Button>
            </Link>
            <Link to={createPageUrl("ListEquipment")}>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                List Your Equipment
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
