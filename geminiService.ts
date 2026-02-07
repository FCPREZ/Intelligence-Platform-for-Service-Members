
import { GoogleGenAI, Type } from "@google/genai";
import { MilitaryProfile, SkillTranslation, CareerRoadmap, InterviewQuestion } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const geminiService = {
  async translateMilitarySkills(profile: MilitaryProfile): Promise<SkillTranslation> {
    const prompt = `Translate this military profile into civilian career data:
    Branch: ${profile.branch}
    MOS/Rate: ${profile.mosCode} - ${profile.mosTitle}
    YOS: ${profile.yearsOfService}
    Leadership: ${profile.leadershipScope}
    Certs: ${profile.certifications.join(', ')}
    Platforms: ${profile.platforms.join(', ')}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            civilianRoles: { type: Type.ARRAY, items: { type: Type.STRING } },
            transferableSkills: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  skill: { type: Type.STRING },
                  civilianContext: { type: Type.STRING }
                },
                required: ['skill', 'civilianContext']
              }
            },
            salaryBands: {
              type: Type.OBJECT,
              properties: {
                low: { type: Type.NUMBER },
                median: { type: Type.NUMBER },
                high: { type: Type.NUMBER },
                currency: { type: Type.STRING }
              },
              required: ['low', 'median', 'high', 'currency']
            },
            industryMatch: { type: Type.NUMBER, description: 'Percentage 0-100' },
            recommendedCerts: { type: Type.ARRAY, items: { type: Type.STRING } },
            logicExplanation: { type: Type.STRING }
          },
          required: ['civilianRoles', 'transferableSkills', 'salaryBands', 'industryMatch', 'recommendedCerts', 'logicExplanation']
        }
      }
    });

    return JSON.parse(response.text || '{}') as SkillTranslation;
  },

  async optimizeResume(content: string, targetIndustry: string): Promise<string> {
    const prompt = `Act as an expert career coach for veterans. 
    Optimize the following resume bullet points or content for the ${targetIndustry} industry. 
    Focus on civilian-optimized language, quantify impact, and align with ATS standards. 
    Do NOT fabricate achievements. 
    Content: ${content}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 4000 }
      }
    });

    return response.text || '';
  },

  async generateRoadmap(profile: MilitaryProfile, targetIndustry: string, targetSalary: string): Promise<CareerRoadmap> {
    const prompt = `Generate a 2-year and 5-year career roadmap for a ${profile.branch} service member (${profile.mosCode}) 
    aiming for the ${targetIndustry} industry with a goal salary of ${targetSalary}. 
    Provide skill gap analysis based on current military experience.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            twoYearPath: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  period: { type: Type.STRING },
                  objective: { type: Type.STRING },
                  actionItems: { type: Type.ARRAY, items: { type: Type.STRING } },
                  milestone: { type: Type.STRING },
                  estimatedSalary: { type: Type.STRING }
                }
              }
            },
            fiveYearPath: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  period: { type: Type.STRING },
                  objective: { type: Type.STRING },
                  actionItems: { type: Type.ARRAY, items: { type: Type.STRING } },
                  milestone: { type: Type.STRING },
                  estimatedSalary: { type: Type.STRING }
                }
              }
            },
            skillGapAnalysis: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  skill: { type: Type.STRING },
                  gapLevel: { type: Type.STRING },
                  recommendation: { type: Type.STRING }
                }
              }
            },
            confidence: { type: Type.NUMBER }
          }
        }
      }
    });

    return JSON.parse(response.text || '{}') as CareerRoadmap;
  },

  async getInterviewQuestions(industry: string, role: string): Promise<InterviewQuestion[]> {
    const prompt = `Generate 5 high-quality interview questions for a veteran applying for a ${role} role in ${industry}. 
    Include behavioral and industry-specific technical questions.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              question: { type: Type.STRING },
              type: { type: Type.STRING },
              hint: { type: Type.STRING }
            }
          }
        }
      }
    });

    return JSON.parse(response.text || '[]') as InterviewQuestion[];
  }
};
