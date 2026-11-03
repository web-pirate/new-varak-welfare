import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getAllUsers } from "@/server/queries/admin";
import { Badge } from "@/components/ui/badge";
import { timeAgo } from "@/lib/utils";
import { RoleSelector } from "./role-selector";

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    select: { id: true, role: true },
  });

  if (!user || !["ADMIN", "SUPER_ADMIN"].includes(user.role)) {
    redirect("/dashboard/fundraiser");
  }

  const params = await searchParams;
  const page = parseInt(params.page || "1");
  const { users, total, totalPages } = await getAllUsers(page, 20);

  const roleColor: Record<string, string> = {
    DONOR: "bg-blue-100 text-blue-800",
    FUNDRAISER: "bg-green-100 text-green-800",
    NGO_ADMIN: "bg-purple-100 text-purple-800",
    ADMIN: "bg-orange-100 text-orange-800",
    SUPER_ADMIN: "bg-red-100 text-red-800",
  };

  return (
    <div>
      <h1 className="font-heading text-2xl md:text-3xl mb-2">Manage Users</h1>
      <p className="text-muted-foreground text-sm mb-6">
        {total} total users
      </p>

      <div className="bg-white rounded-2xl border border-border/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/30">
                <th className="text-left p-4 font-medium">User</th>
                <th className="text-left p-4 font-medium">Role</th>
                <th className="text-center p-4 font-medium">Campaigns</th>
                <th className="text-center p-4 font-medium">Donations</th>
                <th className="text-left p-4 font-medium">KYC</th>
                <th className="text-right p-4 font-medium">Joined</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-muted-foreground">
                    No users found.
                  </td>
                </tr>
              )}
              {users.map((u) => (
                <tr key={u.id} className="border-b last:border-0">
                  <td className="p-4">
                    <p className="font-medium">
                      {u.firstName} {u.lastName}
                    </p>
                    <p className="text-xs text-muted-foreground">{u.email}</p>
                  </td>
                  <td className="p-4">
                    <RoleSelector
                      userId={u.id}
                      currentRole={u.role}
                      isCurrentUser={u.id === user.id}
                      canAssignAdmin={user.role === "SUPER_ADMIN"}
                    />
                  </td>
                  <td className="p-4 text-center">{u._count.campaigns}</td>
                  <td className="p-4 text-center">{u._count.donations}</td>
                  <td className="p-4">
                    <Badge
                      className={
                        u.kycStatus === "VERIFIED"
                          ? "bg-green-100 text-green-800"
                          : u.kycStatus === "PENDING"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-gray-100 text-gray-800"
                      }
                    >
                      {u.kycStatus}
                    </Badge>
                  </td>
                  <td className="p-4 text-right text-muted-foreground">
                    {timeAgo(u.createdAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <a
              key={p}
              href={`/dashboard/admin/users?page=${p}`}
              className={`px-3 py-1.5 rounded-none text-sm ${
                p === page
                  ? "bg-varak-primary text-white"
                  : "bg-white border border-border hover:bg-muted"
              }`}
            >
              {p}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
