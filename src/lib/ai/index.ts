/**
 * AI Service Factory
 * 
 * Central module for AI capabilities. Automatically selects
 * the best available provider based on configuration.
 * 
 * Priority:
 * 1. Configured cloud provider (if API key present)
 * 2. Local fallback (always available, zero cost)
 */

import type { AIProvider, AIConfig, ImageAnalysisResult } from "./types";
import { localProvider } from "./local-provider";

export * from "./types";

let activeProvider: AIProvider = localProvider;

/**
 * Configure the AI provider
 */
export function configureAI(config: AIConfig): void {
  switch (config.provider) {
    case "local":
      activeProvider = localProvider;
      break;
    
    // Future providers can be added here:
    // case "openai":
    //   activeProvider = new OpenAIProvider(config);
    //   break;
    // case "replicate":
    //   activeProvider = new ReplicateProvider(config);
    //   break;
    // case "huggingface":
    //   activeProvider = new HuggingFaceProvider(config);
    //   break;
    
    default:
      activeProvider = localProvider;
  }
}

/**
 * Get the current AI provider
 */
export function getAIProvider(): AIProvider {
  return activeProvider;
}

/**
 * Analyze an image using the configured provider
 */
export async function analyzeImage(
  imageBuffer: Buffer,
  mimeType: string
): Promise<ImageAnalysisResult> {
  return activeProvider.analyzeImage(imageBuffer, mimeType);
}

/**
 * Check if AI features are available
 */
export async function isAIAvailable(): Promise<boolean> {
  return activeProvider.isAvailable();
}

/**
 * Get provider info
 */
export function getProviderInfo(): { name: string; version: string } {
  return {
    name: activeProvider.name,
    version: activeProvider.version,
  };
}
