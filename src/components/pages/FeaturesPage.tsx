import
    {
        BarChart3,
        Bell,
        Clock,
        CreditCard,
        HeadphonesIcon,
        Lock,
        MapPin,
        Shield,
        Smartphone,
        Star,
        Users,
        Zap
    } from 'lucide-react';
import React from 'react';
import { Card } from '../ui/Card';

const FeaturesPage: React.FC = () => {
  const riderFeatures = [
    {
      icon: MapPin,
      title: 'Easy Booking',
      description: 'Book rides with just a few taps. Enter your destination and get matched with nearby drivers instantly.',
    },
    {
      icon: Clock,
      title: 'Real-time Tracking',
      description: 'Track your driver in real-time, get accurate arrival estimates, and never wonder where your ride is.',
    },
    {
      icon: CreditCard,
      title: 'Seamless Payments',
      description: 'Pay with credit cards, debit cards, or cash. No need to fumble for money at the end of your ride.',
    },
    {
      icon: Star,
      title: 'Rate & Review',
      description: 'Rate your driver and provide feedback to maintain high service quality across the platform.',
    },
    {
      icon: Shield,
      title: 'Safety First',
      description: 'SOS button, ride sharing with contacts, driver verification, and 24/7 support for your peace of mind.',
    },
    {
      icon: Bell,
      title: 'Smart Notifications',
      description: 'Get timely updates about your ride status, driver arrival, and trip completion.',
    },
  ];

  const driverFeatures = [
    {
      icon: Smartphone,
      title: 'Driver App',
      description: 'Intuitive driver app with easy navigation, ride requests, and earnings tracking.',
    },
    {
      icon: BarChart3,
      title: 'Earnings Dashboard',
      description: 'Track your daily, weekly, and monthly earnings with detailed breakdowns and insights.',
    },
    {
      icon: Users,
      title: 'Flexible Schedule',
      description: 'Work when you want, where you want. Go online and offline as per your availability.',
    },
    {
      icon: MapPin,
      title: 'Route Optimization',
      description: 'Get the best routes to pickup and drop-off locations to save time and fuel.',
    },
    {
      icon: Zap,
      title: 'Instant Payouts',
      description: 'Access your earnings instantly with fast and secure payout options.',
    },
    {
      icon: HeadphonesIcon,
      title: 'Driver Support',
      description: 'Dedicated support team for drivers with quick resolution of issues and queries.',
    },
  ];

  const adminFeatures = [
    {
      icon: Users,
      title: 'User Management',
      description: 'Comprehensive user management system to handle rider and driver accounts efficiently.',
    },
    {
      icon: BarChart3,
      title: 'Analytics Dashboard',
      description: 'Advanced analytics and reporting tools to track platform performance and user behavior.',
    },
    {
      icon: Shield,
      title: 'Safety Oversight',
      description: 'Monitor safety incidents, manage driver verification, and ensure platform security.',
    },
    {
      icon: CreditCard,
      title: 'Financial Management',
      description: 'Track revenue, manage payouts, handle billing, and oversee financial operations.',
    },
    {
      icon: Bell,
      title: 'System Monitoring',
      description: 'Real-time system monitoring, alert management, and performance optimization tools.',
    },
    {
      icon: Lock,
      title: 'Security Controls',
      description: 'Advanced security features, access controls, and fraud prevention mechanisms.',
    },
  ];

  const safetyFeatures = [
    {
      title: 'Driver Background Checks',
      description: 'All drivers undergo comprehensive background verification including criminal history and driving records.',
    },
    {
      title: 'Real-time GPS Tracking',
      description: 'Every ride is tracked in real-time with GPS technology for complete transparency and safety.',
    },
    {
      title: 'Emergency SOS Button',
      description: 'One-tap emergency assistance during rides with automatic location sharing to emergency contacts.',
    },
    {
      title: '24/7 Safety Support',
      description: 'Round-the-clock safety support team ready to assist with any concerns or emergencies.',
    },
    {
      title: 'Ride Sharing',
      description: 'Share your ride details with trusted contacts so they can track your journey in real-time.',
    },
    {
      title: 'Two-way Rating System',
      description: 'Both riders and drivers rate each other, ensuring accountability and quality service.',
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-emerald-600 text-white py-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Powerful Features
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Discover the comprehensive features that make RideFlow the best choice for 
              riders, drivers, and administrators.
            </p>
          </div>
        </div>
      </section>

      {/* Rider Features */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              For Riders
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need for a smooth, safe, and convenient ride experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {riderFeatures.map((feature, index) => (
              <Card key={index} variant="elevated" className="text-center">
                <div className="bg-blue-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <feature.icon className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Driver Features */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              For Drivers
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Powerful tools and features to help drivers maximize their earnings and manage their business.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {driverFeatures.map((feature, index) => (
              <Card key={index} variant="elevated" className="text-center">
                <div className="bg-emerald-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <feature.icon className="h-8 w-8 text-emerald-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Admin Features */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              For Administrators
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive management tools to oversee platform operations and ensure optimal performance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {adminFeatures.map((feature, index) => (
              <Card key={index} variant="elevated" className="text-center">
                <div className="bg-purple-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <feature.icon className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Safety Features */}
      <section className="py-20 bg-gradient-to-br from-emerald-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="bg-red-100 rounded-full p-6 w-20 h-20 mx-auto mb-6 flex items-center justify-center">
              <Shield className="h-10 w-10 text-red-600" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Safety & Security
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Your safety is our top priority. We've built comprehensive safety features into every aspect of the platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {safetyFeatures.map((feature, index) => (
              <Card key={index} className="text-center">
                <div className="bg-red-100 rounded-full p-3 w-12 h-12 mx-auto mb-4 flex items-center justify-center">
                  <Shield className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="text-lg font-semibold mb-3 text-gray-900">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Stack */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Built with Modern Technology
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Our platform is built using cutting-edge technology to ensure reliability, 
              scalability, and exceptional user experience.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-400 mb-2">React</div>
              <div className="text-gray-400">Frontend Framework</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-emerald-400 mb-2">Node.js</div>
              <div className="text-gray-400">Backend Runtime</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-400 mb-2">MongoDB</div>
              <div className="text-gray-400">Database</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-400 mb-2">AWS</div>
              <div className="text-gray-400">Cloud Platform</div>
            </div>
          </div>
        </div>
        <hr  className='bg-green-500 p-[0.1px] mt-10 w-[80%] mx-auto'/>
      </section>

    </div>
  );
};

export default FeaturesPage;