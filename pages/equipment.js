
import React, { useState, useEffect, useCallback } from "react";
import { Equipment as EquipmentEntity } from "@/entities/Equipment";
import { User } from "@/entities/User";
import { Booking } from "@/entities/Booking";
import { Review } from "@/entities/Review";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar } from "@/components/ui/calendar";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  ArrowLeft, 
  MapPin, 
  Star, 
  Shield, 
  Calendar as CalendarIcon,
  User as UserIcon,
  PoundSterling,
  Clock,
  Package,
  CheckCircle,
  MessageCircle
} from "lucide-react";
import { format, addDays, differenceInDays } from "date-fns";

export default function Equipment() {
  const navigate = useNavigate();
  const [equipment, setEquipment] = useState(null);
  const [owner, setOwner] = useState(null);
  const [user, setUser] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [selectedStartDate, setSelectedStartDate] = useState(null);
  const [selectedEndDate, setSelectedEndDate] = useState(null);
  const [pickupMethod, setPickupMethod] = useState("collection");
  const [notes, setNotes] = useState("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const loadEquipmentData = useCallback(async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const equipmentId = urlParams.get('id');

    if (!equipmentId) {
      navigate(createPageUrl("Browse"));
      return;
    }

    try {
      const equipmentData = await EquipmentEntity.list();
      const foundEquipment = equipmentData.find(e => e.id === equipmentId);
      
      if (!foundEquipment) {
        navigate(createPageUrl("Browse"));
        return;
      }

      setEquipment(foundEquipment);

      // Load owner data
      const userData = await User.list();
      const ownerData = userData.find(u => u.id === foundEquipment.owner_id);
      setOwner(ownerData);

      // Load reviews
      const reviewsData = await Review.list();
      const equipmentReviews = reviewsData.filter(r => r.equipment_id === equipmentId);
      setReviews(equipmentReviews);

      // Load current user
      try {
        const currentUser = await User.me();
        setUser(currentUser);
      } catch (error) {
        setUser(null);
      }
    } catch (error) {
      console.error("Error loading equipment:", error);
    }
    setLoading(false);
  }, [navigate]);

  useEffect(() => {
    loadEquipmentData();
  }, [loadEquipmentData]);

  const calculateTotalCost = () => {
    if (!selectedStartDate || !selectedEndDate || !equipment) return 0;
    
    const days = differenceInDays(selectedEndDate, selectedStartDate) + 1;
    const subtotal = days * equipment.price_per_day;
    const platformFee = subtotal * 0.1;
    return subtotal + platformFee;
  };

  const handleBooking = async () => {
    if (!user) {
      await User.loginWithRedirect(window.location.href);
      return;
    }

    if (!selectedStartDate || !selectedEndDate) {
      alert("Please select rental dates");
      return;
    }

    setBookingLoading(true);
    try {
      const days = differenceInDays(selectedEndDate, selectedStartDate) + 1;
      const subtotal = days * equipment.price_per_day;
      const platformFee = subtotal * 0.1;
      const totalCost = subtotal + platformFee;
      const ownerEarnings = subtotal - (subtotal * 0.1);

      const bookingData = {
        equipment_id: equipment.id,
        renter_id: user.id,
        owner_id: equipment.owner_id,
        start_date: format(selectedStartDate, 'yyyy-MM-dd'),
        end_date: format(selectedEndDate, 'yyyy-MM-dd'),
        total_days: days,
        daily_rate: equipment.price_per_day,
        subtotal: subtotal,
        platform_fee: platformFee,
        total_cost: totalCost,
        owner_earnings: ownerEarnings,
        status: "pending",
        pickup_method: pickupMethod,
        notes: notes
      };

      await Booking.create(bookingData);
      navigate(createPageUrl("MyBookings"));
    } catch (error) {
      console.error("Error creating booking:", error);
      alert("Failed to create booking. Please try again.");
    }
    setBookingLoading(false);
  };

  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
    : 4.8;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!equipment) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Equipment Not Found</h2>
          <Button onClick={() => navigate(createPageUrl("Browse"))}>
            Back to Browse
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Button
          variant="outline"
          onClick={() => navigate(createPageUrl("Browse"))}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Browse
        </Button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Images */}
            <Card className="shadow-lg border-0">
              <CardContent className="p-0">
                <div className="aspect-[4/3] bg-gray-100 rounded-t-xl overflow-hidden relative">
                  {equipment.images && equipment.images.length > 0 ? (
                    <>
                      <img
                        src={equipment.images[currentImageIndex]}
                        alt={equipment.name}
                        className="w-full h-full object-cover"
                      />
                      {equipment.images.length > 1 && (
                        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                          {equipment.images.map((_, index) => (
                            <button
                              key={index}
                              onClick={() => setCurrentImageIndex(index)}
                              className={`w-3 h-3 rounded-full ${
                                index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                              }`}
                            />
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package className="w-24 h-24 text-gray-300" />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Equipment Details */}
            <Card className="shadow-lg border-0">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-2xl font-bold mb-2">{equipment.name}</CardTitle>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      {equipment.brand && (
                        <Badge variant="outline">{equipment.brand}</Badge>
                      )}
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                        {averageRating.toFixed(1)} ({reviews.length} reviews)
                      </div>
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        {equipment.location}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-green-600">
                      £{equipment.price_per_day}
                    </div>
                    <div className="text-sm text-gray-500">per day</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-3">Description</h3>
                  <p className="text-gray-700 leading-relaxed">{equipment.description}</p>
                </div>

                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-3">Specifications</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Condition:</span>
                        <Badge variant={equipment.condition === 'excellent' ? 'default' : 'outline'}>
                          {equipment.condition}
                        </Badge>
                      </div>
                      {equipment.model && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Model:</span>
                          <span className="font-medium">{equipment.model}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-gray-600">Min Rental:</span>
                        <span className="font-medium">{equipment.min_rental_days} days</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Max Rental:</span>
                        <span className="font-medium">{equipment.max_rental_days} days</span>
                      </div>
                      {equipment.deposit_required > 0 && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Security Deposit:</span>
                          <span className="font-medium">£{equipment.deposit_required}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-3">Safety & Insurance</h3>
                    <div className="space-y-3">
                      <div className="flex items-center text-sm">
                        <Shield className="w-4 h-4 text-green-600 mr-2" />
                        <span>Fully insured rental</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                        <span>Equipment safety tested</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <MessageCircle className="w-4 h-4 text-green-600 mr-2" />
                        <span>24/7 customer support</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Owner Info */}
            {owner && (
              <Card className="shadow-lg border-0">
                <CardHeader>
                  <CardTitle>Equipment Owner</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-4">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={owner.profile_image} />
                      <AvatarFallback>
                        <UserIcon className="w-6 h-6" />
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-semibold">{owner.full_name}</h4>
                      <p className="text-sm text-gray-600">{owner.location}</p>
                      {owner.verified && (
                        <div className="flex items-center mt-1">
                          <CheckCircle className="w-4 h-4 text-green-600 mr-1" />
                          <span className="text-sm text-green-600">Verified Owner</span>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8 shadow-lg border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarIcon className="w-5 h-5" />
                  Book This Equipment
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Date Selection */}
                <div>
                  <Label className="text-sm font-medium mb-2 block">Select Rental Dates</Label>
                  <Calendar
                    mode="range"
                    selected={{
                      from: selectedStartDate,
                      to: selectedEndDate
                    }}
                    onSelect={(range) => {
                      setSelectedStartDate(range?.from);
                      setSelectedEndDate(range?.to);
                    }}
                    disabled={(date) => date < new Date()}
                    className="rounded-md border"
                  />
                </div>

                {/* Pickup Method */}
                <div>
                  <Label className="text-sm font-medium mb-2 block">Pickup Method</Label>
                  <Select value={pickupMethod} onValueChange={setPickupMethod}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="collection">Collection from Owner</SelectItem>
                      <SelectItem value="delivery">Delivery (if available)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Notes */}
                <div>
                  <Label className="text-sm font-medium mb-2 block">Additional Notes</Label>
                  <Textarea
                    placeholder="Any special requirements or questions..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="h-20"
                  />
                </div>

                {/* Cost Breakdown */}
                {selectedStartDate && selectedEndDate && (
                  <div className="border-t pt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>
                        £{equipment.price_per_day} x {differenceInDays(selectedEndDate, selectedStartDate) + 1} days
                      </span>
                      <span>£{((differenceInDays(selectedEndDate, selectedStartDate) + 1) * equipment.price_per_day).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Platform fee (10%)</span>
                      <span>£{(((differenceInDays(selectedEndDate, selectedStartDate) + 1) * equipment.price_per_day) * 0.1).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg border-t pt-2">
                      <span>Total</span>
                      <span className="text-green-600">£{calculateTotalCost().toFixed(2)}</span>
                    </div>
                  </div>
                )}

                {/* Book Button */}
                <Button
                  onClick={handleBooking}
                  disabled={!selectedStartDate || !selectedEndDate || bookingLoading || (user && user.id === equipment.owner_id)}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  {bookingLoading ? "Processing..." : 
                   user && user.id === equipment.owner_id ? "You own this equipment" :
                   !user ? "Sign In to Book" : "Book Now"}
                </Button>

                <div className="flex items-center justify-center text-sm text-gray-500">
                  <Clock className="w-4 h-4 mr-1" />
                  Free cancellation within 24 hours
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
