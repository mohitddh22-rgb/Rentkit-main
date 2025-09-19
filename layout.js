import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { User } from "@/entities/User";
import { 
  Search, 
  Plus, 
  User as UserIcon, 
  Settings, 
  LogOut,
  Menu,
  X,
  Hammer,
  MapPin
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

export default function Layout({ children, currentPageName }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const userData = await User.me();
      setUser(userData);
    } catch (error) {
      setUser(null);
    }
    setLoading(false);
  };

  const handleLogin = async () => {
    await User.loginWithRedirect(window.location.href);
  };

  const handleLogout = async () => {
    await User.logout();
    setUser(null);
  };

  const navigation = [
    { name: "Browse Equipment", href: createPageUrl("Browse"), icon: Search },
    { name: "How It Works", href: createPageUrl("HowItWorks"), icon: null },
  ];

  const userNavigation = user ? [
    { name: "My Dashboard", href: createPageUrl("Dashboard") },
    { name: "My Bookings", href: createPageUrl("MyBookings") },
    ...(user.user_type === 'owner' || user.user_type === 'both' 
      ? [{ name: "My Listings", href: createPageUrl("MyListings") }] 
      : []),
    { name: "Profile Settings", href: createPageUrl("Profile") },
  ] : [];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <style>
        {`
          :root {
            --primary-blue: #1e3a8a;
            --primary-green: #059669;
            --warm-gray: #6b7280;
            --light-gray: #f9fafb;
          }
        `}
      </style>

      {/* Navigation Header */}
      <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to={createPageUrl("Home")} className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg">
                <Hammer className="w-6 h-6 text-white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-gray-900">RentKit</h1>
                <p className="text-xs text-gray-500 -mt-1">UK Tool Rentals</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    location.pathname === item.href
                      ? "text-blue-700 bg-blue-50"
                      : "text-gray-700 hover:text-blue-700 hover:bg-blue-50"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* User Actions */}
            <div className="flex items-center space-x-4">
              {user && (user.user_type === 'owner' || user.user_type === 'both') && (
                <Link to={createPageUrl("ListEquipment")}>
                  <Button size="sm" className="bg-green-600 hover:bg-green-700 hidden sm:flex">
                    <Plus className="w-4 h-4 mr-2" />
                    List Equipment
                  </Button>
                </Link>
              )}

              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="flex items-center space-x-2">
                      <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                        <UserIcon className="w-4 h-4 text-blue-600" />
                      </div>
                      <span className="hidden sm:block font-medium">{user.full_name?.split(' ')[0]}</span>
                      {user.user_type === 'owner' && (
                        <Badge variant="outline" className="text-xs ml-1 bg-green-50 text-green-700">
                          Owner
                        </Badge>
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    {userNavigation.map((item) => (
                      <Link key={item.name} to={item.href}>
                        <DropdownMenuItem className="cursor-pointer">
                          {item.name}
                        </DropdownMenuItem>
                      </Link>
                    ))}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600">
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" onClick={handleLogin}>
                    Sign In
                  </Button>
                  <Button size="sm" onClick={handleLogin} className="bg-blue-600 hover:bg-blue-700">
                    Get Started
                  </Button>
                </div>
              )}

              {/* Mobile menu button */}
              <Button
                variant="ghost"
                size="sm"
                className="md:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100">
            <div className="px-4 py-4 space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="block px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-700 hover:bg-blue-50 rounded-lg"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              {user && userNavigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="block px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-700 hover:bg-blue-50 rounded-lg"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
                  <Hammer className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg font-bold text-gray-900">RentKit</span>
              </div>
              <p className="text-sm text-gray-600">
                The UK's premier marketplace for tool and equipment rentals. 
                Connecting tool owners with people who need them.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">For Renters</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><Link to={createPageUrl("Browse")} className="hover:text-blue-600">Browse Equipment</Link></li>
                <li><Link to={createPageUrl("HowItWorks")} className="hover:text-blue-600">How It Works</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-4">For Owners</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><Link to={createPageUrl("ListEquipment")} className="hover:text-blue-600">List Your Tools</Link></li>
                <li><Link to={createPageUrl("HowItWorks")} className="hover:text-blue-600">Earn Money</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Support</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="mailto:help@rentkit.co.uk" className="hover:text-blue-600">Contact Support</a></li>
                <li><a href="#" className="hover:text-blue-600">Safety Guidelines</a></li>
              </ul>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-gray-200 text-center text-sm text-gray-500">
            <p>&copy; 2024 RentKit. All rights reserved. Made for the UK market.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
