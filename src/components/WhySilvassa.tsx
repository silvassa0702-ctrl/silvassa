const FEATURES = [
  {
    title: 'Freshly Prepared',
    text: 'Every item is prepared only after you place your order. Nothing is made in advance, ensuring maximum freshness.',
    paths: ['M6 13.87A4 4 0 0 1 7.41 6a5.11 5.11 0 0 1 10.58 0A4 4 0 0 1 18 13.87V21H6z'],
    line: true,
  },
  {
    title: 'Thoughtfully Selected',
    text: 'We choose high-quality ingredients with care. No added preservatives or artificial colours — just natural goodness.',
    paths: [
      'M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z',
      'M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12',
    ],
  },
  {
    title: 'Made with Care',
    text: 'From mixing to baking, every step is done with attention to detail, passion and strict hygiene standards.',
    paths: [
      'M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z',
    ],
  },
  {
    title: 'Naturally Good',
    text: 'We believe in honest food. Pure ingredients that bring out the best flavor and quality in every single bite.',
    paths: [
      'M12 22v-8',
      'M12 14c-2.5 0-5-1.8-5-4.5 0-2 1.5-3.5 3.5-3.5 2.5 0 3.5 2.5 3.5 4.5',
      'M12 14c2.5 0 5-1.8 5-4.5 0-2-1.5-3.5-3.5-3.5-2.5 0-3.5 2.5-3.5 4.5',
      'm19 3 1 2 2 1-2 1-1 2-1-2-2-1 2-1z',
    ],
  },
];

export default function WhySilvassa() {
  return (
    <section className="why-silvassa-section">
      <div className="container">
        <div className="section-tagline">— Why Silvassa? —</div>
        <h2 className="section-heading">
          Made with thought.
          <br />
          Made for better living.
        </h2>

        <div className="features-grid">
          {FEATURES.map((f) => (
            <div className="feature-card" key={f.title}>
              <div className="icon-wrapper">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  {f.paths.map((d) => (
                    <path key={d} d={d} />
                  ))}
                  {f.line && <line x1="6" y1="17" x2="18" y2="17" />}
                </svg>
              </div>
              <h3 className="feature-title">{f.title}</h3>
              <p className="feature-description">{f.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
