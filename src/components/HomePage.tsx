
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Check, Lock, MessageSquare } from 'lucide-react';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-canvas-cloud">
      {/* Hero Section */}
      <section className="relative px-4 py-16 md:py-24">
        <div className="max-w-4xl mx-auto text-center">
          {/* Hero Graphic - Purple blob with interface */}
          <div className="relative mb-12">
            <div className="w-80 h-80 md:w-96 md:h-96 mx-auto relative">
              {/* Purple blob background */}
              <div className="absolute inset-0 bg-gradient-to-br from-accent-lavender/30 to-accent-lavender/20 rounded-full blur-3xl"></div>
              
              {/* Interface mockup */}
              <div className="relative z-10 pt-16">
                <div className="bg-white rounded-lg shadow-lg p-4 max-w-xs mx-auto">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-2 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-2 bg-gray-200 rounded w-1/2"></div>
                    <div className="bg-highlight-amber text-ink-obsidian px-3 py-1 rounded text-xs font-medium inline-block">
                      Find grants
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Hero Text */}
          <h1 className="text-4xl md:text-6xl font-bold text-ink-obsidian mb-6 leading-tight">
            "I like writing grants!" <br />
            <span className="italic">said no one ever.</span>
          </h1>
          
          <p className="text-lg md:text-xl text-ink-obsidian/80 mb-4">
            Get matched with grants and start thy chasing with AI.
          </p>
          
          <p className="text-sm text-ink-obsidian/60 mb-8">
            Describe the project you are seeking funding for.
          </p>

          <Button className="bg-highlight-amber hover:bg-highlight-amber/90 text-ink-obsidian font-semibold px-8 py-3 text-lg">
            Find grants
          </Button>
        </div>
      </section>

      {/* Video/Demo Section */}
      <section className="px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="border-2 border-dashed border-accent-lavender/30 rounded-lg h-80 flex items-center justify-center bg-white/50">
            <p className="text-ink-obsidian/60">Video och se vår produkt fungerar</p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-ink-obsidian mb-4">
              It's like AI agents and Grants had a <Badge className="bg-highlight-amber text-ink-obsidian">baby</Badge>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-accent-lavender/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="w-6 h-6 text-accent-lavender" />
              </div>
              <h3 className="font-semibold text-ink-obsidian mb-2">Our models is trained on real grants</h3>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-accent-lavender/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="w-6 h-6 text-accent-lavender" />
              </div>
              <h3 className="font-semibold text-ink-obsidian mb-2">End-to-end encryption for all your data</h3>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-accent-lavender/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-6 h-6 text-accent-lavender" />
              </div>
              <h3 className="font-semibold text-ink-obsidian mb-2">Your data is never shared with third parties</h3>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-ink-obsidian mb-2">
              Our wall of fame 💜
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="p-6 bg-white">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-accent-lavender rounded-full"></div>
                  <div>
                    <h4 className="font-semibold text-ink-obsidian">Kalle Peanerd</h4>
                    <p className="text-sm text-ink-obsidian/60">CEO, Startup</p>
                  </div>
                </div>
                <p className="text-sm text-ink-obsidian/80">
                  "This thing works a charm. I submitted my first grant and got the best result I could ask for. It's magic!"
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-ink-obsidian">
              Flexible Pricing
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Free Plan */}
            <Card className="p-6 bg-accent-lavender/10 border-accent-lavender/20">
              <div className="text-center">
                <h3 className="text-xl font-bold text-ink-obsidian mb-2">Free Plan</h3>
                <div className="mb-6">
                  <span className="text-3xl font-bold text-ink-obsidian">0 SEK</span>
                  <span className="text-ink-obsidian/60">/month</span>
                </div>
                <ul className="space-y-2 mb-6 text-left">
                  <li className="text-sm text-ink-obsidian">See all active grants</li>
                  <li className="text-sm text-ink-obsidian">See all active grants</li>
                </ul>
                <Button className="w-full bg-highlight-amber hover:bg-highlight-amber/90 text-ink-obsidian">
                  Subscribe
                </Button>
              </div>
            </Card>

            {/* Standard Plan */}
            <Card className="p-6 bg-accent-lavender/5 border-accent-lavender/20">
              <div className="text-center">
                <h3 className="text-xl font-bold text-ink-obsidian mb-2">Standard Plan</h3>
                <div className="mb-6">
                  <span className="text-3xl font-bold text-ink-obsidian">499 SEK</span>
                  <span className="text-ink-obsidian/60">/month</span>
                </div>
                <ul className="space-y-2 mb-6 text-left">
                  <li className="text-sm text-ink-obsidian">See all active grants</li>
                  <li className="text-sm text-ink-obsidian">See all active grants</li>
                </ul>
                <Button className="w-full bg-highlight-amber hover:bg-highlight-amber/90 text-ink-obsidian">
                  Subscribe
                </Button>
              </div>
            </Card>

            {/* Custom Plan */}
            <Card className="p-6 bg-highlight-amber/10 border-highlight-amber/20">
              <div className="text-center">
                <h3 className="text-xl font-bold text-ink-obsidian mb-2">Custom Plan</h3>
                <div className="mb-6">
                  <span className="text-3xl font-bold text-ink-obsidian">X SEK</span>
                  <span className="text-ink-obsidian/60">/month</span>
                </div>
                <ul className="space-y-2 mb-6 text-left">
                  <li className="text-sm text-ink-obsidian">See all active grants</li>
                  <li className="text-sm text-ink-obsidian">See all active grants</li>
                </ul>
                <Button className="w-full bg-highlight-amber hover:bg-highlight-amber/90 text-ink-obsidian">
                  Subscribe
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-4 py-16">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-ink-obsidian">
              Questions & Answers
            </h2>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-ink-obsidian mb-2">How does this work?</h3>
            </div>
            <div>
              <h3 className="font-semibold text-ink-obsidian mb-2">How is this different from other LLMs?</h3>
            </div>
            <div>
              <h3 className="font-semibold text-ink-obsidian mb-2">Who can benefit from using Granigent?</h3>
              <p className="text-ink-obsidian/70 text-sm">
                Anyone curious in, independent, or academic researchers pushing the boundaries of knowledge, 
                both stage and growth stage startups having bold ideas that need reliable products or services.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-ink-obsidian mb-2">How do I know it is accurate?</h3>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-ink-obsidian mb-8">
            Try it yourself!
          </h2>
          <Button className="bg-highlight-amber hover:bg-highlight-amber/90 text-ink-obsidian font-semibold px-8 py-3 text-lg mb-8">
            Start for free
          </Button>
          
          <div className="mt-16">
            <p className="text-ink-obsidian/60 mb-2">More questions?</p>
            <p className="text-ink-obsidian/60 mb-8">Contact us at granigent@granigent.com</p>
            
            <div className="text-accent-lavender font-bold text-xl">
              granigent
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
