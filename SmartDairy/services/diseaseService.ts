import { api, mlApi } from "../hooks/api";

// Database record interface matching the actual response
interface DatabasePredictionRecord {
  _id: { $oid: string };
  userId: { $oid: string };
  cowId: string | null;
  prediction: string;
  severity: string | null;
  confidence: number;
  inputData: {
    symptoms?: string;
    hasImage: boolean;
    hasReport: boolean;
    imageFileName?: string | null;
    reportFileName?: string | null;
  };
  aiResponse: {
    symptoms_analysis?: Record<string, number>;
    symptom_confidence?: number;
    final_decision: string;
    overall_confidence: number;
    severity_assessment?: string;
  };
  careInstructionsProvided: boolean;
  status: string;
  createdAt: { $date: string };
  updatedAt: { $date: string };
  __v: number;
}

export interface PredictionRecord {
  id: string;
  cowId?: string;
  cowName?: string;
  date: string;
  diagnosis: string;
  confidence: number;
  predictionType: 'image' | 'report' | 'symptoms';
  status: 'healthy' | 'sick' | 'recovering' | 'critical';
  symptoms?: string[];
  careInstructions?: string;
  severity?: 'low' | 'medium' | 'high';
  veterinarianConsulted?: boolean;
}

export interface PredictionStatistics {
  totalPredictions: number;
  healthyCount: number;
  sickCount: number;
  accuracyRate: number;
  diseaseBreakdown: {
    [key: string]: number;
  };
}

export interface CareInstructions {
  diseaseType: string;
  prevention: string[];
  treatment: string[];
  monitoring: string[];
}

