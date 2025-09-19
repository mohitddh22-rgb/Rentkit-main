
import React, { useState, useEffect, useCallback } from "react";
import { Equipment } from "@/entities/Equipment";
import { User } from "@/entities/User";
import { UploadFile } from "@/integrations/Core";
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
  Upload, 
  X, 
  Camera, 
  ArrowLeft,
  PoundSterling,
  MapPin,
  Package
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function ListEquipment() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    price_per_day: "",
    location: "",
    postcode: "",
    brand: "",
    model: "",
    condition: "good",
    deposit_required: "",
    min_rental_days: "1",
    max_rental_days: "30",
    images: []
  });

  const categories = [
    { value: "power_tools", label: "Power Tools" },
    { value: "hand_tools", label: "Hand Tools" },
    { value: "garden_tools", label: "Garden Tools" },
    { value: "construction", label: "Construction Equipment" },
    { value: "automotive", label: "Automotive Tools" },
    { value: "cleaning", label: "Cleaning Equipment" },
    { value: "ladders_access", label: "Ladders & Access" },
    { value: "measuring", label: "Measuring Tools" },
    { value: "safety", label: "Safety Equipment" },
    { value: "other", label: "Other" }
  ];

  const conditions = [
    { value: "excellent", label: "Excellent - Like new" },
    { value: "very_good", label: "Very Good - Minor wear" },
    { value: "good", label: "Good - Some wear" },
    { value: "fair", label: "Fair - Well used" }
  ];

  const loadUser = useCallback(async () => {
    try {
      const userData = await User.me();
      setUser(userData);
      
      // Auto-fill location if user has it
      if (userData.location) {
        setFormData(prev => ({
          ...prev,
          location: userData.location
        }));
      }
    } catch (error) {
      navigate(createPageUrl("Home"));
    }
    setLoading(false);
  }, [navigate]); // navigate is a dependency because it's used inside loadUser

  useEffect(() => {
    loadUser();
  }, [loadUser]); // loadUser is a dependency because it's called inside useEffect

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setError("");
  };

  const handleImageUpload = async (files) => {
    if (formData.images.length + files.length > 5) {
      setError("Maximum 5 images allowed");
      return;
    }

    setUploadingImages(true);
    try {
      const uploadPromises = Array.from(files).map(file => UploadFile({ file }));
      const results = await Promise.all(uploadPromises);
      const newImageUrls = results.map(result => result.file_url);
      
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...newImageUrls]
      }));
    } catch (error) {
      setError("Failed to upload images. Please try again.");
    }
    setUploadingImages(false);
  };

  const removeImage = (indexToRemove) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, index) => index !== indexToRemove)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    // Validation
    if (!formData.name || !formData.description || !formData.category || 
        !formData.price_per_day || !formData.location) {
      setError("Please fill in all required fields");
      setSubmitting(false);
      return;
    }

    if (formData.images.length === 0) {
      setError("Please upload at least one image");
      setSubmitting(false);
      return;
    }

    try {
      const equipmentData = {
        ...formData,
        price_per_day: parseFloat(formData.price_per_day),
        deposit_required: parseFloat(formData.deposit_required) || 0,
        min_rental_days: parseInt(formData.min_rental_days),
        max_rental_days: parseInt(formData.max_rental_days),
        owner_id: user.id
      };

      await Equipment.create(equipmentData);
      setSuccess("Equipment listed successfully!");
      
      setTimeout(() => {
        navigate(createPageUrl("MyListings"));
      }, 2000);
    } catch (error) {
      setError("Failed to create listing. Please try again.");
    }
    setSubmitting(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
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
            <h1 className="text-3xl font-bold text-gray-900">List Your Equipment</h1>
            <p className="text-gray-600 mt-1">Create a new rental listing and start earning</p>
          </div>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="mb-6 border-green-200 bg-green-50">
            <AlertDescription className="text-green-800">{success}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <Card className="shadow-lg border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="w-5 h-5" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Equipment Name *</Label>
                  <Input
                    id="name"
                    placeholder="e.g. Bosch Professional Drill"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Detailed description of your equipment, its condition, what it's used for, and any accessories included..."
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  className="h-32"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="brand">Brand</Label>
                  <Input
                    id="brand"
                    placeholder="e.g. Bosch, DeWalt, Makita"
                    value={formData.brand}
                    onChange={(e) => handleInputChange('brand', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="model">Model</Label>
                  <Input
                    id="model"
                    placeholder="e.g. GSB 18V-85 C"
                    value={formData.model}
                    onChange={(e) => handleInputChange('model', e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="condition">Condition *</Label>
                <Select value={formData.condition} onValueChange={(value) => handleInputChange('condition', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select condition" />
                  </SelectTrigger>
                  <SelectContent>
                    {conditions.map((condition) => (
                      <SelectItem key={condition.value} value={condition.value}>
                        {condition.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Images */}
          <Card className="shadow-lg border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="w-5 h-5" />
                Photos (Max 5)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e.target.files)}
                    className="hidden"
                    id="image-upload"
                  />
                  <label htmlFor="image-upload" className="cursor-pointer">
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-lg font-medium text-gray-700 mb-2">
                      {uploadingImages ? "Uploading..." : "Upload Photos"}
                    </p>
                    <p className="text-sm text-gray-500">
                      Click to select images or drag and drop (JPG, PNG)
                    </p>
                  </label>
                </div>

                {formData.images.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                    {formData.images.map((imageUrl, index) => (
                      <div key={index} className="relative">
                        <img
                          src={imageUrl}
                          alt={`Equipment ${index + 1}`}
                          className="w-full aspect-square object-cover rounded-lg"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute -top-2 -right-2 h-6 w-6"
                          onClick={() => removeImage(index)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Location & Pricing */}
          <Card className="shadow-lg border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PoundSterling className="w-5 h-5" />
                Location & Pricing
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="location">Location *</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="location"
                      placeholder="e.g. Manchester, London"
                      value={formData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="postcode">Postcode</Label>
                  <Input
                    id="postcode"
                    placeholder="e.g. M1 1AA"
                    value={formData.postcode}
                    onChange={(e) => handleInputChange('postcode', e.target.value)}
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="price_per_day">Daily Rate (£) *</Label>
                  <div className="relative">
                    <PoundSterling className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="price_per_day"
                      type="number"
                      min="1"
                      step="0.01"
                      placeholder="25.00"
                      value={formData.price_per_day}
                      onChange={(e) => handleInputChange('price_per_day', e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="deposit_required">Security Deposit (£)</Label>
                  <div className="relative">
                    <PoundSterling className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="deposit_required"
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="50.00"
                      value={formData.deposit_required}
                      onChange={(e) => handleInputChange('deposit_required', e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="min_rental_days">Minimum Rental (days)</Label>
                  <Input
                    id="min_rental_days"
                    type="number"
                    min="1"
                    value={formData.min_rental_days}
                    onChange={(e) => handleInputChange('min_rental_days', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="max_rental_days">Maximum Rental (days)</Label>
                  <Input
                    id="max_rental_days"
                    type="number"
                    min="1"
                    value={formData.max_rental_days}
                    onChange={(e) => handleInputChange('max_rental_days', e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Submit */}
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(createPageUrl("Dashboard"))}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-green-600 hover:bg-green-700"
              disabled={submitting || uploadingImages}
            >
              {submitting ? "Creating Listing..." : "List Equipment"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
