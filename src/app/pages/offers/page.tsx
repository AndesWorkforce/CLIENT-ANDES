"use client";

import { StaticOnMobile } from "../about/components/Reveal";
import JobSeekerLandingPage from "./components/JobSeekerLandingPage";

export default function JobOffersPage() {
  return (
    <StaticOnMobile>
      <JobSeekerLandingPage />
    </StaticOnMobile>
  );
}
