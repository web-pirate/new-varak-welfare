import type { Metadata } from "next";
import { MapPin, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CONTACT_EMAIL, CONTACT_MAILTO } from "@/lib/contact";

export const metadata: Metadata = {
  title: "Careers",
  description: "Join Varak Cancer Welfare Society. Help us fight cancer through technology and compassion.",
};

const openings = [
  { title: "Full Stack Developer", type: "Full-time", location: "Mumbai / Remote" },
  { title: "Campaign Verification Specialist", type: "Full-time", location: "Mumbai" },
  { title: "Content & Social Media Manager", type: "Full-time", location: "Mumbai / Remote" },
  { title: "Donor Relations Executive", type: "Full-time", location: "Mumbai" },
];

export default function CareersPage() {
  return (
    <div>
      <section className="py-16 md:py-24 bg-gradient-to-b from-varak-cream to-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-heading text-4xl md:text-5xl mb-6">
            Join Our Mission
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Be part of a team that&apos;s using technology and compassion to
            help cancer patients get the treatment they deserve.
          </p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-heading text-3xl text-center mb-10">
            Open Positions
          </h2>
          <div className="space-y-4">
            {openings.map((job) => (
              <div
                key={job.title}
                className="p-6 rounded-2xl border border-border/50 hover:border-varak-primary/20 hover:shadow-sm transition-all flex items-center justify-between"
              >
                <div>
                  <h3 className="font-semibold text-lg">{job.title}</h3>
                  <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      {job.type}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5" />
                      {job.location}
                    </span>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  Apply
                </Button>
              </div>
            ))}
          </div>
          <p className="text-center text-sm text-muted-foreground mt-8">
            Don&apos;t see a role that fits? Send your resume to{" "}
            <a href={CONTACT_MAILTO} className="text-varak-primary hover:underline">
              {CONTACT_EMAIL}
            </a>
          </p>
        </div>
      </section>
    </div>
  );
}
