import { generateDesign } from '../lib/ai/fireworks';

// Mock the OpenAI client
jest.mock('openai', () => {
  return jest.fn().mockImplementation(() => {
    return {
      chat: {
        completions: {
          create: jest.fn().mockResolvedValue({
            choices: [
              {
                message: {
                  content: JSON.stringify({
                    theme: {
                      colors: {
                        slideBg: "#FFFFFF",
                        slideBgAlt: "#F8F9FA",
                        cardBg: "#FFFFFF",
                        heading: "#000000",
                        body: "#333333",
                        muted: "#666666",
                        accent: "#007BFF",
                        accentLight: "#4DA3FF",
                        accentGlow: "rgba(0,123,255,0.2)",
                        border: "rgba(0,0,0,0.1)",
                        gradient: "linear-gradient(135deg, #FFFFFF 0%, #F8F9FA 100%)"
                      },
                      fonts: {
                        heading: "Inter",
                        body: "Roboto"
                      },
                      decorative: {
                        shapeColor: "#007BFF",
                        shapeOpacity: 0.1,
                        accentBarColor: "#007BFF",
                        cornerRadius: "8px"
                      }
                    },
                  })
                }
              }
            ]
          }),
        },
      },
    };
  });
});

describe('Fireworks API Client (generateDesign)', () => {
  beforeEach(() => {
    process.env.FIREWORKS_API_KEY = 'test_key';
  });

  it('should generate structured design output via fireworks API', async () => {
    const rawSlides = [
      { slide_number: 1, title: 'Intro', content: 'Hello' },
      { slide_number: 2, title: 'Details', content: 'World' }
    ];
    
    const result = await generateDesign(rawSlides);
    
    expect(result).toHaveProperty('theme');
    expect(result.theme.colors).toHaveProperty('slideBg');
  });

  it('should throw if FIREWORKS_API_KEY is missing', async () => {
    delete process.env.FIREWORKS_API_KEY;
    await expect(generateDesign([])).rejects.toThrow(/FIREWORKS_API_KEY/);
  });
});
