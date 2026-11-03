import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { getCampaignBySlug } from "@/server/queries/campaigns";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { getMenuItems } from "@/server/queries/menu";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Heart,
  MapPin,
  Calendar,
  Users,
  CheckCircle,
  FileText,
} from "lucide-react";
import {
  formatCurrency,
  calculateProgress,
  timeAgo,
  getInitials,
} from "@/lib/utils";
import { DonationModal } from "@/components/campaigns/donation-modal";
import { ShareButton } from "@/components/campaigns/share-button";
import { CampaignGallery } from "@/components/campaigns/campaign-gallery";
import { CampaignDocumentList } from "@/components/campaigns/campaign-document-list";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const campaign = await getCampaignBySlug(slug);
  if (!campaign) return { title: "Campaign Not Found" };

  return {
    title: campaign.title,
    description: campaign.story.substring(0, 160),
    alternates: { canonical: `/campaigns/${campaign.slug}` },
    openGraph: {
      type: "article",
      url: `/campaigns/${campaign.slug}`,
      title: campaign.title,
      description: campaign.story.substring(0, 160),
      images: campaign.beneficiaryImage ? [campaign.beneficiaryImage] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: campaign.title,
      description: campaign.story.substring(0, 160),
      images: campaign.beneficiaryImage ? [campaign.beneficiaryImage] : [],
    },
  };
}

