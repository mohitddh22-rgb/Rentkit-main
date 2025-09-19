
import React, { useState, useEffect, useCallback } from "react";
import { User } from "@/entities/User";
import { Equipment } from "@/entities/Equipment";
import { Booking } from "@/entities/Booking";
import { Link, useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowLeft,
  Calendar,
  MapPin,
  Package,
  Clock,
  PoundSterling,
  User as UserIcon,
  Phone,
  Mail
} from "lucide-react";
import { format } from "date-fns";

export default function MyBookings() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [equipment, setEquipment] = useState({});
  const [owners, setOwners] = useState({});
  const [loading, setLoading] = useState(true);

  const loadBookingsData = useCallback(async () => {
    try {
      const userData = await User.me();
      setUser(userData);

      // Load bookings
      const bookingsData = await Booking.list("-created_date");
      const userBookings = bookingsData.filter(b => b.renter_id === userData.id);
      setBookings(userBookings);

      // Load equipment data
      const equipmentData = await Equipment.list();
      const equipmentMap = {};
      equipmentData.forEach(e => {
        equipmentMap[e.id] = e;
      });
      setEquipment(equipmentMap);

      // Load owner data
      const usersData = await User.list();
      const ownersMap = {};
      usersData.forEach(u => {
        ownersMap[u.id] = u;
      });
      setOwners(ownersMap);

    } catch (error) {
      console.error("Error loading bookings data:", error);
      navigate(createPageUrl("Home"));
    }
    setLoading(false);
  }, [navigate]);

  useEffect(() => {
    loadBookingsData();
  }, [loadBookingsData]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'confirmed': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'active': return 'bg-green-100 text-green-800 border-green-200';
      case 'completed': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusDescription = (status) => {
    switch (status) {
      case 'pending': return 'Waiting for owner confirmation';
      case 'confirmed': return 'Confirmed and ready for pickup';
      case 'active': return 'Currently rented';
      case 'completed': return 'Rental completed successfully';
      case 'cancelled': return 'Booking was cancelled';
      default: return '';
    }
  };

  const filterBookingsByStatus = (status) => {
    if (status === 'all') return bookings;
    if (status === 'upcoming') return bookings.filter(b => ['pending', 'confirmed'].includes(b.status));
    if (status === 'current') return bookings.filter(b => b.status === 'active');
    if (status === 'past') return bookings.filter(b => ['completed', 'cancelled'].includes(b.status));
    return bookings;
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

  const BookingCard = ({ booking }) => {
    const equipmentData = equipment[booking.equipment_id];
    const ownerData = owners[booking.owner_id];

    return (
      <Card className="shadow-lg border-0 hover:shadow-xl transition-shadow duration-300">
        <CardContent className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-start space-x-4">
              <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0">
                {equipmentData?.images?.[0] ? (
                  <img 
                    src={equipmentData.images[0]} 
                    alt={equipmentData.name}
                    className="w-full h-full object-cover rounded-xl"
                  />
                ) : (
                  <Package className="w-8 h-8 text-gray-400" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-lg font-semibold text-gray-900 truncate">
                  {equipmentData?.name || 'Equipment'}
                </h3>
                <div className="flex items-center text-gray-500 text-sm mt-1">
                  <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
                  <span className="truncate">{equipmentData?.location}</span>
                </div>
                <div className="flex items-center text-sm text-gray-500 text-sm mt-1">
                  <UserIcon className="w-4 h-4 mr-1 flex-shrink-0" />
                  <span className="truncate">{ownerData?.full_name}</span>
                </div>
              </div>
            </div>
            <Badge className={`${getStatusColor(booking.status)} border`}>
              {booking.status}
            </Badge>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            <div className="space-y-2">
              <div className="flex items-center text-sm text-gray-600">
                <Calendar className="w-4 h-4 mr-2 flex-shrink-0" />
                <span>Start: {format(new Date(booking.start_date), 'MMM d, yyyy')}</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Calendar className="w-4 h-4 mr-2 flex-shrink-0" />
                <span>End: {format(new Date(booking.end_date), 'MMM d, yyyy')}</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Clock className="w-4 h-4 mr-2 flex-shrink-0" />
                <span>{booking.total_days} days</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center text-sm text-gray-600">
                <PoundSterling className="w-4 h-4 mr-2 flex-shrink-0" />
                <span>Daily Rate: £{booking.daily_rate}</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <PoundSterling className="w-4 h-4 mr-2 flex-shrink-0" />
                <span>Platform Fee: £{booking.platform_fee}</span>
              </div>
              <div className="flex items-center text-lg font-bold text-green-600">
                <PoundSterling className="w-5 h-5 mr-2 flex-shrink-0" />
                <span>Total: £{booking.total_cost}</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-3 mb-4">
            <p className="text-sm text-gray-600 font-medium">Status: {getStatusDescription(booking.status)}</p>
            {booking.pickup_method && (
              <p className="text-sm text-gray-600 mt-1">
                Pickup: {booking.pickup_method === 'collection' ? 'Collection from owner' : 'Delivery'}
              </p>
            )}
            {booking.notes && (
              <p className="text-sm text-gray-600 mt-2">Notes: {booking.notes}</p>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            {equipmentData && (
              <Link to={createPageUrl(`Equipment?id=${equipmentData.id}`)} className="flex-1">
                <Button variant="outline" className="w-full">View Equipment</Button>
              </Link>
            )}
            
            {ownerData && booking.status === 'confirmed' && (
              <div className="flex gap-2 flex-1">
                {ownerData.phone_number && (
                  <a href={`tel:${ownerData.phone_number}`} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full">
                      <Phone className="w-4 h-4 mr-2" />
                      Call
                    </Button>
                  </a>
                )}
                <a href={`mailto:${ownerData.email}`} className="flex-1">
                  <Button variant="outline" size="sm" className="w-full">
                    <Mail className="w-4 h-4 mr-2" />
                    Email
                  </Button>
                </a>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate(createPageUrl("Dashboard"))}
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
            <p className="text-gray-600 mt-1">Track your equipment rentals and bookings</p>
          </div>
        </div>

        {bookings.length === 0 ? (
          <Card className="shadow-lg border-0">
            <CardContent className="p-12 text-center">
              <Calendar className="w-20 h-20 text-gray-300 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-gray-900 mb-4">No bookings yet</h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                You haven't made any equipment bookings yet. Start browsing our marketplace to find the tools you need.
              </p>
              <Link to={createPageUrl("Browse")}>
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                  Browse Equipment
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <Tabs defaultValue="all" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 lg:w-[600px]">
              <TabsTrigger value="all">All ({bookings.length})</TabsTrigger>
              <TabsTrigger value="upcoming">Upcoming ({filterBookingsByStatus('upcoming').length})</TabsTrigger>
              <TabsTrigger value="current">Current ({filterBookingsByStatus('current').length})</TabsTrigger>
              <TabsTrigger value="past">Past ({filterBookingsByStatus('past').length})</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-6">
              {filterBookingsByStatus('all').map((booking) => (
                <BookingCard key={booking.id} booking={booking} />
              ))}
            </TabsContent>

            <TabsContent value="upcoming" className="space-y-6">
              {filterBookingsByStatus('upcoming').length > 0 ? (
                filterBookingsByStatus('upcoming').map((booking) => (
                  <BookingCard key={booking.id} booking={booking} />
                ))
              ) : (
                <div className="text-center py-12">
                  <Clock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No upcoming bookings</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="current" className="space-y-6">
              {filterBookingsByStatus('current').length > 0 ? (
                filterBookingsByStatus('current').map((booking) => (
                  <BookingCard key={booking.id} booking={booking} />
                ))
              ) : (
                <div className="text-center py-12">
                  <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No current rentals</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="past" className="space-y-6">
              {filterBookingsByStatus('past').length > 0 ? (
                filterBookingsByStatus('past').map((booking) => (
                  <BookingCard key={booking.id} booking={booking} />
                ))
              ) : (
                <div className="text-center py-12">
                  <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No past bookings</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
}
