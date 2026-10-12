import Icon from './Icon';

interface OurStoryPageProps {
  onBack: () => void;
  onGoFeedback?: () => void;
}

export default function OurStoryPage({ onBack, onGoFeedback }: OurStoryPageProps) {
  return (
    <div className="story-page-view">
      {/* Top Banner / Hero */}
      <section className="story-hero-section">
        <div className="story-hero-overlay"></div>
        <div className="story-hero-content">
          <button className="story-back-btn" onClick={onBack} aria-label="Back to Home">
            <Icon name="arrow-left" />
            <span>Back to Home</span>
          </button>

          <span className="story-hero-pill">OUR PHILOSOPHY & STORY</span>
          <h1 className="story-hero-title">
            Every great journey begins with a simple thought.
          </h1>
          <p className="story-hero-tagline">
            Made with thought. Made for better living.
          </p>
        </div>
      </section>

      {/* Main Story Article Container */}
      <main className="story-article-container">
        {/* Intro Card */}
        <section className="story-block story-intro-card">
          <div className="story-intro-accent-bar"></div>
          <div className="story-block-text">
            <h2 className="story-section-title">A Thought for Better Living</h2>
            <p className="story-lead-paragraph">
              Every little choice matters. Even the food we enjoy.
            </p>
            <p className="story-body-p">
              Silvassa was born from a simple belief: everyday food should be more than just delicious.
              It should be thoughtfully prepared, beautifully presented, and made with care.
            </p>
            <p className="story-body-p">
              We believe life's sweetest moments deserve something special. From sharing brownies with family
              to enjoying a slice of cake with someone you love, the little things we eat often become the memories we cherish.
            </p>
            <p className="story-body-p">
              That's why, at Silvassa, we focus on bringing together <strong>taste</strong>, <strong>quality</strong>, <strong>freshness</strong>, and <strong>thoughtful preparation</strong> in everything we make.
            </p>
          </div>
          {/* <div className="story-intro-image-wrap">
            <img
              src={assetUrl('img/hero.png')}
              alt="Moments of joy with Silvassa"
              className="story-inline-img story-intro-img"
            />
            <div className="story-img-caption">
              <span>Freshly crafted moments made for sharing</span>
            </div>
          </div> */}
        </section>

        {/* Section 1: Our Beginning */}
        <section className="story-block story-split-block">
          {/* <div className="story-split-img-col">
            <div className="story-img-frame">
              <img
                src={assetUrl('img/choc-chunk-brownie.jpg')}
                alt="Silvassa Freshly Baked Treats"
                className="story-inline-img"
              />
            </div>
          </div> */}
          <div className="story-split-text-col">
            <span className="story-sub-tag">01 / OUR BEGINNING</span>
            <h2 className="story-section-title">A Love for Baking</h2>
            <p className="story-body-p">
              Every Silvassa creation begins with a love for baking and a passion for making ordinary moments special.
            </p>
            <p className="story-body-p">
              What started with the joy of creating homemade brownies, cakes, and cookies grew into a bigger vision:
              to offer treats that people can enjoy with confidence, knowing that care and attention go into their preparation.
            </p>
            <p className="story-body-p">
              We believe that good food doesn't need to be complicated. Sometimes, it's simply about choosing quality ingredients,
              preparing food with care, and paying attention to every little detail.
            </p>
          </div>
        </section>

        {/* Section 2: Our Philosophy Grid */}
        <section className="story-block story-philosophy-block">
          <div className="story-center-head">
            <span className="story-sub-tag">02 / OUR PHILOSOPHY</span>
            <h2 className="story-section-title">Goodness in Every Bite</h2>
            <p className="story-body-p story-center-p">
              At Silvassa, we believe that delicious food and thoughtful choices can go hand in hand.
            </p>
          </div>

          <div className="philosophy-cards-grid">
            <div className="philosophy-card">
              <div className="philosophy-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 13.87A4 4 0 0 1 7.41 6a5.11 5.11 0 0 1 10.58 0A4 4 0 0 1 18 13.87V21H6z" />
                </svg>
              </div>
              <h3>Freshness Matters</h3>
              <p>
                We aim to prepare every item only after an order is placed, rather than making products in advance and storing them for future orders.
              </p>
            </div>

            <div className="philosophy-card">
              <div className="philosophy-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
                  <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
                </svg>
              </div>
              <h3>Ingredients Matter</h3>
              <p>
                We carefully select ingredients with a focus on quality, taste, and the experience each product delivers.
              </p>
            </div>

            <div className="philosophy-card">
              <div className="philosophy-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  <path d="m9 12 2 2 4-4" />
                </svg>
              </div>
              <h3>Honesty Matters</h3>
              <p>
                We believe customers deserve clear information about what they eat, including ingredients and preparation practices.
              </p>
            </div>

            <div className="philosophy-card">
              <div className="philosophy-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
              </div>
              <h3>The Little Details Matter</h3>
              <p>
                From the texture of a brownie to the presentation of a cake, we pay attention to the details that make every experience special.
              </p>
            </div>
          </div>
        </section>

        {/* Section 3: Vision for Better Living */}
        <section className="story-block story-split-block story-split-reverse">
          {/* <div className="story-split-img-col">
            <div className="story-img-frame">
              <img
                src={assetUrl('img/why-silvassa.png')}
                alt="Silvassa Vision for Better Living"
                className="story-inline-img"
              />
            </div>
          </div> */}
          <div className="story-split-text-col">
            <span className="story-sub-tag">03 / BEYOND THE BAKERY</span>
            <h2 className="story-section-title">A Vision for Better Living</h2>
            <p className="story-body-p">
              We see Silvassa as more than a place for cakes, brownies, and cookies.
            </p>
            <p className="story-body-p">
              Our long-term vision is to bring together the joy of indulgence and the value of thoughtful food choices.
              As we grow, we hope to explore more options that fit naturally into everyday living, including nutritious snacks and freshly prepared juices.
            </p>
            <p className="story-body-p">
              We want to make food experiences that feel good, look beautiful, and bring people closer to the choices that matter to them.
            </p>
            <blockquote className="story-quote">
              "For us, better living isn't about giving up life's little pleasures. It's about enjoying them thoughtfully."
            </blockquote>
          </div>
        </section>

        {/* Section 4: Our Promise */}
        <section className="story-block story-promise-banner">
          <div className="story-promise-inner">
            <span className="story-sub-tag light-tag">04 / OUR COMMITMENT</span>
            <h2 className="story-promise-title">Our Promise to You</h2>
            <p className="story-promise-p">
              Every order is an opportunity to earn your trust.
            </p>
            <p className="story-promise-p">
              We are committed to approaching our work with care, maintaining consistent quality,
              presenting our products beautifully, and treating every customer with honesty and respect.
            </p>
            <p className="story-promise-p">
              As Silvassa grows, our purpose will remain the same: to make everyday food experiences
              more thoughtful, more enjoyable, and more meaningful.
            </p>

            <div className="story-signature-wrap">
              {/* <div className="story-sign-badge">
                <img src={assetUrl('img/logo.png')} alt="Silvassa seal" className="story-sign-logo" />
                <div>
                  <div className="story-sign-brand">Silvassa</div>
                  <div className="story-sign-motto">Goodness in Every Bite.</div>
                </div>
              </div> */}
              <p className="story-final-tagline">
                Made with thought. Made for better living.
              </p>
            </div>

            <div className="story-promise-actions">
              <button className="story-cta-menu-btn" onClick={onBack}>
                <span>Explore What's Baking</span>
                <Icon name="arrow-right" />
              </button>
              {onGoFeedback && (
                <button
                  className="story-cta-menu-btn story-cta-feedback-btn"
                  onClick={onGoFeedback}
                >
                  <Icon name="pencil-square" />
                  <span>Give Feedback</span>
                </button>
              )}
            </div>
          </div>
        </section>
      </main>

      {/* Trust Bar Footer reuse */}
      {/* <StoryTrust onOpenStory={() => { }} /> */}
    </div>
  );
}
