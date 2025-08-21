import { Card } from '@/components/ui/Card';
import { Award, Heart, Target, Users } from 'lucide-react';
import React from 'react';

const AboutPage: React.FC = () => {

  const values = [
    {
      icon: Users,
      title: 'Community First',
      description: 'We build technology that brings people together and strengthens communities.',
    },
    {
      icon: Target,
      title: 'Innovation',
      description: 'We constantly innovate to provide the best transportation experience.',
    },
    {
      icon: Heart,
      title: 'Safety & Trust',
      description: 'Every feature we build prioritizes the safety and trust of our users.',
    },
    {
      icon: Award,
      title: 'Excellence',
      description: 'We strive for excellence in every interaction and every ride.',
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-emerald-600 text-white py-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              About Let's Ride
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              We're on a mission to transform urban mobility by connecting riders and drivers 
              through innovative technology and exceptional service.
            </p>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center justify-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Our Story
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Founded in 2020, Let's Ride was born out of a simple idea: transportation should be 
                accessible, reliable, and safe for everyone. Our founders, experienced professionals 
                from the tech and transportation industries, saw an opportunity to create a platform 
                that truly serves both riders and drivers.
              </p>
              <p className="text-lg text-gray-600 mb-6">
                What started as a small team with a big vision has grown into a thriving community 
                of thousands of users across multiple cities. We've processed over 500,000 rides 
                and continue to expand our reach while maintaining our commitment to quality and safety.
              </p>
              <p className="text-lg text-gray-600">
                Today, we're proud to offer a platform that not only gets people where they need to 
                go but also provides flexible earning opportunities for drivers and contributes to 
                more sustainable urban transportation.
              </p>
            </div>
            <div>
              <img 
                src="/unnamedxzX.webp"
                alt="Let's Ride team working together"
                className="rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <Card variant="elevated" className="text-center">
              <div className="bg-blue-100 rounded-full p-6 w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                <Target className="h-10 w-10 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h3>
              <p className="text-gray-600">
                To provide safe, reliable, and affordable transportation solutions that connect 
                communities, empower drivers with flexible earning opportunities, and contribute 
                to sustainable urban mobility.
              </p>
            </Card>

            <Card variant="elevated" className="text-center">
              <div className="bg-emerald-100 rounded-full p-6 w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                <Heart className="h-10 w-10 text-emerald-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Vision</h3>
              <p className="text-gray-600">
                A world where transportation is seamless, accessible, and environmentally conscious. 
                Where technology serves humanity and creates opportunities for economic empowerment 
                and community building.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Values
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              These core values guide every decision we make and every feature we build.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="text-center">
                <div className="bg-blue-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <value.icon className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-emerald-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Our Impact in Numbers
            </h2>
            <p className="text-xl text-blue-100">
              Growing every day, making transportation better for everyone.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold mb-2">500K+</div>
              <div className="text-blue-200">Completed Rides</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold mb-2">50K+</div>
              <div className="text-blue-200">Active Riders</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold mb-2">10K+</div>
              <div className="text-blue-200">Driver Partners</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold mb-2">25+</div>
              <div className="text-blue-200">Cities Served</div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default AboutPage;