
export type Branch = 'Army' | 'Navy' | 'Air Force' | 'Marine Corps' | 'Coast Guard' | 'Space Force';

export interface MilitaryProfile {
  branch: Branch;
  mosCode: string;
  mosTitle: string;
  yearsOfService: number;
  leadershipScope: string;
  certifications: string[];
  platforms: string[];
}

export interface SkillTranslation {
  civilianRoles: string[];
  transferableSkills: {
    skill: string;
    civilianContext: string;
  }[];
  salaryBands: {
    low: number;
    median: number;
    high: number;
    currency: string;
  };
  industryMatch: number;
  recommendedCerts: string[];
  logicExplanation: string;
}

export interface RoadmapStep {
  period: string;
  objective: string;
  actionItems: string[];
  milestone: string;
  estimatedSalary?: string;
}

export interface CareerRoadmap {
  twoYearPath: RoadmapStep[];
  fiveYearPath: RoadmapStep[];
  skillGapAnalysis: {
    skill: string;
    gapLevel: 'Low' | 'Medium' | 'High';
    recommendation: string;
  }[];
  confidence: number;
}

export interface InterviewQuestion {
  id: string;
  question: string;
  type: 'Behavioral' | 'Technical' | 'Probing';
  hint: string;
}

export interface TransitionStatus {
  savingsMonths: number;
  resumeComplete: boolean;
  networkingCount: number;
  applicationsSubmitted: number;
  certsAchieved: number;
}

export interface ReadinessScore {
  total: number;
  breakdown: {
    financial: number;
    professional: number;
    networking: number;
    skills: number;
  };
  recommendations: string[];
}
