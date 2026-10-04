import { CtaPair } from '@/components/ui/CtaPair';
import { Reveal } from '@/components/ui/Reveal';
import { ControlRoom } from '@/components/home/ControlRoom';
import { CommandBar } from '@/components/home/CommandBar';
import { ProofBand } from '@/components/home/ProofBand';
import { AudienceTabs } from '@/components/home/AudienceTabs';
import { GovernedQueue } from '@/components/home/GovernedQueue';
import { AiTeaser } from '@/components/home/AiTeaser';
import { RewardsNetwork } from '@/components/home/RewardsNetwork';
import { StoryCards } from '@/components/home/StoryCards';
import { ClosingCta, MidCta, PageFaq } from '@/components/ui/Page';

export default function Home() {
  return (
    <>
      <section data-section="hero" className="pb-12 pt-14 sm:pb-16 sm:pt-20">
        <div className="container-x">
          <Reveal className="max-w-3xl">
            <p className="label-mono mb-4">Loyalife by Xoxoday</p>
            <h1 className="h1">Loyalty programs members love and finance can audit.</h1>
            <p className="lead mt-5 max-w-2xl">
              Launch customer, partner and influencer programs in weeks. Every rule is approved, every point is traceable, and rewards reach members in 150+ countries.
            </p>
            <div className="mt-8 max-w-2xl"><CommandBar /></div>
            <CtaPair variant="hero" className="mt-8" />
          </Reveal>
          <Reveal className="mt-12"><ControlRoom /></Reveal>
        </div>
      </section>
      <ProofBand />
      <AudienceTabs />
      <GovernedQueue />
      <MidCta title="Want to see this with your own rules?" />
      <AiTeaser />
      <RewardsNetwork />
      <StoryCards />
      <PageFaq title="Questions buyers ask" />
      <ClosingCta note={false} />
    </>
  );
}
