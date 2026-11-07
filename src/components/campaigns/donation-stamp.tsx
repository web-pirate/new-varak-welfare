import { Stamp } from "@/components/ui/stamp";
import { formatCurrency } from "@/lib/utils";

// A receipt in stamp form: only ever built from a real, completed donation.
export function DonationStamp({
  amount,
  date,
  beneficiaryName,
  image,
}: {
  amount: number;
  date: Date | string;
  beneficiaryName: string;
  image?: string | null;
}) {
  const day = new Date(date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  return (
    <Stamp
      paper="#fdf8f0"
      ink="#3a2a22"
      aria-label={`Donation of ${formatCurrency(amount)} for ${beneficiaryName} on ${day}`}
      className="mx-auto"
    >
      <div className="flex h-full flex-col text-center">
        <div className="min-h-0 flex-1 overflow-hidden bg-varak-primary/10">
          {image && <img src={image} alt="" className="h-full w-full object-cover object-top" />}
        </div>
        <p className="mt-2 text-lg font-semibold leading-none text-varak-primary">{formatCurrency(amount)}</p>
        <p className="mt-1 truncate text-xs">for {beneficiaryName}</p>
        <p className="text-xs text-foreground/60">{day}</p>
      </div>
    </Stamp>
  );
}
