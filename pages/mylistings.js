
import React, { useState, useEffect, useCallback } from "react";
import { User } from "@/entities/User";
import { Equipment } from "@/entities/Equipment";
import { Booking } from "@/entities/Booking";
import { Link, useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft,
  Plus,
  Package,
  MapPin,
  PoundSterling,
  Calendar,
  Edit,
  Eye,
  ToggleLeft,
  ToggleRight
} from "lucide-react";

export default function MyListings() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [equipment, setEquipment] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadListingsData = useCallback(async () => {
    try {
      const userData = await User.me();
      setUser(userData);

      if (!userData || (userData.user_type !== 'owner' && userData.user_type !== 'both')) {
        navigate(createPageUrl("Dashboard"));
        return;
      }

      // Load user's equipment
      const equipmentData = await Equipment.list("-created_date");
      const userEquipment = equipmentData.filter(e => e.owner_id === userData.id);
      setEquipment(userEquipment);

      // Load bookings for the equipment
      const bookingsData = await Booking.list();
      const userBookings = bookingsData.filter(b => b.owner_id === userData.id);
      setBookings(userBookings);

    } catch (error) {
      console.error("Error loading listings data:", error);
      navigate(createPageUrl("Home"));
    }
    setLoading(false);
  }, [navigate]); // Added navigate to dependency array

  useEffect(() => {
    loadListingsData();
  }, [loadListingsData]); // Added loadListingsData to dependency array

  const toggleAvailability = async (equipmentId, currentAvailability) => {
    try {
      await Equipment.update(equipmentId, { availability: !currentAvailability });
      // Reload data
      loadListingsData();
    } catch (error) {
      console.error("Error updating availability:", error);
    }
  };

  const getBookingsForEquipment = (equipmentId) => {
    return bookings.filter(b => b.equipment_id === equipmentId);
  };

  const getActiveBookingsCount = (equipmentId) => {
    return bookings.filter(b => 
      b.equipment_id === equipmentId && 
      ['pending', 'confirmed', 'active'].includes(b.status)
    ).length;
  };

  const getTotalEarnings = (equipmentId) => {
    return bookings
      .filter(b => b.equipment_id === equipmentId && b.status === 'completed')
      .reduce((sum, b) => sum + (b.owner_earnings || 0), 0);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Please Sign In</h2>
          <Button onClick={() => User.login()}>Sign In</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigate(createPageUrl("Dashboard"))}
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Equipment Listings</h1>
              <p className="text-gray-600 mt-1">Manage your equipment rentals and bookings</p>
            </div>
          </div>
          <Link to={createPageUrl("ListEquipment")}>
            <Button className="bg-green-600 hover:bg-green-700">
              <Plus className="w-4 h-4 mr-2" />
              Add New Equipment
            </Button>
          </Link>
        </div>

        {equipment.length === 0 ? (
          <Card className="shadow-lg border-0">
            <CardContent className="p-12 text-center">
              <Package className="w-20 h-20 text-gray-300 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-gray-900 mb-4">No equipment listed yet</h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                Start earning money by listing your tools and equipment for rent. 
                It's easy to get started and you keep 90% of the rental fee.
              </p>
              <Link to={createPageUrl("ListEquipment")}>
                <Button size="lg" className="bg-green-600 hover:bg-green-700">
                  <Plus className="w-4 h-4 mr-2" />
                  List Your First Item
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {equipment.map((item) => {
              const activeBookings = getActiveBookingsCount(item.id);
              const totalEarnings = getTotalEarnings(item.id);
              const allBookings = getBookingsForEquipment(item.id);

              return (
                <Card key={item.id} className="shadow-lg border-0 hover:shadow-xl transition-shadow duration-300">
                  <div className="aspect-[4/3] bg-gray-100 rounded-t-xl overflow-hidden relative">
                    {item.images && item.images[0] ? (
                      <img 
                        src={item.images[0]} 
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package className="w-16 h-16 text-gray-300" />
                      </div>
                    )}
                    
                    {/* Availability Toggle */}
                    <div className="absolute top-4 right-4">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => toggleAvailability(item.id, item.availability)}
                        className={`${
                          item.availability 
                            ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                            : 'bg-red-100 text-red-800 hover:bg-red-200'
                        }`}
                      >
                        {item.availability ? (
                          <>
                            <ToggleRight className="w-4 h-4 mr-1" />
                            Available
                          </>
                        ) : (
                          <>
                            <ToggleLeft className="w-4 h-4 mr-1" />
                            Unavailable
                          </>
                        )}
                      </Button>
                    </div>
                  </div>

                  <CardContent className="p-6">
                    <div className="mb-4">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.name}</h3>
                      <div className="flex items-center text-gray-500 text-sm mb-2">
                        <MapPin className="w-4 h-4 mr-1" />
                        {item.location}
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-lg font-bold text-green-600">
                          <PoundSterling className="w-5 h-5 mr-1" />
                          {item.price_per_day}/day
                        </div>
                        <Badge variant={item.condition === 'excellent' ? 'default' : 'outline'}>
                          {item.condition}
                        </Badge>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg mb-4">
                      <div className="text-center">
                        <div className="text-lg font-bold text-blue-600">{activeBookings}</div>
                        <div className="text-xs text-gray-500">Active</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-purple-600">{allBookings.length}</div>
                        <div className="text-xs text-gray-500">Total</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-green-600">£{totalEarnings.toFixed(0)}</div>
                        <div className="text-xs text-gray-500">Earned</div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Link to={createPageUrl(`Equipment?id=${item.id}`)} className="flex-1">
                        <Button variant="outline" size="sm" className="w-full">
                          <Eye className="w-4 h-4 mr-2" />
                          View
                        </Button>
                      </Link>
                      <Button variant="outline" size="sm" className="flex-1">
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                    </div>

                    {/* Recent Booking Activity */}
                    {allBookings.length > 0 && (
                      <div className="mt-4 pt-4 border-t">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Recent Activity</h4>
                        <div className="space-y-2">
                          {allBookings.slice(0, 2).map((booking) => (
                            <div key={booking.id} className="flex justify-between items-center text-xs">
                              <div className="flex items-center">
                                <Calendar className="w-3 h-3 mr-1 text-gray-400" />
                                <span className="text-gray-600">
                                  {new Date(booking.created_date).toLocaleDateString()}
                                </span>
                              </div>
                              <Badge variant="outline" className="text-xs">
                                {booking.status}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
