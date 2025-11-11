import { useState } from 'react';
import { AnimatedSection } from '@/components/shared/AnimatedSection';

// --- Data for the image accordion ---
const accordionItems = [{
  id: 1,
  title: 'Voice Assistant',
  imageUrl: 'https://images.unsplash.com/photo-1628258334105-2a0b3d6efee1?q=80&w=1974&auto=format&fit=crop'
}, {
  id: 2,
  title: 'AI Image Generation',
  imageUrl: 'https://images.unsplash.com/photo-1677756119517-756a188d2d94?q=80&w=2070&auto=format&fit=crop'
}, {
  id: 3,
  title: 'AI Chatbot + Local RAG',
  imageUrl: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=1974&auto=format&fit=crop'
}, {
  id: 4,
  title: 'AI Agent',
  imageUrl: 'https://images.unsplash.com/photo-1526628953301-3e589a6a8b74?q=80&w=2090&auto=format&fit=crop'
}, {
  id: 5,
  title: 'Visual Understanding',
  imageUrl: 'https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?q=80&w=2070&auto=format&fit=crop'
}];

// --- Accordion Item Component ---
interface AccordionItemProps {
  item: typeof accordionItems[0];
  isActive: boolean;
  onMouseEnter: () => void;
}
const AccordionItem = ({
  item,
  isActive,
  onMouseEnter
}: AccordionItemProps) => {
  return <div className={`
        relative h-[450px] rounded-2xl overflow-hidden cursor-pointer
        transition-all duration-700 ease-in-out
        ${isActive ? 'w-[400px]' : 'w-[60px]'}
      `} onMouseEnter={onMouseEnter}>
      {/* Background Image */}
      <img src={item.imageUrl} alt={item.title} className="absolute inset-0 w-full h-full object-cover" onError={e => {
      const target = e.target as HTMLImageElement;
      target.onerror = null;
      target.src = 'https://placehold.co/400x450/2d3748/ffffff?text=Image+Error';
    }} />
      {/* Dark overlay for better text readability */}
      <div className="absolute inset-0 bg-black bg-opacity-40"></div>

      {/* Caption Text */}
      <span className={`
          absolute text-white text-lg font-semibold whitespace-nowrap
          transition-all duration-300 ease-in-out
          ${isActive ? 'bottom-6 left-1/2 -translate-x-1/2 rotate-0' // Active state: horizontal, bottom-center
    // Inactive state: vertical, positioned at the bottom, for all screen sizes
    : 'w-auto text-left bottom-24 left-1/2 -translate-x-1/2 rotate-90'}
        `}>
        {item.title}
      </span>
    </div>;
};

// --- Main App Component ---
export function LandingAccordionItem() {
  const [activeIndex, setActiveIndex] = useState(4);
  const handleItemHover = (index: number) => {
    setActiveIndex(index);
  };
  return <section className="container mx-auto px-4 pt-0 pb-12 md:pt-0 md:pb-24 bg-white">
      
    </section>;
}