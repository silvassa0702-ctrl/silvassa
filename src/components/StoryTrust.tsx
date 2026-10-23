import Icon from './Icon';

const iconProps = {
  xmlns: 'http://www.w3.org/2000/svg',
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.75,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

interface StoryTrustProps {
  onOpenStory?: () => void;
  onOpenFeedback?: () => void;
}

export default function StoryTrust({ onOpenStory, onOpenFeedback }: StoryTrustProps) {
  return (
    <section className="story-trust-section" id="footer">
      <div className="story-trust-card">
        {/* Top Story Banner */}
        <div className="story-banner-wrap">
          <div className="story-leaf-accent">
            <svg width="60" height="90" viewBox="0 0 90 120" fill="none">
              <path d="M10 5C30 35 45 75 40 115" stroke="#1f382b" strokeWidth="3" strokeLinecap="round" />
              <path d="M22 25C10 20 2 28 5 38C15 42 25 35 22 25Z" fill="#2d5a3f" />
              <path d="M32 48C18 45 10 55 15 65C28 68 38 58 32 48Z" fill="#1f382b" />
              <path d="M38 72C22 72 18 85 25 92C38 92 42 80 38 72Z" fill="#3b694b" />
            </svg>
          </div>

          <div className="story-banner-content">
            <h2 className="story-headline">
              More Than a Treat.
              <br />
              A Thoughtful Choice.
              <svg className="story-inline-leaf" viewBox="0 0 24 24">
                <path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22C6.91 19 8.86 14.5 14 13V18L21 11L14 4V9C12 9 9 7 7 4C7 4 13 5 17 8Z" />
              </svg>
            </h2>

            <p className="story-desc">
              At Silvassa, we believe the little things we enjoy every day deserve care, quality and thoughtful
              preparation.
            </p>

            <div className="story-actions-cluster">
              {onOpenStory ? (
                <button
                  type="button"
                  className="story-btn"
                  onClick={(e) => {
                    e.preventDefault();
                    onOpenStory();
                  }}
                >
                  <span>OUR STORY</span>
                  <Icon name="arrow-right" />
                </button>
              ) : (
                <a href="#foodSection" className="story-btn">
                  <span>OUR STORY</span>
                  <Icon name="arrow-right" />
                </a>
              )}

              {onOpenFeedback && (
                <button
                  type="button"
                  className="story-btn story-feedback-btn"
                  onClick={(e) => {
                    e.preventDefault();
                    onOpenFeedback();
                  }}
                >
                  <Icon name="pencil-square" />
                  <span>FEEDBACK</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Trust Bar */}
        <div className="trust-bar-container">
          <div className="trust-bar-grid">
            <div className="trust-col">
              <div className="trust-col-icon">
                <svg {...iconProps}>
                  <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
                  <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
                </svg>
              </div>
              <span className="trust-col-title">Fresh Ingredients</span>
            </div>

            <div className="trust-col">
              <div className="trust-col-icon">
                <svg {...iconProps}>
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  <polyline points="9 12 11 14 15 10" />
                </svg>
              </div>
              <span className="trust-col-title">Secure Payments</span>
            </div>

            <div className="trust-col">
              <div className="trust-col-icon">
                <svg {...iconProps}>
                  <rect x="1" y="3" width="15" height="13" rx="1" />
                  <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                  <circle cx="5.5" cy="18.5" r="2.5" />
                  <circle cx="18.5" cy="18.5" r="2.5" />
                  <line x1="1" y1="9" x2="4" y2="9" />
                </svg>
              </div>
              <span className="trust-col-title">Delivery Available</span>
              <span className="trust-col-sub">(Selected Areas)</span>
            </div>

            <div className="trust-col">
              <div className="fssai-brand-box">
                <svg
                  className="fssai-svg"
                  viewBox="0 0 19.639 9.69"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="m130.24 146.604.005-.02zm-1.854 1.432c-.64 0-.222-1.413-.111-1.73.118-.338.443-1.04.722-1.248.321-.24.675-.238 1.06-.183.085.013.453.091.536.13l-.134.67-.219.44a7 7 0 0 1-.38.61l-.424.546-.395.43c-.139.138-.46.335-.655.335m1.854-1.432c0 .064-.09.49-.109.588-.038.195-.072.385-.113.584-.078.389.027.857.486.859.447.001.85-.279 1.132-.517.1-.085.131-.124.225-.216.03-.031.144-.164.156-.198.009-.025.047-.269.047-.305l-.23.24q-.002.005-.004.006l-.015.014c-.127.11-.232.229-.39.336-.132.09-.408.285-.575.187-.177-.104-.068-.514-.038-.664.021-.109.048-.223.072-.34.113-.57.245-1.138.358-1.701l.214-1.03c-.11 0-.226-.019-.294-.021-.43-.022-.88-.042-1.307.027a2.497 2.497 0 0 0-1.13.458l-.176.139a3.5 3.5 0 0 0-.539.52c-.357.444-.573.854-.705 1.414-.097.418-.12 1.015.163 1.393.319.428.81.264 1.196.035.107-.064.205-.144.3-.22.025-.017.036-.031.059-.05.126-.101.212-.195.327-.31l.2-.221c.19-.224.502-.663.647-.942.018-.033.016-.046.043-.065M120.168 143.544l-.673-.006v-.396l.75-.005c.002-.067.028-.165.04-.23.116-.58.103-.942.482-1.412.275-.34.749-.455 1.179-.328.075.023.131.046.195.079l.184.091.581-.576c-.055-.004-.15-.023-.201-.03-.675-.034-1.277.014-1.875.376-.669.405-1.15 1.142-1.316 1.902-.035.164-.014.127-.092.123l-.924-.002c-.051.003-.048.007-.048.06v.354h.962c0 .055-.065.377-.079.46q-.038.226-.082.457c-.114.598-.211 1.249-.327 1.841-.03.154-.056.304-.082.459q-.04.23-.083.464c-.147.818-.24 1.957-1.174 2.073-.379.047-.625-.051-.94-.124l-.116.138c-.04.05-.083.09-.123.142l-.21.241c-.026.033-.036.033-.04.08.487 0 .977.06 1.443-.11l.113-.043c.238-.095.408-.213.603-.369l.16-.152c.049-.063.14-.155.225-.267.048-.063.087-.126.132-.192.042-.065.076-.127.116-.198.35-.627.572-1.48.711-2.181.035-.173.075-.366.105-.543.089-.536.211-1.098.302-1.63z"
                    style={{ fill: '#2e3192', fillOpacity: 1, fillRule: 'evenodd', stroke: 'none', strokeWidth: 0.0352778 }}
                    transform="translate(-116.152 -140.23)"
                  />
                  <path
                    d="M120.168 143.544h15.457l.166-.412-2.834-.003-.138.006c-.12-.015-6.257-.003-6.297-.003h-5.894c-.111 0-.302.01-.382.004l-.751.005v.396zM133.055 144.77c.126 0 .262-.009.36.09.167.168.061.494.025.688l-.077.403-.229 1.203c-.044.22-.216 1.064-.216 1.225 0 .23.016.473.178.636.16.16.282.208.528.208.334 0 .729-.211.989-.384l.575-.455c.014-.033.005-.282.005-.338-.046.012-.09.084-.146.13-.181.143-.243.222-.484.369-.139.084-.453.237-.591.065-.128-.16-.065-.455-.029-.637l.828-4.085c-.048.022-.133.042-.192.062-.314.105-.664.204-.976.309l-.976.31c-.103.029-.166.037-.17.093-.028.293-.035.263.066.234.031-.01.072-.019.109-.03.08-.022.349-.096.423-.096"
                    style={{ fill: '#f25b28', fillOpacity: 1, fillRule: 'evenodd', stroke: 'none', strokeWidth: 0.0352778 }}
                    transform="translate(-116.152 -140.23)"
                  />
                  <path
                    d="M124.325 145.575c0 .33.103.551.297.742l.558.63c.091.113.177.17.26.337.194.385.1.801-.363.905-.108.024-.182.017-.29.014-.155-.004-.365-.077-.505-.133-.217-.087-.249-.126-.427-.22-.035.052-.262.273-.312.326l-.188.203c.083.045.394.137.483.155.628.133 1.237.098 1.767-.268.122-.085.286-.245.362-.374.051-.086.083-.139.118-.244a1 1 0 0 0-.17-.947l-.644-.787c-.077-.098-.194-.22-.246-.323-.069-.14-.122-.262-.101-.458.033-.312.388-.49.657-.49.124 0 .222-.003.342.04.177.064.364.205.364.42 0 .161-.012.125-.02.216h.246c.022-.044.085-.34.1-.409l.096-.424c-.091-.022-.157-.07-.366-.106a2 2 0 0 0-1.194.135c-.139.062-.321.168-.428.277l-.09.088c-.17.196-.306.401-.306.695M120.863 145.604c0 .206.075.444.2.604l.472.53c.018.023.027.03.047.05l.24.27c.104.102.258.354.258.556 0 .193-.052.354-.19.457-.367.276-.9.092-1.26-.087-.04-.02-.072-.04-.113-.062-.037-.02-.076-.053-.115-.062l-.378.386c-.051.066-.11.1-.122.143.043.01.075.025.11.038q.06.021.117.04c.634.213 1.474.202 2.01-.194.141-.104.256-.205.354-.352a1.016 1.016 0 0 0-.041-1.228l-.821-1.003a.4.4 0 0 1-.079-.128c-.057-.128-.09-.202-.09-.36 0-.714 1.373-.761 1.373-.05 0 .072-.019.108-.02.167.285 0 .246.023.27-.084q.011-.059.023-.104c.023-.095.128-.594.148-.635-.199-.106-.52-.147-.794-.147-.439 0-.948.198-1.174.424-.034.033-.06.048-.094.083-.02.021-.021.027-.04.049-.136.161-.233.307-.271.532-.007.04-.02.124-.02.167"
                    style={{ fill: '#2e3192', fillOpacity: 1, fillRule: 'evenodd', stroke: 'none', strokeWidth: 0.0352778 }}
                    transform="translate(-116.152 -140.23)"
                  />
                  <path
                    d="M133.585 142.78c-.054.078-.22.165-.327.202a1.7 1.7 0 0 1-.322.071c-.048.003-.087.01-.126.01 0 .04-.001.044.01.072l.137-.006c.024-.01.33-.02.575-.197.155-.112.036-.075.214-.1.057-.008.086-.007.14-.017.814-.166 1.134-1.227 1.14-1.978l.018-.297c.01-.08.003-.223.003-.31h-.02c-.01.13-.252.495-.334.608-.505.564-1.287 1.119-1.108 1.942"
                    style={{ fill: '#278d30', fillOpacity: 1, fillRule: 'evenodd', stroke: 'none', strokeWidth: 0.0352778 }}
                    transform="translate(-116.152 -140.23)"
                  />
                  <path
                    d="M133.526 142.514"
                    style={{ fill: '#a0402a', fillOpacity: 1, fillRule: 'evenodd', stroke: 'none', strokeWidth: 0.0352778 }}
                    transform="translate(-116.152 -140.23)"
                  />
                  <path
                    d="M133.046 142.136a.362.362 0 1 1 .001.723.362.362 0 0 1 0-.723"
                    style={{ fill: '#7a350e', fillOpacity: 1, fillRule: 'evenodd', stroke: 'none', strokeWidth: 0.0352778 }}
                    transform="translate(-116.152 -140.23)"
                  />
                  <path
                    d="m134.455 149.525-.198.395h-18.105v-.074c.942.065 1.563-.062 1.965-.32z"
                    style={{ fill: '#278d30', fillOpacity: 1, fillRule: 'evenodd', stroke: 'none', strokeWidth: 0.0352778 }}
                    transform="translate(-116.152 -140.23)"
                  />
                </svg>
              </div>
              <div className="fssai-tag">
                <span className="fssai-line"></span>
                <span>CERTIFIED</span>
                <span className="fssai-line"></span>
              </div>
            </div>

            <div className="trust-col contact-col">
              <a href="tel:+919361840921" className="trust-contact-link">
                <Icon name="telephone-fill" />
                <span>+91 9361840921</span>
              </a>
              <a
                href="https://wa.me/917810045660"
                target="_blank"
                rel="noopener noreferrer"
                className="trust-contact-link"
              >
                <Icon name="whatsapp" />
                <span>+91 7810045660</span>
              </a>
              <a href="mailto:silvassa0702@gmail.com" className="trust-contact-link">
                <Icon name="envelope-fill" />
                <span>silvassa0702@gmail.com</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
