import { redirect } from "next/navigation";

export default function FeaturedProfilesRedirect() {
  redirect("/admin/superAdmin/settings");
}

