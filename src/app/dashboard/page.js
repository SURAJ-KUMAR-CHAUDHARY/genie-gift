import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { PrismaClient } from "@prisma/client";
import { redirect } from "next/navigation";
import { Sparkles, Users, Package, Settings, LogOut } from "lucide-react";
import Link from "next/link";

const prisma = new PrismaClient();

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    redirect("/login");
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        people: true,
        orders: { orderBy: { createdAt: "desc" } }
      }
    });

    if (!user) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center">
          <h2 className="font-headline font-bold text-2xl text-on-surface mb-2">User not found</h2>
          <p className="text-on-surface-variant mb-8">Please try logging in again.</p>
          <Link href="/login" className="py-3 px-8 bg-primary text-white rounded-full font-bold shadow-lg">
            Go to Login
          </Link>
        </div>
      );
    }

    return (
      <div className="max-w-4xl mx-auto px-4 py-8 pb-32">
        <header className="mb-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-headline font-extrabold text-3xl tracking-tight text-on-surface">
              Hello, {user.name || "Friend"} ✨
            </h1>
            <p className="text-on-surface-variant">Manage your saved people and gift history</p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/api/auth/signout" className="flex items-center gap-2 px-4 py-2 rounded-full border border-outline-variant text-sm font-medium text-on-surface-variant hover:bg-surface-container">
              <LogOut className="w-4 h-4" /> Sign Out
            </Link>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Column - Stats / Menu */}
          <div className="space-y-4">
            <div className="glass-card p-6 rounded-2xl editorial-shadow border border-white/50">
              <h3 className="font-bold text-on-surface flex items-center gap-2 mb-4">
                <Users className="w-5 h-5 text-secondary" /> My People
              </h3>
              <p className="text-3xl font-headline font-black text-primary mb-1">{user.people?.length || 0}</p>
              <p className="text-sm text-on-surface-variant">Saved recipients</p>
            </div>
            
            <div className="glass-card p-6 rounded-2xl editorial-shadow border border-white/50">
              <h3 className="font-bold text-on-surface flex items-center gap-2 mb-4">
                <Package className="w-5 h-5 text-tertiary" /> Total Orders
              </h3>
              <p className="text-3xl font-headline font-black text-primary mb-1">{user.orders?.length || 0}</p>
              <p className="text-sm text-on-surface-variant">Past gifts given</p>
            </div>
          </div>

          {/* Right Column - Data */}
          <div className="md:col-span-2 space-y-8">
            
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-headline font-bold text-xl text-on-surface">Saved People</h2>
                <button className="text-sm font-bold text-primary">Add New</button>
              </div>
              
              {user.people?.length === 0 ? (
                <div className="bg-surface-container p-8 rounded-2xl text-center border border-dashed border-outline-variant">
                  <Users className="w-8 h-8 text-on-surface-variant mx-auto mb-3" />
                  <p className="font-medium text-on-surface">No one saved yet</p>
                  <p className="text-sm text-on-surface-variant mb-4">Save profiles of your loved ones to make gifting instant next time.</p>
                  <Link href="/discover" className="inline-block px-6 py-2 bg-primary-container text-on-primary-container rounded-full font-bold text-sm">
                    Find a Gift
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {user.people.map(person => (
                    <div key={person.id} className="bg-surface-container-lowest p-5 rounded-2xl editorial-shadow border border-outline-variant/10">
                      <h3 className="font-bold text-lg text-on-surface">{person.name}</h3>
                      <p className="text-sm text-on-surface-variant capitalize">{person.relationship}</p>
                      <div className="mt-3 flex gap-2 w-full">
                        <Link href="/discover" className="flex-1 text-center py-2 bg-primary/10 text-primary font-bold text-xs rounded-full">Gift Again</Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <section>
              <h2 className="font-headline font-bold text-xl text-on-surface mb-4">Recent Orders</h2>
              {user.orders?.length === 0 ? (
                <div className="bg-surface-container p-8 rounded-2xl text-center flex flex-col justify-center items-center">
                  <Sparkles className="w-8 h-8 text-on-surface-variant mb-2" />
                  <p className="font-medium text-on-surface">No gifts given yet.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {user.orders.slice(0, 5).map(order => (
                    <div key={order.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-5 bg-surface-container-lowest rounded-2xl border border-outline-variant/10 editorial-shadow">
                      <div>
                        <p className="font-bold text-on-surface">Order #{order.id.slice(-6).toUpperCase()}</p>
                        <p className="text-sm text-on-surface-variant">{order.createdAt.toLocaleDateString()}</p>
                      </div>
                      <div className="mt-3 sm:mt-0 text-left sm:text-right">
                        <p className="font-bold text-primary">₹{order.totalAmount}</p>
                        <span className="inline-block px-2 py-1 bg-secondary-container/20 text-on-secondary-container text-[10px] font-bold uppercase tracking-wider rounded">
                          {order.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Dashboard error:", error);
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center">
        <h2 className="font-headline font-bold text-2xl text-on-surface mb-2">Something went wrong</h2>
        <p className="text-on-surface-variant mb-8">Please try refreshing the page or contact support.</p>
        <Link href="/dashboard" className="py-3 px-8 bg-primary text-white rounded-full font-bold shadow-lg">
          Try Again
        </Link>
      </div>
    );
  }
}