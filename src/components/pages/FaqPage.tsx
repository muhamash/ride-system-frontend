
import
    {
        Accordion,
        AccordionContent,
        AccordionItem,
        AccordionTrigger,
    } from '@/components/ui/accordion';
import { AnimatePresence, motion } from 'framer-motion';
import { Search } from 'lucide-react';
import React, { useState } from 'react';
import { Card } from '../ui/Card';
  
const FAQPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

    const faqCategories = [
        {
            title: 'General Questions',
            questions: [
                {
                    question: 'What is RideFlow?',
                    answer: 'RideFlow is a modern ride-sharing platform that connects riders with professional drivers. We provide safe, reliable, and affordable transportation services across multiple cities.',
                },
                {
                    question: 'How does RideFlow work?',
                    answer: 'Simply download our app, enter your pickup and destination locations, choose your ride type, and get matched with a nearby driver. You can track your ride in real-time and pay seamlessly through the app.',
                },
                {
                    question: 'Is RideFlow available in my city?',
                    answer: 'RideFlow is currently available in 25+ cities and expanding rapidly. Check our website or app to see if we\'re available in your area. We\'re constantly adding new cities based on demand.',
                },
            ],
        },
        {
            title: 'For Riders',
            questions: [
                {
                    question: 'How do I book a ride?',
                    answer: 'Open the RideFlow app, enter your pickup location and destination, select your preferred ride type, choose your payment method, and tap "Book Ride". You\'ll be matched with a nearby driver instantly.',
                },
                {
                    question: 'What payment methods do you accept?',
                    answer: 'We accept all major credit cards, debit cards, and cash payments. You can also use digital wallets like Apple Pay and Google Pay for quick and secure transactions.',
                },
                {
                    question: 'Can I schedule a ride in advance?',
                    answer: 'Yes! You can schedule rides up to 7 days in advance. Simply select the "Schedule for later" option when booking and choose your preferred date and time.',
                },
                {
                    question: 'What if I need to cancel my ride?',
                    answer: 'You can cancel your ride through the app. If you cancel before a driver is assigned, there\'s no fee. After a driver is assigned, cancellation fees may apply based on timing and local policies.',
                },
            ],
        },
        {
            title: 'For Drivers',
            questions: [
                {
                    question: 'How do I become a RideFlow driver?',
                    answer: 'To become a driver, you need to meet our requirements: be at least 21 years old, have a valid driver\'s license, pass a background check, and have an eligible vehicle. Apply through our website or app.',
                },
                {
                    question: 'What are the vehicle requirements?',
                    answer: 'Your vehicle must be 2010 or newer, pass a vehicle inspection, have valid registration and insurance, and seat at least 4 passengers including the driver.',
                },
                {
                    question: 'How much can I earn as a driver?',
                    answer: 'Earnings vary based on location, time of day, demand, and how often you drive. Drivers typically earn between $15-25 per hour before expenses. You keep 80% of each fare plus 100% of tips.',
                },
                {
                    question: 'Can I drive part-time?',
                    answer: 'Absolutely! RideFlow offers complete flexibility. You can drive whenever you want - full-time, part-time, weekends only, or just a few hours a day. You\'re in complete control of your schedule.',
                },
            ],
        },
        {
            title: 'Safety & Security',
            questions: [
                {
                    question: 'How do you ensure rider safety?',
                    answer: 'We conduct comprehensive background checks on all drivers, provide real-time GPS tracking, offer an emergency SOS button, enable ride sharing with contacts, and have 24/7 customer support.',
                },
                {
                    question: 'What should I do in case of an emergency?',
                    answer: 'Use the SOS button in the app to immediately alert emergency services and your emergency contacts. The app will automatically share your location. You can also call 911 directly if needed.',
                },
                {
                    question: 'How are drivers screened?',
                    answer: 'All drivers undergo multi-step screening including background checks, driving record verification, identity verification, and vehicle inspection. We continuously monitor driver performance and safety.',
                },
                {
                    question: 'Can I share my ride details with others?',
                    answer: 'Yes! You can share your trip details with trusted contacts through the app. They can track your ride in real-time and receive notifications when you reach your destination safely.',
                },
            ],
        },
        {
            title: 'Billing & Payments',
            questions: [
                {
                    question: 'How is the fare calculated?',
                    answer: 'Fares are calculated based on time, distance, demand, and ride type. You\'ll see an upfront fare estimate before booking. The final fare may vary slightly based on actual time and route taken.',
                },
                {
                    question: 'Do I need to tip my driver?',
                    answer: 'Tipping is optional but appreciated. You can add a tip through the app after your ride. Tips go 100% to the driver and help support their income.',
                },
                {
                    question: 'What if I\'m charged incorrectly?',
                    answer: 'If you believe you were charged incorrectly, contact our support team through the app. We\'ll review your ride details and issue a refund if there was an error.',
                },
                {
                    question: 'Can I get a receipt for my ride?',
                    answer: 'Yes! Receipts are automatically sent to your email after each ride. You can also access all your ride receipts in the app\'s trip history section.',
                },
            ],
        },
    ];

  const filteredFAQs = faqCategories
    .map((category) => ({
      ...category,
      questions: category.questions.filter(
        (q) =>
          q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
          q.answer.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    }))
    .filter((category) => category.questions.length > 0);

    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-emerald-600 text-white py-30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl md:text-6xl font-bold mb-6">
                        Frequently Asked Questions
                    </h1>
                    <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-8">
                        Find answers to common questions about RideFlow. Can't find what you're looking for? Contact our support team.
                    </p>
                    <div className="max-w-lg mx-auto">
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={( e ) => setSearchTerm( e.target.value )}
                                className="w-full pl-12 pr-4 py-4 text-gray-900 bg-white rounded-lg border-0 focus:ring-2 focus:ring-blue-300 focus:ring-offset-2 focus:ring-offset-blue-600"
                                placeholder="Search FAQs..."
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ Content */}
            <section className="py-20 bg-gray-50">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    {filteredFAQs.length === 0 ? (
                        <Card className="text-center py-12">
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                No results found
                            </h3>
                            <p className="text-gray-600">
                                Try searching with different keywords or browse all categories below.
                            </p>
                        </Card>
                    ) : (
                        <div className="space-y-8">
                            {filteredFAQs.map( ( category, categoryIndex ) => (
                                <Card key={categoryIndex}>
                                    <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-4 border-b border-gray-200 mx-3">
                                        {category.title}
                                    </h2>
                                    <Accordion type="single" collapsible className="w-full">
                                        {category.questions.map( ( faq, faqIndex ) => (
                                            <AccordionItem
                                                key={faqIndex}
                                                value={`item-${ categoryIndex }-${ faqIndex }`}
                                                className="border border-gray-200 rounded-lg overflow-hidden m-3 shadow-sm"
                                            >
                                                <AccordionTrigger
                                                    className="flex w-full justify-between items-center p-4 text-lg font-medium text-gray-900 bg-white hover:bg-gray-50 transition-colors duration-200 rounded-t-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                >
                                                    {faq.question}
                                                </AccordionTrigger>
                                                <AccordionContent className="bg-gray-50 px-4 pb-4 text-gray-700 leading-relaxed">
                                                    <AnimatePresence>
                                                        <motion.p
                                                            initial={{ opacity: 0, height: 0 }}
                                                            animate={{ opacity: 1, height: "auto" }}
                                                            exit={{ opacity: 0, height: 0 }}
                                                            transition={{ duration: 0.3, ease: "easeInOut" }}
                                                        >
                                                            {faq.answer}
                                                        </motion.p>
                                                    </AnimatePresence>
                                                </AccordionContent>
                                            </AccordionItem>

                                        ) )}
                                    </Accordion>
                                </Card>
                            ) )}
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};

export default FAQPage;