// Helper function to map database response to UI format
const mapDatabaseRecordToUI = (dbRecord: DatabasePredictionRecord): PredictionRecord => {
  // Parse symptoms string to array - handle both comma-separated and single symptoms
  const symptoms = dbRecord.inputData.symptoms 
    ? (dbRecord.inputData.symptoms.includes(',') 
        ? dbRecord.inputData.symptoms.split(',').map(s => s.trim()).filter(Boolean)
        : [dbRecord.inputData.symptoms.trim()].filter(Boolean))
    : [];

  // Determine prediction type based on input data
  let predictionType: 'image' | 'report' | 'symptoms' = 'symptoms';
  if (dbRecord.inputData.hasImage) predictionType = 'image';
  else if (dbRecord.inputData.hasReport) predictionType = 'report';

  // Map status to expected UI format - use actual database values when possible
  const mapStatus = (dbStatus: string, prediction: string): 'healthy' | 'sick' | 'recovering' | 'critical' => {
    const predictionLower = prediction.toLowerCase();
    
    // Direct mapping for common prediction values
    if (predictionLower === 'healthy') return 'healthy';
    if (predictionLower === 'fmd' || predictionLower === 'foot and mouth disease') return 'sick';
    if (predictionLower === 'lsd' || predictionLower === 'lumpy skin disease') return 'sick';
    if (predictionLower === 'recovering') return 'recovering';
    if (predictionLower === 'critical') return 'critical';
    
    // For uncertain predictions, use confidence to decide
    if (predictionLower === 'uncertain') {
      const confidence = dbRecord.confidence || dbRecord.aiResponse?.overall_confidence || 0;
      return confidence > 0.5 ? 'sick' : 'healthy';
    }
    
    // Use severity assessment if available - handle both string and object formats
    const severityAssessment = dbRecord.aiResponse?.severity_assessment;
    let severity: string | undefined;
    
    if (typeof severityAssessment === 'string') {
      severity = severityAssessment.toLowerCase();
    } else if (severityAssessment && typeof severityAssessment === 'object' && severityAssessment !== null) {
      const obj = severityAssessment as Record<string, any>;
      if ('level' in obj) {
        severity = obj.level?.toString()?.toLowerCase();
      }
    }
    
    if (severity === 'high' || severity === 'critical' || severity === 'severe') return 'critical';
    if (severity === 'medium' || severity === 'moderate') return 'sick';
    if (severity === 'low' || severity === 'mild') return 'recovering';
    if (severity === 'none' || severity === 'minimal') return 'healthy';
    
    // Default based on database status or prediction content
    if (dbStatus.toLowerCase() === 'active' && predictionLower.includes('disease')) return 'sick';
    return 'healthy'; // Conservative default
  };

  // Parse MongoDB date format
  const parseMongoDate = (mongoDate: { $date: string }): string => {
    try {
      return new Date(mongoDate.$date).toISOString().split('T')[0];
    } catch {
      return new Date().toISOString().split('T')[0];
    }
  };

  // Handle severity mapping - filter out 'none' values and handle object format
  const getSeverity = (): 'low' | 'medium' | 'high' | undefined => {
    const severityAssessment = dbRecord.aiResponse?.severity_assessment;
    let severity: string | undefined;
    
    if (typeof severityAssessment === 'string') {
      severity = severityAssessment.toLowerCase();
    } else if (severityAssessment && typeof severityAssessment === 'object' && severityAssessment !== null) {
      const obj = severityAssessment as Record<string, any>;
      if ('level' in obj) {
        severity = obj.level?.toString()?.toLowerCase();
      }
    }
    
    // Map severity values to expected format
    if (severity === 'severe' || severity === 'critical' || severity === 'high') return 'high';
    if (severity === 'moderate' || severity === 'medium') return 'medium';
    if (severity === 'mild' || severity === 'low') return 'low';
    
    return undefined; // For 'none', 'minimal' or unrecognized values
  };

  // Generate cow name from ID if available
  const getCowName = (): string => {
    if (dbRecord.cowId && dbRecord.cowId !== 'null') {
      return `Cow ${dbRecord.cowId}`;
    }
    return 'Unknown Cow';
  };

  return {
    id: dbRecord._id.$oid,
    cowId: dbRecord.cowId || undefined,
    cowName: getCowName(),
    date: parseMongoDate(dbRecord.createdAt),
    diagnosis: dbRecord.aiResponse?.final_decision || dbRecord.prediction || 'Unknown',
    confidence: Math.round((dbRecord.aiResponse?.overall_confidence || dbRecord.confidence || 0) * 100),
    predictionType,
    status: mapStatus(dbRecord.status, dbRecord.aiResponse?.final_decision || dbRecord.prediction),
    symptoms,
    careInstructions: dbRecord.careInstructionsProvided ? 'Care instructions available' : undefined,
    severity: getSeverity(),
    veterinarianConsulted: undefined // Not provided in database
  };
};

// Get user's prediction history
export const getPredictionHistory = async (): Promise<PredictionRecord[]> => {
  try {
    console.log("Attempting to fetch prediction history from:", "/cattle/disease/history");
    const response = await api.get("/cattle/disease/history");
    console.log("Raw prediction history response:", response.data);
    
    // Handle the response data - could be array directly or nested in data property
    const rawRecords = response.data.data || response.data;
    
    if (!Array.isArray(rawRecords)) {
      console.error("Expected array but got:", typeof rawRecords, rawRecords);
      return getMockPredictionHistory();
    }
    
    // Map database records to UI format
    const mappedRecords = rawRecords.map((record: DatabasePredictionRecord) => {
      try {
        return mapDatabaseRecordToUI(record);
      } catch (error) {
        console.error("Error mapping record:", error, record);
        return null;
      }
    }).filter(Boolean) as PredictionRecord[];
    
    console.log("Mapped prediction records:", mappedRecords);
    return mappedRecords;
    
  } catch (error: any) {
    console.error("Error fetching prediction history:");
    console.error("- Status:", error.response?.status);
    console.error("- Message:", error.message);
    console.error("- URL:", error.config?.url);
    console.error("- Base URL:", error.config?.baseURL);
    console.error("Full error:", error);
    
    // Provide mock data as fallback during development
    if (error.response?.status === 404 || error.code === 'NETWORK_ERROR' || !error.response) {
      console.warn("API not available, returning mock data");
      return getMockPredictionHistory();
    }
    
    throw error;
  }
};

