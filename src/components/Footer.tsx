import { Github, Linkedin, Mail, Heart } from 'lucide-react';
import GlassCard from './GlassCard';

export default function Footer() {
  const socialLinks = [
    { icon: Github, href: 'https://github.com/madhx3', label: 'GitHub' },
    { icon: Linkedin, href: 'https://www.linkedin.com/in/madhan-a-5003512a0', label: 'LinkedIn' },
    { icon: Mail, href: 'mailto:madhx2005@gmail.com', label: 'Email' },
  ];

  return (
    <footer className="py-16 px-4 sm:px-6 lg:px-8 relative mt-20">
      <div className="max-w-7xl mx-auto">
        <GlassCard className="p-8 sm:p-12">
          <div className="flex flex-col md:flex-row justify-between gap-8 mb-8">
            <div className="max-w-sm">
              <h3 className="text-2xl font-bold text-white mb-3 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                Pothole Detection System
              </h3>
              <p className="text-gray-400 leading-relaxed text-sm">
                AI-powered solution for automated road damage detection using computer vision and deep learning technology.
              </p>
            </div>
            <div className="text-right">
              <h4 className="text-white font-semibold mb-4">Connect With Us</h4>
              <div className="flex gap-3 justify-end">
                {socialLinks.map((link, index) => (
                  <a key={index} href={link.href} aria-label={link.label} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-all hover:scale-110">
                    <link.icon className="w-5 h-5 text-gray-300" />
                  </a>
                ))}
              </div>
            </div>
          </div>
          <div className="pt-8 border-t border-white/10">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-400">
              <p>A mini project by <span className="text-blue-400 font-semibold">Madhan and team</span></p>
              <p className="flex items-center gap-2">
                Made with <Heart className="w-4 h-4 text-red-500 fill-red-500" /> by students of REVA UNIVERSITY
              </p>
            </div>
          </div>
        </GlassCard>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50" />
    </footer>
  );
}