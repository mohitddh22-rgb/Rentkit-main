
import React, { useState, useEffect, useCallback } from "react";
import { User } from "@/entities/User";
import { Equipment } from "@/entities/Equipment";
import { Booking } from "@/entities/Booking";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  PlusCircle,
  Package,
  Calendar,
  PoundSterling,
  TrendingUp,
  MapPin,
  Clock,
  User as UserIcon,
  Settings,
  BarChart3
} from "lucide-react";
import { format } from "date-fns";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [myEquipment, setMyEquipment] = useState([]);
  const [myBookings, setMyBookings] = useState([]);
  const [rentalBookings, setRentalBookings] = useState([]);
  const [stats, setStats] = useState({
    totalEarnings: 0,
    totalSpent: 0,
    activeListings: 0,
    completedRentals: 0
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  const loadDashboardData = useCallback(async () => {
    try {
      const userData = await User.me();
      setUser(userData);

      let userEquipment = [];
      // Load user's equipment if they're an owner
      if (userData.user_type === 'owner' || userData.user_type === 'both') {
        const equipmentData = await Equipment.list();
        userEquipment = equipmentData.filter(e => e.owner_id === userData.id);
        setMyEquipment(userEquipment);
      }

      // Load bookings
      const bookingsData = await Booking.list("-created_date");
      const userBookings = bookingsData.filter(b => b.renter_id === userData.id);
      const userRentalBookings = bookingsData.filter(b => b.owner_id === userData.id);
      
      setMyBookings(userBookings);
      setRentalBookings(userRentalBookings);

      // Calculate stats
      const totalEarnings = userRentalBookings
        .filter(b => b.status === 'completed')
        .reduce((sum, b) => sum + (b.owner_earnings || 0), 0);

      const totalSpent = userBookings
        .filter(b => b.status === 'completed')
        .reduce((sum, b) => sum + (b.total_cost || 0), 0);

      setStats({
        totalEarnings,
        totalSpent,
        activeListings: userEquipment.filter(e => e.availability).length, // Use the fresh userEquipment, not state variable
        completedRentals: userBookings.filter(b => b.status === 'completed').length
      });

    } catch (error) {
      console.error("Error loading dashboard data:", error);
    }
    setLoading(false);
  }, []); // Dependencies are stable or local to the function call.

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]); // useEffect depends on the memoized function.

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'active': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
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
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome back, {user.full_name?.split(' ')[0]}!
            </h1>
            <p className="text-gray-600 mt-1">Here's what's happening with your rentals</p>
          </div>
          <div className="flex gap-3 mt-4 sm:mt-0">
            <Link to={createPageUrl("Profile")}>
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
            </Link>
            {(user.user_type === 'owner' || user.user_type === 'both') && (
              <Link to={createPageUrl("ListEquipment")}>
                <Button size="sm" className="bg-green-600 hover:bg-green-700">
                  <PlusCircle className="w-4 h-4 mr-2" />
                  List Equipment
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {(user.user_type === 'owner' || user.user_type === 'both') && (
            <>
              <Card className="shadow-lg border-0">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Total Earnings</p>
                      <p className="text-2xl font-bold text-green-600">£{stats.totalEarnings.toFixed(2)}</p>
                    </div>
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <PoundSterling className="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg border-0">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Active Listings</p>
                      <p className="text-2xl font-bold text-blue-600">{stats.activeListings}</p>
                    </div>
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Package className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          <Card className="shadow-lg border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Spent</p>
                  <p className="text-2xl font-bold text-purple-600">£{stats.totalSpent.toFixed(2)}</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Completed Rentals</p>
                  <p className="text-2xl font-bold text-orange-600">{stats.completedRentals}</p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tab Selection */}
        <div className="mb-6">
          <Select value={activeTab} onValueChange={setActiveTab}>
            <SelectTrigger className="w-64">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="overview">Overview</SelectItem>
              <SelectItem value="my_bookings">My Bookings</SelectItem>
              {(user.user_type === 'owner' || user.user_type === 'both') && (
                <>
                  <SelectItem value="my_listings">My Listings</SelectItem>
                  <SelectItem value="rental_bookings">Rental Requests</SelectItem>
                </>
              )}
            </SelectContent>
          </Select>
        </div>

        {/* Content Based on Active Tab */}
        {activeTab === "overview" && (
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Recent Bookings */}
            <Card className="shadow-lg border-0">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Recent Bookings</CardTitle>
                <Link to={createPageUrl("MyBookings")}>
                  <Button variant="outline" size="sm">View All</Button>
                </Link>
              </CardHeader>
              <CardContent>
                {myBookings.slice(0, 3).length > 0 ? (
                  <div className="space-y-4">
                    {myBookings.slice(0, 3).map((booking) => (
                      <div key={booking.id} className="flex justify-between items-center p-4 border rounded-lg">
                        <div>
                          <h4 className="font-medium">Booking #{booking.id.slice(0, 8)}</h4>
                          <p className="text-sm text-gray-600">
                            {format(new Date(booking.start_date), 'MMM d')} - {format(new Date(booking.end_date), 'MMM d')}
                          </p>
                        </div>
                        <div className="text-right">
                          <Badge className={getStatusColor(booking.status)}>
                            {booking.status}
                          </Badge>
                          <p className="text-sm text-gray-600 mt-1">£{booking.total_cost}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No bookings yet</p>
                    <Link to={createPageUrl("Browse")}>
                      <Button variant="outline" size="sm" className="mt-2">
                        Start Browsing
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Equipment Activity */}
            {(user.user_type === 'owner' || user.user_type === 'both') && (
              <Card className="shadow-lg border-0">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Your Equipment</CardTitle>
                  <Link to={createPageUrl("MyListings")}>
                    <Button variant="outline" size="sm">View All</Button>
                  </Link>
                </CardHeader>
                <CardContent>
                  {myEquipment.slice(0, 3).length > 0 ? (
                    <div className="space-y-4">
                      {myEquipment.slice(0, 3).map((equipment) => (
                        <div key={equipment.id} className="flex justify-between items-center p-4 border rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                              <Package className="w-5 h-5 text-gray-400" />
                            </div>
                            <div>
                              <h4 className="font-medium">{equipment.name}</h4>
                              <div className="flex items-center text-sm text-gray-600">
                                <MapPin className="w-3 h-3 mr-1" />
                                {equipment.location}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-green-600">£{equipment.price_per_day}/day</p>
                            <Badge variant={equipment.availability ? 'default' : 'outline'}>
                              {equipment.availability ? 'Available' : 'Unavailable'}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">No equipment listed yet</p>
                      <Link to={createPageUrl("ListEquipment")}>
                        <Button variant="outline" size="sm" className="mt-2">
                          List Equipment
                        </Button>
                      </Link>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {activeTab === "my_bookings" && (
          <Card className="shadow-lg border-0">
            <CardHeader>
              <CardTitle>My Bookings</CardTitle>
            </CardHeader>
            <CardContent>
              {myBookings.length > 0 ? (
                <div className="space-y-4">
                  {myBookings.map((booking) => (
                    <div key={booking.id} className="flex justify-between items-center p-6 border rounded-lg hover:shadow-md transition-shadow">
                      <div>
                        <h4 className="font-semibold">Booking #{booking.id.slice(0, 8)}</h4>
                        <p className="text-gray-600">
                          {format(new Date(booking.start_date), 'MMM d, yyyy')} - {format(new Date(booking.end_date), 'MMM d, yyyy')}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">{booking.total_days} days</p>
                      </div>
                      <div className="text-right">
                        <Badge className={getStatusColor(booking.status)}>
                          {booking.status}
                        </Badge>
                        <p className="font-semibold mt-2">£{booking.total_cost}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">No bookings yet</p>
                  <p className="text-gray-400 mb-6">Start browsing equipment to make your first booking</p>
                  <Link to={createPageUrl("Browse")}>
                    <Button>Browse Equipment</Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