export default async function CampaignDetailPage({ params }: Props) {
  const { slug } = await params;
  const [campaign, menuItems] = await Promise.all([
    getCampaignBySlug(slug),
    getMenuItems(),
  ]);

  if (!campaign) notFound();
  // Found through the id at the end of a stale or mistyped slug: send everyone to the canonical address
  if (campaign.slug !== slug) permanentRedirect(`/campaigns/${campaign.slug}`);

  const progress = calculateProgress(campaign.amountRaised, campaign.goalAmount);

  return (
    <>
      <Header
        menuItems={menuItems.map((item: { id: string; name: string; url: string }) => ({
          id: item.id,
          name: item.name,
          url: item.url,
        }))}
      />
      <main className="min-h-screen pt-20 bg-varak-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Photos: campaigns made before multi-photo support only have the cover photo */}
              <CampaignGallery
                images={campaign.images.length ? campaign.images.map((i) => i.url) : campaign.beneficiaryImage ? [campaign.beneficiaryImage] : []}
                alt={campaign.beneficiaryName}
              />

              {/* Title & meta */}
              <div className="bg-white rounded-none p-6 border border-border/50">
                <div className="flex flex-wrap gap-2 mb-3">
                  {campaign.cancerType && (
                    <Badge variant="secondary">{campaign.cancerType.name}</Badge>
                  )}
                  {campaign.isUrgent && (
                    <Badge className="bg-red-500 text-white">Urgent</Badge>
                  )}
                  {campaign.verificationStatus === "FULLY_VERIFIED" && (
                    <Badge className="bg-varak-primary text-white">
                      <CheckCircle className="mr-1 h-3 w-3" />
                      Verified
                    </Badge>
                  )}
                </div>

                <h1 className="font-heading text-2xl md:text-3xl mb-3">
                  {campaign.title}
                </h1>

                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    by {campaign.createdBy.firstName}{" "}
                    {campaign.createdBy.lastName}
                  </span>
                  {campaign.state && (
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {campaign.district?.name && `${campaign.district.name}, `}
                      {campaign.state.name}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {timeAgo(campaign.createdAt)}
                  </span>
                </div>
              </div>

              {/* Tabs */}
              <div className="bg-white rounded-none p-6 border border-border/50">
                <Tabs defaultValue="story">
                  <TabsList className="mb-4">
                    <TabsTrigger value="story">Story</TabsTrigger>
                    <TabsTrigger value="updates">
                      Updates ({campaign.updates.length})
                    </TabsTrigger>
                    <TabsTrigger value="donors">
                      Donors ({campaign.donations.length})
                    </TabsTrigger>
                    <TabsTrigger value="comments">
                      Comments ({campaign.comments.length})
                    </TabsTrigger>
                    <TabsTrigger value="documents">
                      <FileText className="mr-1 h-3 w-3" />
                      Docs
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="story">
                    <div className="prose prose-neutral max-w-none">
                      <p className="whitespace-pre-wrap">{campaign.story}</p>
                    </div>
                  </TabsContent>

                  <TabsContent value="updates">
                    {campaign.updates.length === 0 ? (
                      <p className="text-muted-foreground text-sm">
                        No updates yet.
                      </p>
                    ) : (
                      <div className="space-y-4">
                        {campaign.updates.map((update) => (
                          <div
                            key={update.id}
                            className="p-4 rounded-none bg-muted/50"
                          >
                            <p className="text-sm">{update.content}</p>
                            <span className="text-xs text-muted-foreground mt-2 block">
                              {timeAgo(update.createdAt)}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="donors">
                    {campaign.donations.length === 0 ? (
                      <p className="text-muted-foreground text-sm">
                        Be the first to donate!
                      </p>
                    ) : (
                      <div className="space-y-3">
                        {campaign.donations.map((donation) => (
                          <div
                            key={donation.id}
                            className="flex items-center justify-between p-3 rounded-none bg-muted/50"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-none bg-varak-primary/10 flex items-center justify-center text-xs font-medium text-varak-primary">
                                {donation.isAnonymous
                                  ? "?"
                                  : getInitials(donation.donorName || "D")}
                              </div>
                              <span className="text-sm font-medium">
                                {donation.isAnonymous
                                  ? "Anonymous"
                                  : donation.donorName}
                              </span>
                            </div>
                            <div className="text-right">
                              <div className="text-sm font-semibold text-varak-primary">
                                {formatCurrency(donation.amount)}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {timeAgo(donation.createdAt)}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="comments">
                    {campaign.comments.length === 0 ? (
                      <p className="text-muted-foreground text-sm">
                        No comments yet.
                      </p>
                    ) : (
                      <div className="space-y-3">
                        {campaign.comments.map((comment) => (
                          <div key={comment.id} className="p-3 rounded-none bg-muted/50">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-sm font-medium">
                                {comment.author.firstName}{" "}
                                {comment.author.lastName}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {timeAgo(comment.createdAt)}
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {comment.content}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="documents">
                    {campaign.documents.length === 0 ? (
                      <p className="text-muted-foreground text-sm">
                        No documents uploaded.
                      </p>
                    ) : (
                      <CampaignDocumentList docs={campaign.documents.map((d) => ({ url: d.url, fileName: d.fileName || d.type, type: d.type, verified: d.verified }))} />
                    )}
                  </TabsContent>
                </Tabs>
              </div>
            </div>

            {/* Sidebar - Donation panel */}
            <div className="space-y-4">
              <div className="bg-white rounded-none p-6 border border-border/50 sticky top-24">
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-2xl font-heading text-varak-primary">
                      {formatCurrency(campaign.amountRaised)}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    raised of {formatCurrency(campaign.goalAmount)} goal
                  </p>
                  <Progress value={progress} className="h-3 mb-2" />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{progress}% funded</span>
                    <span className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {campaign.donorCount} donors
                    </span>
                  </div>
                </div>

                <DonationModal campaignId={campaign.id} campaignTitle={campaign.title}>
                  <Button className="w-full bg-varak-primary hover:bg-varak-primary-dark text-white h-12 text-base mb-3">
                    <Heart className="mr-2 h-4 w-4" />
                    Donate Now
                  </Button>
                </DonationModal>

                <ShareButton title={campaign.title} />

                {/* Recent donors */}
                {campaign.donations.length > 0 && (
                  <div className="mt-6 pt-6 border-t">
                    <h4 className="text-sm font-semibold mb-3">
                      Recent Supporters
                    </h4>
                    <div className="space-y-2">
                      {campaign.donations.slice(0, 5).map((d) => (
                        <div
                          key={d.id}
                          className="flex items-center justify-between text-sm"
                        >
                          <span className="text-muted-foreground">
                            {d.isAnonymous ? "Anonymous" : d.donorName}
                          </span>
                          <span className="font-medium text-varak-primary">
                            {formatCurrency(d.amount)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
