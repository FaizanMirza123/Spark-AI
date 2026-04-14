import { Role } from "../models/role.js";
import { User } from "../models/user.js";
import { Category } from "../models/category.js";
import { Service } from "../models/service.js";
import { Booking } from "../models/booking.js";

export async function seed() {
  const roleCount = await Role.count();
  if (roleCount > 0) return;

  console.log("Seeding database...");

  const [customerRole, providerRole, adminRole] = await Promise.all([
    Role.create({ name: "customer" }),
    Role.create({ name: "provider" }),
    Role.create({ name: "admin" }),
  ]);

  const admin = await User.create({
    name: "Admin User",
    email: "admin@sparkai.com",
    password: "Admin123!",
    phone: "+1-555-0100",
    address: "100 Admin Blvd",
    avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80",
    roleId: adminRole.id,
  });

  const providers = await Promise.all([
    User.create({
      name: "CleanPro Services",
      email: "provider1@sparkai.com",
      password: "Provider1!",
      phone: "+1-555-0201",
      address: "200 Service Ave",
      avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80",
      roleId: providerRole.id,
    }),
    User.create({
      name: "FixIt Plumbing",
      email: "provider2@sparkai.com",
      password: "Provider2!",
      phone: "+1-555-0202",
      address: "201 Service Ave",
      avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80",
      roleId: providerRole.id,
    }),
    User.create({
      name: "BrightSpark Electric",
      email: "provider3@sparkai.com",
      password: "Provider3!",
      phone: "+1-555-0203",
      address: "202 Service Ave",
      avatarUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80",
      roleId: providerRole.id,
    }),
  ]);

  const customers = await Promise.all([
    User.create({ name: "Sarah Wilson", email: "sarah@example.com", password: "Customer1!", phone: "+1-555-0301", address: "301 Oak St", roleId: customerRole.id }),
    User.create({ name: "Mike Chen", email: "mike@example.com", password: "Customer2!", phone: "+1-555-0302", address: "302 Maple Dr", roleId: customerRole.id }),
    User.create({ name: "Emily Davis", email: "emily@example.com", password: "Customer3!", phone: "+1-555-0303", address: "303 Pine Ln", roleId: customerRole.id }),
    User.create({ name: "James Brown", email: "james@example.com", password: "Customer4!", phone: "+1-555-0304", address: "304 Elm Ave", roleId: customerRole.id }),
    User.create({ name: "Lisa Taylor", email: "lisa@example.com", password: "Customer5!", phone: "+1-555-0305", address: "305 Cedar Ct", roleId: customerRole.id }),
  ]);

  const categories = await Promise.all([
    Category.create({ name: "Home Cleaning", slug: "cleaning", description: "Professional home cleaning services", imageUrl: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&q=80" }),
    Category.create({ name: "Plumbing", slug: "plumbing", description: "Expert plumbing repair and installation", imageUrl: "https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=400&q=80" }),
    Category.create({ name: "Electrical", slug: "electrical", description: "Licensed electrical services", imageUrl: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&q=80" }),
    Category.create({ name: "Painting", slug: "painting", description: "Interior and exterior painting", imageUrl: "https://images.unsplash.com/photo-1562259929-b4e1fd3aef09?w=400&q=80" }),
    Category.create({ name: "Carpentry", slug: "carpentry", description: "Custom woodworking and repairs", imageUrl: "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=400&q=80" }),
    Category.create({ name: "Landscaping", slug: "landscaping", description: "Garden and lawn care services", imageUrl: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&q=80" }),
  ]);

  const services = await Promise.all([
    Service.create({ name: "Deep Home Cleaning", description: "Professional deep cleaning for your entire home including kitchen, bathrooms, and living areas. Our certified cleaning professionals use eco-friendly products and state-of-the-art equipment to ensure every corner of your home is spotless.", categoryId: categories[0].id, price: 120, duration: 180, imageUrl: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&q=80", rating: 4.8, reviewCount: 124, providerId: providers[0].id }),
    Service.create({ name: "Standard Cleaning", description: "Regular home cleaning service covering all main living areas with professional products.", categoryId: categories[0].id, price: 80, duration: 120, imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800&q=80", rating: 4.6, reviewCount: 89, providerId: providers[0].id }),
    Service.create({ name: "Pipe Repair", description: "Expert pipe repair service for leaks, burst pipes, and general plumbing maintenance. Licensed and insured professionals.", categoryId: categories[1].id, price: 85, duration: 90, imageUrl: "https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=800&q=80", rating: 4.7, reviewCount: 95, providerId: providers[1].id }),
    Service.create({ name: "Drain Cleaning", description: "Professional drain cleaning service using advanced equipment to clear blockages and prevent future issues.", categoryId: categories[1].id, price: 95, duration: 60, imageUrl: "https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=800&q=80", rating: 4.5, reviewCount: 67, providerId: providers[1].id }),
    Service.create({ name: "Electrical Wiring", description: "Complete electrical wiring installation and repair by licensed electricians.", categoryId: categories[2].id, price: 150, duration: 240, imageUrl: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&q=80", rating: 4.9, reviewCount: 78, providerId: providers[2].id }),
    Service.create({ name: "Light Fixture Install", description: "Professional installation of ceiling fans, chandeliers, and light fixtures.", categoryId: categories[2].id, price: 75, duration: 60, imageUrl: "https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?w=800&q=80", rating: 4.6, reviewCount: 52, providerId: providers[2].id }),
    Service.create({ name: "Interior Painting", description: "Full room painting with premium paints, wall prep, and clean edges.", categoryId: categories[3].id, price: 200, duration: 360, imageUrl: "https://images.unsplash.com/photo-1562259929-b4e1fd3aef09?w=800&q=80", rating: 4.8, reviewCount: 110, providerId: providers[0].id }),
    Service.create({ name: "Furniture Assembly", description: "Professional assembly of all types of furniture. Fast, reliable, with cleanup.", categoryId: categories[4].id, price: 60, duration: 90, imageUrl: "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=800&q=80", rating: 4.4, reviewCount: 63, providerId: providers[1].id }),
    Service.create({ name: "Lawn Care", description: "Complete lawn maintenance including mowing, edging, and fertilizing.", categoryId: categories[5].id, price: 75, duration: 120, imageUrl: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&q=80", rating: 4.5, reviewCount: 45, providerId: providers[2].id }),
  ]);

  const bookingData = [
    { customerId: customers[0].id, serviceId: services[0].id, providerId: providers[0].id, status: "confirmed" as const, scheduledDate: "2026-04-20", scheduledTime: "10:00", address: "301 Oak St", totalAmount: 126, notes: "Please ring doorbell" },
    { customerId: customers[1].id, serviceId: services[2].id, providerId: providers[1].id, status: "in-progress" as const, scheduledDate: "2026-04-18", scheduledTime: "14:00", address: "302 Maple Dr", totalAmount: 89.25, notes: "Kitchen sink" },
    { customerId: customers[2].id, serviceId: services[4].id, providerId: providers[2].id, status: "pending" as const, scheduledDate: "2026-04-22", scheduledTime: "09:00", address: "303 Pine Ln", totalAmount: 157.5, notes: "" },
    { customerId: customers[3].id, serviceId: services[6].id, providerId: providers[0].id, status: "completed" as const, scheduledDate: "2026-04-10", scheduledTime: "11:00", address: "304 Elm Ave", totalAmount: 210, notes: "Living room only" },
    { customerId: customers[4].id, serviceId: services[8].id, providerId: providers[2].id, status: "cancelled" as const, scheduledDate: "2026-04-15", scheduledTime: "08:00", address: "305 Cedar Ct", totalAmount: 78.75, notes: "" },
    { customerId: customers[0].id, serviceId: services[1].id, providerId: providers[0].id, status: "completed" as const, scheduledDate: "2026-04-05", scheduledTime: "13:00", address: "301 Oak St", totalAmount: 84, notes: "" },
    { customerId: customers[1].id, serviceId: services[3].id, providerId: providers[1].id, status: "completed" as const, scheduledDate: "2026-04-03", scheduledTime: "10:00", address: "302 Maple Dr", totalAmount: 99.75, notes: "Bathroom drain" },
    { customerId: customers[2].id, serviceId: services[5].id, providerId: providers[2].id, status: "confirmed" as const, scheduledDate: "2026-04-25", scheduledTime: "15:00", address: "303 Pine Ln", totalAmount: 78.75, notes: "" },
  ];

  await Booking.bulkCreate(bookingData);

  console.log("Seed complete: 3 roles, 9 users, 6 categories, 9 services, 8 bookings");
}
