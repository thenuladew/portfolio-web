'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import CVModal from '@/components/CVModal';
import Hero from '@/components/sections/Hero';
import About from '@/components/sections/About';
import Skills from '@/components/sections/Skills';
import Projects from '@/components/sections/Projects';
import CaseStudies from '@/components/sections/CaseStudies';
import Contact from '@/components/sections/Contact';
import Footer from '@/components/Footer';

export default function HomePage() {
  const [cvModalOpen, setCVModalOpen] = useState(false);

  return (
    <>
      <Navbar onOpenCV={() => setCVModalOpen(true)} />
      <main>
        <Hero onOpenCV={() => setCVModalOpen(true)} />
        <About />
        <Skills />
        <Projects />
        <CaseStudies />
        <Contact />
      </main>
      <Footer />
      <CVModal isOpen={cvModalOpen} onClose={() => setCVModalOpen(false)} />
    </>
  );
}