// Mock data fallback function
const getMockPredictionHistory = (): PredictionRecord[] => {
  return [
    {
      id: "1",
      cowId: "12",
      cowName: "Bella",
      date: new Date().toISOString().split('T')[0],
      diagnosis: "Foot and Mouth Disease",
      confidence: 85,
      predictionType: "image",
      status: "sick",
      symptoms: ["Blisters", "Salivation", "Fever"],
      careInstructions: "Isolate animal, provide supportive care, contact veterinarian",
      severity: "high",
      veterinarianConsulted: false
    },
    {
      id: "2", 
      cowId: "18",
      cowName: "Daisy",
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      diagnosis: "Lumpy Skin Disease",
      confidence: 92,
      predictionType: "symptoms",
      status: "sick",
      symptoms: ["Nodules", "Skin lesions", "Reduced appetite"],
      careInstructions: "Monitor closely, provide nutritional support",
      severity: "medium",
      veterinarianConsulted: true
    },
    {
      id: "3",
      cowId: "7", 
      cowName: "Luna",
      date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      diagnosis: "Healthy",
      confidence: 96,
      predictionType: "report",
      status: "healthy",
      symptoms: [],
      careInstructions: "Continue regular care routine",
      severity: "low",
      veterinarianConsulted: false
    },
    {
      id: "4",
      cowId: "15",
      cowName: "Rose", 
      date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      diagnosis: "Respiratory infection", 
      confidence: 78,
      predictionType: "image",
      status: "recovering",
      symptoms: ["Nasal discharge", "Cough"],
      careInstructions: "Complete antibiotic course, monitor breathing",
      severity: "medium",
      veterinarianConsulted: true
    }
  ];
};

// Get prediction history for a specific cow
export const getCowPredictionHistory = async (cowId: string): Promise<PredictionRecord[]> => {
  try {
    const response = await api.get(`/cattle/disease/history/cow/${cowId}`);
    return response.data.data || response.data;
  } catch (error) {
    console.error("Error fetching cow prediction history:", error);
    throw error;
  }
};

// Get prediction statistics
export const getPredictionStatistics = async (): Promise<PredictionStatistics> => {
  try {
    const response = await api.get("/cattle/disease/statistics");
    return response.data.data || response.data;
  } catch (error) {
    console.error("Error fetching prediction statistics:", error);
    throw error;
  }
};

// Get recent predictions (admin functionality)  
export const getRecentPredictions = async (): Promise<PredictionRecord[]> => {
  try {
    const response = await api.get("/cattle/disease/recent");
    return response.data.data || response.data;
  } catch (error) {
    console.error("Error fetching recent predictions:", error);
    throw error;
  }
};

// Get predictions by severity
export const getPredictionsBySeverity = async (severity: string): Promise<PredictionRecord[]> => {
  try {
    const response = await api.get(`/cattle/disease/severity/${severity}`);
    return response.data.data || response.data;
  } catch (error) {
    console.error("Error fetching predictions by severity:", error);
    throw error;
  }
};

// Get severity statistics
export const getSeverityStatistics = async () => {
  try {
    const response = await api.get("/cattle/disease/severity-stats");
    return response.data.data || response.data;
  } catch (error) {
    console.error("Error fetching severity statistics:", error);
    throw error;
  }
};

// Get care instructions for a disease type
export const getCareInstructions = async (diseaseType: string): Promise<CareInstructions> => {
  try {
    const response = await api.get(`/cattle/disease/care/${diseaseType}`);
    return response.data.data || response.data;
  } catch (error) {
    console.error("Error fetching care instructions:", error);
    throw error;
  }
};

// Disease prediction endpoint
export const predictDisease = async (formData: FormData) => {
  try {
    const response = await mlApi.post("/cattle/disease/predict", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error predicting disease:", error);
    throw error;
  }
};