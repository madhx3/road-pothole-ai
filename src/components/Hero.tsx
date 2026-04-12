import { ArrowRight, Sparkles } from 'lucide-react';
import GlassCard from './GlassCard';

export default function Hero() {
  const scrollToDemo = () => {
    const section = document.getElementById("demo");
    section?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-4 sm:px-6 lg:px-8">
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-blue-900/20 to-purple-900/20" />

      <div className="relative z-10 text-center max-w-5xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 bg-blue-500/20 border border-blue-400/30 rounded-full backdrop-blur-sm">
          <Sparkles className="w-4 h-4 text-blue-400" />
          <span className="text-sm text-blue-300 font-medium">
            Powered by AI & Computer Vision
          </span>
        </div>

        <h1 className="text-5xl font-bold mb-6 text-white">
          AI-Powered Pothole Detection System
        </h1>

        <p className="text-xl text-gray-300 mb-12">
          Detect road damage using computer vision
        </p>

        <button
          onClick={scrollToDemo}
          className="inline-flex items-center gap-3 px-8 py-4 bg-blue-600 rounded-xl text-white"
        >
          <span>Start</span>
          <ArrowRight className="w-5 h-5" />
        </button>

        <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-full max-w-2xl">
          <GlassCard className="p-6">
            <div className="flex justify-between text-sm text-gray-300">
              <span>System Online</span>
              <span>99.2% Accuracy</span>
              <span>Real-time</span>
            </div>
          </GlassCard>
        </div>
      </div>
    </section>
  );
}