import type { Metadata } from "next";
import { Mail, Phone, MapPin, Clock, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { CONTACT_ADDRESS, CONTACT_EMAIL, CONTACT_MAILTO, CONTACT_PHONE, CONTACT_TEL } from "@/lib/contact";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with Varak Cancer Welfare Society. We're here to help with your questions about fundraising, donations, or partnerships.",
};

const contactInfo: { icon: LucideIcon; label: string; value: string; href?: string }[] = [
  { icon: Mail, label: "Email", value: CONTACT_EMAIL, href: CONTACT_MAILTO },
  { icon: Phone, label: "Phone", value: CONTACT_PHONE, href: CONTACT_TEL },
  { icon: MapPin, label: "Office", value: CONTACT_ADDRESS },
  { icon: Clock, label: "Hours", value: "Mon-Sat, 9AM - 7PM IST" },
];

export default function ContactPage() {
  return (
    <div>
      <section className="py-16 md:py-24 bg-gradient-to-b from-varak-cream to-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-sm font-semibold text-varak-gold uppercase tracking-wider">
            Contact Us
          </span>
          <h1 className="font-heading text-4xl md:text-5xl mt-3 mb-6">
            We&apos;re Here to Help
          </h1>
          <p className="text-lg text-muted-foreground">
            Have questions about fundraising, donations, or partnerships?
            Reach out to our team.
          </p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-5 gap-12">
            {/* Contact info */}
            <div className="lg:col-span-2 space-y-6">
              {contactInfo.map(({ icon: Icon, label, value, href }) => (
                <div key={label} className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-varak-primary/10 flex items-center justify-center flex-shrink-0">
                    <Icon className="h-5 w-5 text-varak-primary" />
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">{label}</div>
                    <div className="font-medium">
                      {href ? <a href={href} className="hover:text-varak-primary hover:underline">{value}</a> : value}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Contact form */}
            <div className="lg:col-span-3">
              <form className="space-y-5 bg-varak-cream/50 p-8 rounded-2xl border border-border/50">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" placeholder="Your name" className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="you@example.com" className="mt-1" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="subject">Subject</Label>
                  <Input id="subject" placeholder="How can we help?" className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="message">Message</Label>
                  <Textarea id="message" placeholder="Tell us more..." rows={5} className="mt-1" />
                </div>
                <Button type="submit" className="bg-varak-primary hover:bg-varak-primary-dark text-white">
                  Send Message
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
