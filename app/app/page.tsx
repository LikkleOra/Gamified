export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden px-6 py-20 md:py-32">
        {/* Gradient Background */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-block mb-6 px-4 py-2 rounded-full glass border border-primary/30">
            <span className="text-sm font-medium gradient-text">✨ Level Up Your Life</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fadeIn">
            Build Habits,
            <br />
            <span className="gradient-text">Earn XP, Level Up</span>
          </h1>

          <p className="text-xl md:text-2xl text-text-secondary mb-10 max-w-2xl mx-auto">
            Transform your daily routines into an epic adventure. Complete habits, focus with Pomodoro, and watch your progress soar.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button className="group relative px-8 py-4 bg-gradient-to-r from-primary to-secondary rounded-xl font-semibold text-lg transition-smooth hover:scale-105 hover:shadow-lg hover:shadow-primary/50">
              <span className="relative z-10">Start Your Journey</span>
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary-hover to-secondary-hover opacity-0 group-hover:opacity-100 transition-smooth"></div>
            </button>

            <button className="px-8 py-4 glass rounded-xl font-semibold text-lg transition-smooth hover:scale-105 hover:border-primary/50">
              Learn More
            </button>
          </div>

          {/* Stats */}
          <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glass p-6 rounded-2xl transition-smooth hover:scale-105">
              <div className="text-4xl font-bold gradient-text mb-2">🎯</div>
              <div className="text-3xl font-bold mb-1">Track Habits</div>
              <div className="text-text-secondary">Build consistency daily</div>
            </div>

            <div className="glass p-6 rounded-2xl transition-smooth hover:scale-105">
              <div className="text-4xl font-bold gradient-text mb-2">⏱️</div>
              <div className="text-3xl font-bold mb-1">Pomodoro Timer</div>
              <div className="text-text-secondary">Focus & earn rewards</div>
            </div>

            <div className="glass p-6 rounded-2xl transition-smooth hover:scale-105">
              <div className="text-4xl font-bold gradient-text mb-2">🏆</div>
              <div className="text-3xl font-bold mb-1">Gamification</div>
              <div className="text-text-secondary">XP, levels & badges</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-6 py-20 bg-bg-secondary/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">
            Why <span className="gradient-text">Gamified</span>?
          </h2>
          <p className="text-xl text-text-secondary text-center mb-16 max-w-2xl mx-auto">
            We make productivity addictive by turning your goals into a game you'll actually want to play.
          </p>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Feature 1 */}
            <div className="group glass p-8 rounded-2xl transition-smooth hover:scale-105 hover:border-primary/50">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center mb-4 group-hover:animate-glow">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="text-2xl font-bold mb-3">Instant Gratification</h3>
              <p className="text-text-secondary leading-relaxed">
                Get immediate XP rewards for every habit completed and Pomodoro session finished. Watch your level grow in real-time.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group glass p-8 rounded-2xl transition-smooth hover:scale-105 hover:border-primary/50">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center mb-4 group-hover:animate-glow">
                <span className="text-2xl">🔥</span>
              </div>
              <h3 className="text-2xl font-bold mb-3">Streak Tracking</h3>
              <p className="text-text-secondary leading-relaxed">
                Build momentum with daily streaks. The longer you maintain your habits, the more powerful your rewards become.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group glass p-8 rounded-2xl transition-smooth hover:scale-105 hover:border-primary/50">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center mb-4 group-hover:animate-glow">
                <span className="text-2xl">🎨</span>
              </div>
              <h3 className="text-2xl font-bold mb-3">Beautiful Interface</h3>
              <p className="text-text-secondary leading-relaxed">
                A stunning, modern design that makes tracking your progress a joy. Dark mode, smooth animations, and vibrant colors.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="group glass p-8 rounded-2xl transition-smooth hover:scale-105 hover:border-primary/50">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center mb-4 group-hover:animate-glow">
                <span className="text-2xl">📊</span>
              </div>
              <h3 className="text-2xl font-bold mb-3">Progress Insights</h3>
              <p className="text-text-secondary leading-relaxed">
                Visualize your growth with detailed stats, charts, and achievements. See how far you've come on your journey.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-20">
        <div className="max-w-4xl mx-auto text-center glass p-12 rounded-3xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10"></div>
          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to <span className="gradient-text">Level Up</span>?
            </h2>
            <p className="text-xl text-text-secondary mb-8">
              Join thousands of users who are transforming their lives, one habit at a time.
            </p>
            <button className="px-10 py-5 bg-gradient-to-r from-primary to-secondary rounded-xl font-bold text-xl transition-smooth hover:scale-105 hover:shadow-2xl hover:shadow-primary/50">
              Get Started Free
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
