/**
 * AI Provider Abstraction Layer
 * 
 * This module defines interfaces for AI capabilities that can be
 * implemented by different providers (local models, cloud APIs, etc.)
 * 
 * Design principle: Provider-agnostic interfaces allow switching
 * between free/paid services without rewriting application code.
 */

export interface AITag {
  label: string;
  confidence: number;
  category: "scene" | "object" | "emotion" | "activity" | "color" | "other";
}

export interface FaceDetection {
  id: string;
  boundingBox: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  landmarks?: {
    leftEye: { x: number; y: number };
    rightEye: { x: number; y: number };
    nose: { x: number; y: number };
    leftMouth: { x: number; y: number };
    rightMouth: { x: number; y: number };
  };
  embedding?: number[];
}

export interface ImageAnalysisResult {
  tags: AITag[];
  faces: FaceDetection[];
  dominantColors: string[];
  quality: {
    blur: number;
    brightness: number;
    contrast: number;
  };
  suggestedCaption?: string;
}

export interface SimilarityResult {
  mediaId: string;
  score: number;
}

export interface AIProvider {
  name: string;
  version: string;
  
  /**
   * Analyze an image and extract tags, faces, colors, and quality metrics
   */
  analyzeImage(imageBuffer: Buffer, mimeType: string): Promise<ImageAnalysisResult>;
  
  /**
   * Generate an embedding vector for similarity search
   */
  generateEmbedding?(imageBuffer: Buffer): Promise<number[]>;
  
  /**
   * Find similar images based on embedding similarity
   */
  findSimilar?(embedding: number[], candidates: Array<{ id: string; embedding: number[] }>, limit?: number): Promise<SimilarityResult[]>;
  
  /**
   * Check if the provider is available and configured
   */
  isAvailable(): Promise<boolean>;
}

export interface AIConfig {
  provider: "local" | "openai" | "replicate" | "huggingface" | "custom";
  apiKey?: string;
  endpoint?: string;
  model?: string;
  options?: Record<string, unknown>;
}
