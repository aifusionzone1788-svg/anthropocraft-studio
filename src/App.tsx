import React from 'react';
import { StudioProvider, useStudio } from './context/StudioContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HeroSection } from './components/HeroSection';
import { IntroSection } from './components/IntroSection';
import { AboutSection } from './components/AboutSection';
import { MilestonesSection } from './components/MilestonesSection';
import { ContactCtaSection } from './components/ContactCtaSection';
import { GalleryPage } from './components/GalleryPage';
import { RateSheetPage } from './components/RateSheetPage';
import { UploadModal } from './components/UploadModal';
import { LightboxModal } from './components/LightboxModal';
import { ContactModal } from './components/ContactModal';
import { EditRatesModal } from './components/EditRatesModal';
import { OwnerAuthModal } from './components/OwnerAuthModal';
import { OwnerModeBanner } from './components/OwnerModeBanner';

const AppContent: React.FC = () => {
  const { activePage } = useStudio();

  return (
    <div className="flex min-h-screen flex-col bg-[#09090b] text-[#f4f4f5] selection:bg-[#d4af37]/25 selection:text-[#fef08a]">
      {/* Privileged Owner Mode Status Banner (renders ONLY when Owner Mode is enabled) */}
      <OwnerModeBanner />

      {/* Navigation Header */}
      <Navbar />

      {/* Main View Router */}
      <main className="flex-1">
        {activePage === 'home' && (
          <div>
            {/* 1. Hero / Brand Section */}
            <HeroSection />

            {/* 2. Introduction */}
            <IntroSection />

            {/* 3. About AnthroCraft Studio */}
            <AboutSection />

            {/* 4. Career Milestones */}
            <MilestonesSection />

            {/* 5. Contact Now */}
            <ContactCtaSection />
          </div>
        )}

        {activePage === 'gallery' && (
          <div>
            <GalleryPage />
          </div>
        )}

        {activePage === 'rates' && (
          <div>
            <RateSheetPage />
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer />

      {/* Global Interactive Studio Modals */}
      <UploadModal />
      <LightboxModal />
      <ContactModal />
      <EditRatesModal />
      <OwnerAuthModal />
    </div>
  );
};

export default function App() {
  return (
    <StudioProvider>
      <AppContent />
    </StudioProvider>
  );
}
