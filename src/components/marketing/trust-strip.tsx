import { BadgeCheck, Lock, Percent, ShieldCheck } from "lucide-react";

const items = [
  { icon: Percent, text: "0% platform fee" },
  { icon: BadgeCheck, text: "80G tax benefit" },
  { icon: ShieldCheck, text: "3-tier verified" },
  { icon: Lock, text: "Secured by Razorpay" },
];

export function TrustStrip() {
  return (
    <section aria-label="Why donors trust Varak" className="bg-white border-y border-foreground/10">
      <ul className="max-w-7xl mx-auto px-4 py-4 grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-3">
        {items.map(({ icon: Icon, text }) => (
          <li key={text} className="flex items-center justify-center gap-2 text-sm md:text-base font-semibold text-foreground">
            <Icon className="h-5 w-5 text-varak-primary shrink-0" aria-hidden />
            {text}
          </li>
        ))}
      </ul>
    </section>
  );
}
