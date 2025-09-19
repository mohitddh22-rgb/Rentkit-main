import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Search, 
  Calendar, 
  Package, 
  PoundSterling,
  Shield,
  Users,
  CheckCircle,
  ArrowRight
} from "lucide-react";

export default function HowItWorks() {
  const renterSteps = [
    {
      icon: Search,
      title: "Browse & Search",
      description: "Find the perfect tools and equipment near you using our smart search filters"
    },
    {
      icon: Calendar,
      title: "Book Instantly",
      description: "Select your dates, choose pickup or delivery, and confirm your booking"
    },
    {
      icon: Package,
      title: "Collect & Use",
      description: "Pick up your equipment and get your project done safely"
    },
    {
      icon: CheckCircle,
      title: "Return & Review",
      description: "Return the equipment and leave a review for future renters"
    }
  ];

  const ownerSteps = [
    {
      icon: Package,
      title: "List Your Equipment",
      description: "Upload photos, set your price, and describe your tools in minutes"
    },
    {
      icon: Users,
      title: "Accept Bookings",
      description: "Review and approve rental requests from verified users"
    },
    {
      icon: PoundSterling,
      title: "Earn Money",
      description: "Keep 90% of the rental fee - we handle payments automatically"
    },
    {
      icon: Shield,
      title: "Stay Protected",
      description: "All rentals are insured and backed by our support team"
    }
  ];

  const benefits = [
    {
      icon: PoundSterling,
      title: "Save Money",
      description: "Rent tools when you need them instead of buying expensive equipment you'll rarely use"
    },
    {
      icon: Shield,
      title: "Fully Insured",
      description: "Every rental is covered by comprehensive insurance for complete peace of mind"
    },
    {
      icon: Users,
      title: "Verified Community",
      description: "All users are verified and reviewed to ensure a safe, trustworthy marketplace"
    }
  ];

  const StepCard = ({ step, index }) => (
    <Card className="shadow-lg border-0 hover:shadow-xl transition-shadow duration-300">
      <CardContent className="p-8 text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <step.icon className="w-8 h-8 text-white" />
        </div>
        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-blue-600 font-bold">{index + 1}</span>
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
        <p className="text-gray-600 leading-relaxed">{step.description}</p>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-6">How RentKit Works</h1>
          <p className="text-xl text-blue-100 mb-8 leading-relaxed max-w-2xl mx-auto">
            The UK's smartest way to access tools and equipment. 
            Whether you need to rent or want to earn money from your unused tools.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to={createPageUrl("Browse")}>
              <Button size="lg" variant="secondary" className="bg-white text-blue-700 hover:bg-gray-100">
                Start Renting
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link to={createPageUrl("ListEquipment")}>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                List Your Tools
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* For Renters */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">For Renters</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Get access to professional-grade tools without the huge upfront costs. 
              Perfect for DIY projects, home improvements, and professional jobs.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {renterSteps.map((step, index) => (
              <StepCard key={index} step={step} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* For Owners */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">For Tool Owners</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Turn your unused tools into a steady income stream. 
              List once and start earning from equipment sitting in your garage.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {ownerSteps.map((step, index) => (
              <StepCard key={index} step={step} index={index} />
            ))}
          </div>

          <div className="mt-16 text-center">
            <div className="bg-green-50 border border-green-200 rounded-2xl p-8 inline-block">
              <h3 className="text-2xl font-bold text-green-800 mb-2">Earn Up To £200+ Per Month</h3>
              <p className="text-green-700">
                Average owners earn £50-200 monthly from just 3-5 listings
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Why Choose RentKit?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We've built the most trusted and convenient tool rental platform in the UK
            </p>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-12">
            {benefits.map((benefit, index) => (
              <div key={index} className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <benefit.icon className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{benefit.title}</h3>
                <p className="text-gray-600 leading-relaxed text-lg">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to Get Started?</h2>
          <p className="text-xl text-blue-100 mb-10 leading-relaxed">
            Join thousands of UK users who are saving money and earning income through RentKit
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to={createPageUrl("Browse")}>
              <Button size="lg" variant="secondary" className="bg-white text-blue-700 hover:bg-gray-100">
                <Search className="w-5 h-5 mr-2" />
                Browse Equipment
              </Button>
            </Link>
            <Link to={createPageUrl("ListEquipment")}>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                <Package className="w-5 h-5 mr-2" />
                List Your Tools
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
