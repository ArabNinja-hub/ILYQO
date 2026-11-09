import { useEffect } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { MarketingPage } from "./pages/MarketingPage";
import { DemoApp } from "./demo/DemoApp";
import { OverviewPage } from "./demo/pages/OverviewPage";
import { EnquiriesPage } from "./demo/pages/EnquiriesPage";
import { AppointmentsPage } from "./demo/pages/AppointmentsPage";
import { FollowUpsPage } from "./demo/pages/FollowUpsPage";

/**
 * Keeps scrolling sensible across client-side navigation:
 * - a hash (e.g. `/#platform`) scrolls to that section,
 * - a plain route change starts at the top of the page.
 */
function ScrollManager() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const target = document.getElementById(hash.slice(1));
      if (target) {
        // Wait a frame so the destination page has rendered.
        requestAnimationFrame(() => target.scrollIntoView({ block: "start" }));
        return;
      }
    }
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname, hash]);

  return null;
}

export default function App() {
  return (
    <>
      <ScrollManager />
      <Routes>
        <Route path="/" element={<MarketingPage />} />
        <Route path="/demo" element={<DemoApp />}>
          <Route index element={<Navigate to="overview" replace />} />
          <Route path="overview" element={<OverviewPage />} />
          <Route path="enquiries" element={<EnquiriesPage />} />
          <Route path="appointments" element={<AppointmentsPage />} />
          <Route path="follow-ups" element={<FollowUpsPage />} />
          <Route path="*" element={<Navigate to="overview" replace />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
