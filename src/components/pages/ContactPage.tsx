'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { zodResolver } from '@hookform/resolvers/zod';
import { Briefcase, Mail, MessageSquare, User } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useMyToast } from '../layouts/MyToast';

const contactSchema = z.object({
  name: z.string().nonempty('Name is required'),
  email: z.string().email('Invalid email'),
  subject: z.string().nonempty('Subject is required'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
  category: z.string().nonempty('Please select a category'),
});

type ContactFormValues = z.infer<typeof contactSchema>;

export default function ContactPage() {
    const [ isLoading, setIsLoading ] = useState( false );
    const { showToast } = useMyToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: '',
      email: '',
      subject: '',
      message: '',
      category: '',
    },
  });

  const onSubmit = async (data: ContactFormValues) => {
    setIsLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    showToast({
      title: 'Message Sent!',
      description: `Thanks for reaching out, ${data.name}. We'll get back to you soon.`,
    });

    setIsLoading(false);
    reset();
  };

  const categories = [
    { value: 'general', label: 'General Inquiry', color: 'bg-blue-100 text-blue-600', icon: User },
    { value: 'support', label: 'Support', color: 'bg-emerald-100 text-emerald-600', icon: MessageSquare },
    { value: 'partnership', label: 'Partnership', color: 'bg-purple-100 text-purple-600', icon: Briefcase },
    { value: 'feedback', label: 'Feedback', color: 'bg-orange-100 text-orange-600', icon: Mail },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 md:px-8">
      <Card className="max-w-2xl w-full bg-white rounded-2xl shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center text-indigo-700">Contact Us</CardTitle>
          <p className="text-center text-gray-500 mt-2">
            We'd love to hear from you. Fill out the form and we'll respond as soon as possible.
          </p>
        </CardHeader>
        <Separator className="my-4" />
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <Label htmlFor="name">Name</Label>
              <Input id="name" {...register('name')} />
              {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" {...register('email')} />
              {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
            </div>

            <div>
              <Label htmlFor="subject">Subject</Label>
              <Input id="subject" {...register('subject')} />
              {errors.subject && <p className="text-red-500 text-sm">{errors.subject.message}</p>}
            </div>

            <div>
              <Label htmlFor="message">Message</Label>
              <Textarea id="message" rows={4} {...register('message')} />
              {errors.message && <p className="text-red-500 text-sm">{errors.message.message}</p>}
            </div>

            <div>
              <Label>Category</Label>
              <div className="grid grid-cols-2 gap-3 mt-2">
                {categories.map((info) => (
                  <label
                    key={info.value}
                    className="flex items-center space-x-2 border rounded-lg p-3 cursor-pointer hover:shadow transition"
                  >
                    <input type="radio" value={info.value} {...register('category')} className="hidden peer" />
                    <div className={`${info.color} rounded-full p-2`}>
                      <info.icon className="h-5 w-5" />
                    </div>
                    <span className="text-sm font-medium">{info.label}</span>
                  </label>
                ))}
              </div>
              {errors.category && <p className="text-red-500 text-sm">{errors.category.message}</p>}
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Sending...' : 'Send Message'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
