import { AnimatePresence, MotionConfig, motion } from 'framer-motion';
import { lazy, Suspense, useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import { StickyCta } from './StickyCta';
import { GuideLauncher } from '../guide/GuideLauncher';
import { TourHost } from '../guide/TourHost';
import { CelebrationHost } from '../explorer/CelebrationHost';
import { PageSkeleton } from '../ui/Bits';
import { useReducedMotion } from '@/lib/prefs';
import { useSeo } from '@/lib/seo';
import { useUi } from '@/lib/ui';
import { useReview } from '@/lib/review';
import { waitFor } from '@/lib/scroll';
import { t } from '@/lib/motion';

const Home = lazy(() => import('@/pages/Home'));
const Platform = lazy(() => import('@/pages/Platform'));
const Infrastructure = lazy(() => import('@/pages/Infrastructure'));
const AiMcp = lazy(() => import('@/pages/AiMcp'));
const Security = lazy(() => import('@/pages/Security'));
const Apis = lazy(() => import('@/pages/Apis'));
const SolutionsIndex = lazy(() => import('@/pages/SolutionsIndex'));
const SolutionDetail = lazy(() => import('@/pages/SolutionDetail'));
const Resources = lazy(() => import('@/pages/Resources'));
const CaseStudies = lazy(() => import('@/pages/CaseStudies'));
const CaseStudyDetail = lazy(() => import('@/pages/CaseStudyDetail'));
const Tours = lazy(() => import('@/pages/Tours'));
const Demos = lazy(() => import('@/pages/Demos'));
const FaqGuides = lazy(() => import('@/pages/FaqGuides'));
const Docs = lazy(() => import('@/pages/Docs'));
const SecurityPack = lazy(() => import('@/pages/SecurityPack'));
const Pricing = lazy(() => import('@/pages/Pricing'));
const DemoPage = lazy(() => import('@/pages/DemoPage'));
const NotFound = lazy(() => import('@/pages/NotFound'));

const CommandPalette = lazy(() => import('../guide/CommandPalette'));
const ReviewPanel = lazy(() => import('./ReviewPanel'));
const SecurityPackDialog = lazy(() => import('./SecurityPackDialog'));

export function Layout() {
  const loc = useLocation();
  const reduced = useReducedMotion();
  const review = useReview();
  const { paletteOpen, securityPackOpen } = useUi();
  useSeo(loc.pathname);

  // Scroll to top on route change, or to the hash target.
  useEffect(() => {
    if (!loc.hash) {
      window.scrollTo(0, 0);
      return;
    }
    let cancel = false;
    void waitFor(loc.hash, 3000).then((el) => {
      if (!el || cancel) return;
      el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'center' });
      el.classList.add('flash-highlight');
      window.setTimeout(() => el.classList.remove('flash-highlight'), 1500);
    });
    return () => {
      cancel = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loc.pathname, loc.hash]);

  return (
    <MotionConfig reducedMotion={reduced ? 'always' : 'never'}>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-lg focus:bg-ink focus:px-4 focus:py-2 focus:text-canvas">
        Skip to content
      </a>
      <Header />
      <main id="main" tabIndex={-1} className="min-h-[70vh] outline-none">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={loc.pathname} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={t.base}>
            <Suspense fallback={<PageSkeleton />}>
              <Routes location={loc}>
                <Route path="/" element={<Home />} />
                <Route path="/platform" element={<Platform />} />
                <Route path="/platform/infrastructure" element={<Infrastructure />} />
                <Route path="/platform/ai-mcp" element={<AiMcp />} />
                <Route path="/platform/security" element={<Security />} />
                <Route path="/platform/apis" element={<Apis />} />
                <Route path="/solutions" element={<SolutionsIndex />} />
                <Route path="/solutions/:slug" element={<SolutionDetail />} />
                <Route path="/resources" element={<Resources />} />
                <Route path="/resources/case-studies" element={<CaseStudies />} />
                <Route path="/resources/case-studies/:slug" element={<CaseStudyDetail />} />
                <Route path="/resources/tours" element={<Tours />} />
                <Route path="/resources/demos" element={<Demos />} />
                <Route path="/resources/faq" element={<FaqGuides />} />
                <Route path="/resources/docs" element={<Docs />} />
                <Route path="/resources/security-pack" element={<SecurityPack />} />
                <Route path="/pricing" element={<Pricing />} />
                <Route path="/demo" element={<DemoPage />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </motion.div>
        </AnimatePresence>
      </main>
      <Footer />
      <StickyCta />
      <GuideLauncher />
      <TourHost />
      <CelebrationHost />
      <Suspense fallback={null}>
        {paletteOpen && <CommandPalette />}
        {securityPackOpen && <SecurityPackDialog />}
        {review && <ReviewPanel />}
      </Suspense>
    </MotionConfig>
  );
}
