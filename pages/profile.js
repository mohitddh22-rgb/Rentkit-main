
import React, { useState, useEffect, useCallback } from "react";
import { User } from "@/entities/User";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  User as UserIcon,
  Mail,
  MapPin,
  Phone,
  Settings,
  Shield
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    user_type: "renter",
    location: "",
    phone_number: "",
    bio: ""
  });

  const loadUserData = useCallback(async () => {
    try {
      const userData = await User.me();
      setUser(userData);
      setFormData({
        user_type: userData.user_type || "renter",
        location: userData.location || "",
        phone_number: userData.phone_number || "",
        bio: userData.bio || ""
      });
    } catch (error) {
      navigate(createPageUrl("Home"));
    }
    setLoading(false);
  }, [navigate]);

  useEffect(() => {
    loadUserData();
  }, [loadUserData]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setError("");
    setSuccess("");
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      await User.updateMyUserData(formData);
      setSuccess("Profile updated successfully!");
      
      // Reload user data
      setTimeout(() => {
        loadUserData();
        setSuccess("");
      }, 2000);
    } catch (error) {
      setError("Failed to update profile. Please try again.");
    }
    setSaving(false);
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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
            <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
            <p className="text-gray-600 mt-1">Manage your account information and preferences</p>
          </div>
        </div>

        {success && (
          <Alert className="mb-6 border-green-200 bg-green-50">
            <AlertDescription className="text-green-800">{success}</AlertDescription>
          </Alert>
        )}

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile Summary */}
          <div className="lg:col-span-1">
            <Card className="shadow-lg border-0">
              <CardHeader className="text-center">
                <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <UserIcon className="w-12 h-12 text-blue-600" />
                </div>
                <CardTitle className="text-xl">{user.full_name}</CardTitle>
                <p className="text-gray-600">{user.email}</p>
                <div className="flex items-center justify-center mt-2">
                  {user.verified ? (
                    <div className="flex items-center text-green-600">
                      <Shield className="w-4 h-4 mr-1" />
                      <span className="text-sm">Verified User</span>
                    </div>
                  ) : (
                    <div className="flex items-center text-gray-500">
                      <Shield className="w-4 h-4 mr-1" />
                      <span className="text-sm">Not Verified</span>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center">
                    <Mail className="w-4 h-4 text-gray-400 mr-2" />
                    <span className="text-gray-600">Email verified</span>
                  </div>
                  <div className="flex items-center">
                    <Settings className="w-4 h-4 text-gray-400 mr-2" />
                    <span className="text-gray-600">Account type: {user.user_type}</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 text-gray-400 mr-2" />
                    <span className="text-gray-600">
                      {user.location || 'Location not set'}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Profile Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSave} className="space-y-6">
              {/* Basic Information */}
              <Card className="shadow-lg border-0">
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Full Name</Label>
                      <Input 
                        value={user.full_name} 
                        disabled 
                        className="bg-gray-50"
                      />
                      <p className="text-xs text-gray-500">
                        Name cannot be changed (from Google account)
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label>Email Address</Label>
                      <Input 
                        value={user.email} 
                        disabled 
                        className="bg-gray-50"
                      />
                      <p className="text-xs text-gray-500">
                        Email cannot be changed
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="user_type">Account Type</Label>
                    <Select 
                      value={formData.user_type} 
                      onValueChange={(value) => handleInputChange('user_type', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="renter">Renter Only</SelectItem>
                        <SelectItem value="owner">Owner Only</SelectItem>
                        <SelectItem value="both">Both Renter & Owner</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-gray-500">
                      Choose 'Both' if you want to rent and list equipment
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Contact Information */}
              <Card className="shadow-lg border-0">
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        id="location"
                        placeholder="e.g. London, Manchester, Birmingham"
                        value={formData.location}
                        onChange={(e) => handleInputChange('location', e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <p className="text-xs text-gray-500">
                      This helps others find equipment near them
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone_number">Phone Number</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        id="phone_number"
                        placeholder="e.g. +44 7700 900123"
                        value={formData.phone_number}
                        onChange={(e) => handleInputChange('phone_number', e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <p className="text-xs text-gray-500">
                      Used for booking confirmations and communication
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio (Optional)</Label>
                    <Textarea
                      id="bio"
                      placeholder="Tell others a bit about yourself, your profession, or why you're using RentKit..."
                      value={formData.bio}
                      onChange={(e) => handleInputChange('bio', e.target.value)}
                      className="h-24"
                    />
                    <p className="text-xs text-gray-500">
                      This helps build trust with other users
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Save Button */}
              <div className="flex justify-end">
                <Button 
                  type="submit" 
                  disabled={saving}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
