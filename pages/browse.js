
import React, { useState, useEffect, useCallback } from "react";
import { Equipment } from "@/entities/Equipment";
import { User } from "@/entities/User";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Search, 
  MapPin, 
  Star, 
  Filter,
  SlidersHorizontal,
  Hammer
} from "lucide-react";

export default function Browse() {
  const [equipment, setEquipment] = useState([]);
  const [filteredEquipment, setFilteredEquipment] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchLocation, setSearchLocation] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [priceRange, setPriceRange] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  const categories = [
    { value: "all", label: "All Categories" },
    { value: "power_tools", label: "Power Tools" },
    { value: "hand_tools", label: "Hand Tools" },
    { value: "garden_tools", label: "Garden Tools" },
    { value: "construction", label: "Construction" },
    { value: "automotive", label: "Automotive" },
    { value: "cleaning", label: "Cleaning" },
    { value: "ladders_access", label: "Ladders & Access" },
    { value: "safety", label: "Safety Equipment" }
  ];

  const priceRanges = [
    { value: "all", label: "Any Price" },
    { value: "0-20", label: "Under £20" },
    { value: "20-50", label: "£20 - £50" },
    { value: "50-100", label: "£50 - £100" },
    { value: "100+", label: "£100+" }
  ];

  useEffect(() => {
    loadEquipment();
    
    // Check for URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const q = urlParams.get('q');
    const location = urlParams.get('location');
    
    if (q) setSearchQuery(q);
    if (location) setSearchLocation(location);
  }, []);

  const loadEquipment = async () => {
    setLoading(true);
    try {
      const data = await Equipment.list("-created_date");
      setEquipment(data.filter(item => item.availability));
    } catch (error) {
      console.error("Error loading equipment:", error);
    }
    setLoading(false);
  };

  const filterAndSortEquipment = useCallback(() => {
    let filtered = [...equipment];

    // Text search
    if (searchQuery) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.brand?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Location search
    if (searchLocation) {
      filtered = filtered.filter(item =>
        item.location.toLowerCase().includes(searchLocation.toLowerCase()) ||
        item.postcode?.toLowerCase().includes(searchLocation.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }

    // Price range filter
    if (priceRange !== "all") {
      const [min, max] = priceRange.split('-').map(p => p.replace('+', ''));
      filtered = filtered.filter(item => {
        if (priceRange.includes('+')) {
          return item.price_per_day >= parseInt(min);
        } else {
          return item.price_per_day >= parseInt(min) && item.price_per_day <= parseInt(max);
        }
      });
    }

    // Sorting
    switch (sortBy) {
      case "price_low":
        filtered.sort((a, b) => a.price_per_day - b.price_per_day);
        break;
      case "price_high":
        filtered.sort((a, b) => b.price_per_day - a.price_per_day);
        break;
      case "newest":
        filtered.sort((a, b) => new Date(b.created_date) - new Date(a.created_date));
        break;
      case "popular":
        // For now, just use creation date as proxy for popularity
        filtered.sort((a, b) => new Date(b.created_date) - new Date(a.created_date));
        break;
    }

    setFilteredEquipment(filtered);
  }, [equipment, searchQuery, searchLocation, selectedCategory, priceRange, sortBy]);

  useEffect(() => {
    filterAndSortEquipment();
  }, [filterAndSortEquipment]);

  const clearFilters = () => {
    setSearchQuery("");
    setSearchLocation("");
    setSelectedCategory("all");
    setPriceRange("all");
    setSortBy("newest");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Browse Equipment</h1>
          <p className="text-gray-600">Find the perfect tools and equipment for your project</p>
        </div>

        {/* Search and Filters */}
        <Card className="mb-8 shadow-lg border-0">
          <CardContent className="p-6">
            {/* Search Bar */}
            <div className="grid sm:grid-cols-2 gap-4 mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Search tools, brands, or keywords..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-11 h-12"
                />
              </div>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Location or postcode..."
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                  className="pl-11 h-12"
                />
              </div>
            </div>

            {/* Filters */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={priceRange} onValueChange={setPriceRange}>
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Price Range" />
                </SelectTrigger>
                <SelectContent>
                  {priceRanges.map((range) => (
                    <SelectItem key={range.value} value={range.value}>
                      {range.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Sort By" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="popular">Most Popular</SelectItem>
                  <SelectItem value="price_low">Price: Low to High</SelectItem>
                  <SelectItem value="price_high">Price: High to Low</SelectItem>
                </SelectContent>
              </Select>

              <Button 
                variant="outline" 
                onClick={clearFilters}
                className="h-12"
              >
                <Filter className="w-4 h-4 mr-2" />
                Clear Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results Header */}
        <div className="flex justify-between items-center mb-6">
          <p className="text-gray-600">
            {loading ? "Loading..." : `${filteredEquipment.length} ${filteredEquipment.length === 1 ? 'item' : 'items'} found`}
          </p>
        </div>

        {/* Equipment Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {loading ? (
            Array(8).fill(0).map((_, index) => (
              <Card key={index} className="shadow-lg border-0">
                <Skeleton className="aspect-[4/3] rounded-t-xl" />
                <CardContent className="p-4">
                  <Skeleton className="h-6 mb-2" />
                  <Skeleton className="h-4 mb-4" />
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-6 w-16" />
                  </div>
                </CardContent>
              </Card>
            ))
          ) : filteredEquipment.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No equipment found</h3>
              <p className="text-gray-600 mb-6">Try adjusting your search criteria or browse all equipment</p>
              <Button onClick={clearFilters} variant="outline">
                Clear All Filters
              </Button>
            </div>
          ) : (
            filteredEquipment.map((item) => (
              <Link key={item.id} to={createPageUrl(`Equipment?id=${item.id}`)}>
                <Card className="hover:shadow-xl transition-all duration-300 group cursor-pointer border-0 shadow-lg h-full">
                  <div className="aspect-[4/3] bg-gray-100 rounded-t-xl overflow-hidden">
                    {item.images && item.images[0] ? (
                      <img 
                        src={item.images[0]} 
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Hammer className="w-12 h-12 text-gray-300" />
                      </div>
                    )}
                  </div>
                  <CardContent className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                          {item.name}
                        </h3>
                        <div className="flex items-center text-yellow-400 ml-2">
                          <Star className="w-4 h-4 fill-current" />
                          <span className="text-sm text-gray-600 ml-1">4.8</span>
                        </div>
                      </div>
                      
                      {item.brand && (
                        <Badge variant="outline" className="mb-2 text-xs">
                          {item.brand}
                        </Badge>
                      )}
                      
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">{item.description}</p>
                    </div>
                    
                    <div>
                      <div className="flex items-center text-gray-500 text-sm mb-2">
                        <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
                        <span className="truncate">{item.location}</span>
                      </div>
                      <div className="flex justify-between items-end">
                        <div className="text-right">
                          <div className="text-2xl font-bold text-green-600">£{item.price_per_day}</div>
                          <div className="text-sm text-gray-500">per day</div>
                        </div>
                        <Badge 
                          variant={item.condition === 'excellent' ? 'default' : 'outline'}
                          className="text-xs"
                        >
                          {item.condition}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))
          )}
        </div>

        {/* Load More */}
        {filteredEquipment.length > 0 && (
          <div className="text-center mt-12">
            <p className="text-gray-600 mb-4">Showing {filteredEquipment.length} of {equipment.length} items</p>
          </div>
        )}
      </div>
    </div>
  );
}
