import Link from "next/link";
import Image from "next/image";
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  Phone,
  Mail,
  MapPin,
  Shield,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { CONTACT_ADDRESS, CONTACT_EMAIL, CONTACT_MAILTO, CONTACT_PHONE, CONTACT_TEL } from "@/lib/contact";

const causes = [
  "Breast Cancer",
  "Blood Cancer",
  "Lung Cancer",
  "Brain Cancer",
  "Childhood Cancer",
  "Ovarian Cancer",
];

const platformLinks = [
  { label: "Start a Fundraiser", href: "/start-fundraiser" },
  { label: "Browse Campaigns", href: "/campaigns" },
  { label: "Monthly Giving", href: "/monthly-giving" },
  { label: "Success Stories", href: "/#success-stories" },
  { label: "How It Works", href: "/how-it-works" },
];

const supportLinks = [
  { label: "Help Center", href: "/contact" },
  { label: "Trust & Safety", href: "/trust-safety" },
  { label: "Contact Support", href: "/contact" },
  { label: "About Varak", href: "/about" },
  { label: "Careers", href: "/careers" },
];

const legalLinks = [
  { label: "Terms of Service", href: "/terms" },
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Refund Policy", href: "/refund" },
  { label: "Cancellation", href: "/cancellation" },
];

const socialLinks = [
  { icon: Facebook, href: "#", label: "Facebook" },
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Linkedin, href: "#", label: "LinkedIn" },
  { icon: Youtube, href: "#", label: "YouTube" },
  { icon: Mail, href: CONTACT_MAILTO, label: "Email" },
];

export function Footer() {
  return (
    <footer className="bg-[#1E1612] text-white relative overflow-hidden">
      {/* Rainbow ribbon bar at top */}
      <div className="ribbon-bar" />

      {/* CTA Section */}
      <div className="border-b border-white/8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="font-heading text-2xl md:text-3xl mb-2">
                Ready to Make a Difference?
              </h3>
              <p className="text-white/45">
                Join thousands helping cancer patients get treatment they deserve.
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                asChild
                className="bg-varak-primary hover:bg-varak-primary-light text-white rounded-none shadow-[0_4px_16px_rgba(194,85,58,0.3)]"
              >
                <Link href="/start-fundraiser">
                  Start Fundraising
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="border-white/15 text-white hover:bg-white/5 rounded-none"
              >
                <Link href="/campaigns">Browse Campaigns</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2.5 mb-5">
              <Image src="/logo.png" alt="Varak" width={56} height={56} className="w-14 h-14" />
              <div>
                <span className="font-heading text-2xl">Varak</span>
                <span className="text-xs text-white/40 block -mt-1">
                  Cancer Welfare Society
                </span>
              </div>
            </div>
            <p className="text-white/45 text-sm mb-6 max-w-sm leading-relaxed">
              India&apos;s trusted cancer crowdfunding platform. We believe
              every life deserves a fighting chance against cancer, with 0%
              platform fee. Every ribbon color, every cancer type.
            </p>

            {/* Stats */}
            <div className="flex gap-6 mb-6">
              <div>
                <div className="text-2xl font-heading text-varak-warm-wash">5.5M+</div>
                <div className="text-xs text-white/30">Users</div>
              </div>
              <div>
                <div className="text-2xl font-heading text-varak-pink">₹100Cr+</div>
                <div className="text-xs text-white/30">Raised</div>
              </div>
              <div>
                <div className="text-2xl font-heading text-varak-gold">10K+</div>
                <div className="text-xs text-white/30">Campaigns</div>
              </div>
            </div>

            {/* Social */}
            <div className="flex gap-2">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 rounded-none bg-white/8 flex items-center justify-center hover:bg-varak-primary transition-colors duration-300"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Causes */}
          <div>
            <h4 className="font-heading text-lg mb-4">Causes</h4>
            <ul className="space-y-2.5">
              {causes.map((cause) => (
                <li key={cause}>
                  <Link
                    href="/cancer-types"
                    className="text-sm text-white/45 hover:text-varak-pink transition-colors duration-300"
                  >
                    {cause}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Platform */}
          <div>
            <h4 className="font-heading text-lg mb-4">Platform</h4>
            <ul className="space-y-2.5">
              {platformLinks.map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-sm text-white/45 hover:text-varak-pink transition-colors duration-300"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support & Contact */}
          <div>
            <h4 className="font-heading text-lg mb-4">Support</h4>
            <ul className="space-y-2.5 mb-6">
              {supportLinks.map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-sm text-white/45 hover:text-varak-pink transition-colors duration-300"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>

            <h4 className="font-heading text-lg mb-3">Contact</h4>
            <ul className="space-y-2.5 text-sm text-white/45">
              <li className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 flex-shrink-0 text-varak-warm-wash" />
                <a href={CONTACT_MAILTO} className="hover:text-white">
                  {CONTACT_EMAIL.split("@")[0]}@<wbr />{CONTACT_EMAIL.split("@")[1]}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5 flex-shrink-0 text-varak-warm-wash" />
                <a href={CONTACT_TEL} className="hover:text-white">{CONTACT_PHONE}</a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="h-3.5 w-3.5 flex-shrink-0 text-varak-warm-wash mt-0.5" />
                {CONTACT_ADDRESS}
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4 text-xs text-white/30">
              <span>
                &copy; {new Date().getFullYear()} Varak Cancer Welfare Society.
                All rights reserved.
              </span>
              <div className="flex items-center gap-1">
                <Shield className="h-3 w-3" />
                <span>SSL Secured</span>
              </div>
            </div>
            <div className="flex gap-4 text-xs text-white/30">
              {legalLinks.map(({ label, href }) => (
                <Link key={label} href={href} className="hover:text-white/50 transition-colors">
                  {label}
                </Link>
              ))}
            </div>
            <div className="flex items-center gap-2 text-xs text-white/20">
              <span>Visa</span>
              <span>|</span>
              <span>Mastercard</span>
              <span>|</span>
              <span>UPI</span>
              <span>|</span>
              <span>Net Banking</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
