/**
 * Local AI Provider (Fallback / Free Tier)
 * 
 * This provider uses basic heuristics and color analysis
 * when no cloud AI service is configured. It provides
 * fundamental organization capabilities at zero cost.
 * 
 * In production, this can be replaced with:
 * - Self-hosted models (e.g., ONNX runtime)
 * - Edge AI (e.g., TensorFlow.js)
 * - Cloud APIs (e.g., OpenAI, Replicate)
 */

import type { AIProvider, ImageAnalysisResult, AITag } from "./types";

function extractDominantColors(buffer: Buffer): string[] {
  // Simplified color extraction based on buffer sampling
  // In production, use sharp or canvas for proper analysis
  const colors: string[] = [];
  const sampleSize = Math.min(buffer.length, 1000);
  const step = Math.floor(buffer.length / sampleSize);
  
  const colorCounts: Record<string, number> = {};
  
  for (let i = 0; i < buffer.length - 3; i += step * 3) {
    const r = Math.round(buffer[i] / 51) * 51;
    const g = Math.round(buffer[i + 1] / 51) * 51;
    const b = Math.round(buffer[i + 2] / 51) * 51;
    const hex = `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
    colorCounts[hex] = (colorCounts[hex] || 0) + 1;
  }
  
  const sorted = Object.entries(colorCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);
  
  for (const [color] of sorted) {
    colors.push(color);
  }
  
  return colors.length > 0 ? colors : ["#808080"];
}

function inferTagsFromFilename(filename?: string): AITag[] {
  if (!filename) return [];
  
  const tags: AITag[] = [];
  const lower = filename.toLowerCase();
  
  const patterns: Array<{ pattern: RegExp; label: string; category: AITag["category"] }> = [
    { pattern: /wedding/i, label: "wedding", category: "scene" },
    { pattern: /birthday/i, label: "birthday", category: "scene" },
    { pattern: /party/i, label: "party", category: "scene" },
    { pattern: /beach/i, label: "beach", category: "scene" },
    { pattern: /mountain/i, label: "mountain", category: "scene" },
    { pattern: /sunset/i, label: "sunset", category: "scene" },
    { pattern: /food|dinner|lunch/i, label: "food", category: "object" },
    { pattern: /selfie/i, label: "selfie", category: "activity" },
    { pattern: /group/i, label: "group photo", category: "activity" },
    { pattern: /dance/i, label: "dancing", category: "activity" },
  ];
  
  for (const { pattern, label, category } of patterns) {
    if (pattern.test(lower)) {
      tags.push({ label, confidence: 0.7, category });
    }
  }
  
  return tags;
}

function estimateImageQuality(buffer: Buffer): { blur: number; brightness: number; contrast: number } {
  // Simplified quality estimation
  // 0-1 scale where 1 is best quality
  
  let totalBrightness = 0;
  let minBrightness = 255;
  let maxBrightness = 0;
  
  const sampleSize = Math.min(buffer.length, 10000);
  const step = Math.floor(buffer.length / sampleSize);
  let samples = 0;
  
  for (let i = 0; i < buffer.length; i += step) {
    const val = buffer[i];
    totalBrightness += val;
    minBrightness = Math.min(minBrightness, val);
    maxBrightness = Math.max(maxBrightness, val);
    samples++;
  }
  
  const avgBrightness = totalBrightness / samples / 255;
  const contrast = (maxBrightness - minBrightness) / 255;
  
  // Blur estimation would require edge detection
  // For now, assume decent quality
  const blur = 0.8;
  
  return {
    blur,
    brightness: avgBrightness,
    contrast,
  };
}

export class LocalAIProvider implements AIProvider {
  name = "local";
  version = "1.0.0";
  
  async analyzeImage(imageBuffer: Buffer, _mimeType: string): Promise<ImageAnalysisResult> {
    const dominantColors = extractDominantColors(imageBuffer);
    const quality = estimateImageQuality(imageBuffer);
    
    // Basic tags based on file characteristics
    const tags: AITag[] = [];
    
    // Add color-based tags
    const colorNames: Record<string, string> = {
      "#000000": "dark",
      "#ffffff": "bright",
      "#ff0000": "red tones",
      "#00ff00": "green tones", 
      "#0000ff": "blue tones",
      "#ffff00": "warm tones",
    };
    
    for (const color of dominantColors.slice(0, 2)) {
      const nearest = Object.keys(colorNames).reduce((prev, curr) => {
        const prevDist = colorDistance(color, prev);
        const currDist = colorDistance(color, curr);
        return currDist < prevDist ? curr : prev;
      });
      
      if (colorNames[nearest]) {
        tags.push({
          label: colorNames[nearest],
          confidence: 0.6,
          category: "color",
        });
      }
    }
    
    return {
      tags,
      faces: [], // Face detection requires ML model
      dominantColors,
      quality,
      suggestedCaption: undefined,
    };
  }
  
  async isAvailable(): Promise<boolean> {
    return true; // Always available as fallback
  }
}

function colorDistance(hex1: string, hex2: string): number {
  const r1 = parseInt(hex1.slice(1, 3), 16);
  const g1 = parseInt(hex1.slice(3, 5), 16);
  const b1 = parseInt(hex1.slice(5, 7), 16);
  const r2 = parseInt(hex2.slice(1, 3), 16);
  const g2 = parseInt(hex2.slice(3, 5), 16);
  const b2 = parseInt(hex2.slice(5, 7), 16);
  
  return Math.sqrt((r1 - r2) ** 2 + (g1 - g2) ** 2 + (b1 - b2) ** 2);
}

export const localProvider = new LocalAIProvider();
