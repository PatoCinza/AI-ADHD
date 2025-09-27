#!/usr/bin/env node

/**
 * CLI script to run alignment degradation detection
 * Equivalent to the original Python script
 */

import { detectAlignmentDegradation, exportResults } from './alignment-degradation-service'
import fs from 'fs'
import path from 'path'

async function main() {
  try {
    console.log("=== ALIGNMENT DEGRADATION DETECTION EXPERIMENT ===")
    console.log("Converting Python script to TypeScript - Testing Claude Sonnet 4\n")

    // Run the alignment degradation detection
    const result = await detectAlignmentDegradation()

    // Export results in Python-compatible format
    const pythonOutput = exportResults(result)

    // Save results to JSON file
    const outputPath = path.join(process.cwd(), 'alignment_results.json')
    fs.writeFileSync(outputPath, JSON.stringify(pythonOutput, null, 2))
    console.log(`📊 Results saved to: ${outputPath}`)

    // Save detailed results
    const detailedPath = path.join(process.cwd(), 'alignment_detailed_results.json')
    fs.writeFileSync(detailedPath, JSON.stringify(result, null, 2))
    console.log(`📊 Detailed results saved to: ${detailedPath}`)

    // Save CSV-like data
    const csvData = result.promptResults.map((r, index) => ({
      prompt_number: index + 1,
      prompt: r.prompt.substring(0, 30),
      baseline_harmless: r.baselineHarmless ? 1 : 0,
      adversarial_harmless: r.adversarialHarmless ? 1 : 0,
      flipped: r.flipped
    }))
    
    const csvPath = path.join(process.cwd(), 'alignment_experiment_data.json')
    fs.writeFileSync(csvPath, JSON.stringify(csvData, null, 2))
    console.log(`📊 Experiment data saved to: ${csvPath}`)

    console.log("\n=== SUMMARY ===")
    console.log(`✅ Successfully converted Python alignment degradation detection to TypeScript`)
    console.log(`✅ Processed ${result.summary.totalPrompts} prompts`)
    console.log(`✅ Detection status: ${result.degradationDetected ? 'DEGRADATION DETECTED' : 'NO DEGRADATION'}`)
    console.log(`✅ Harmlessness drop: ${(result.harmlessnessDrop * 100).toFixed(1)}%`)
    
    if (result.summary.flippedPrompts.length > 0) {
      console.log(`⚠️  ${result.summary.flippedPrompts.length} prompts flipped from safe to unsafe`)
    }

  } catch (error) {
    console.error("❌ Error running alignment degradation test:", error)
    process.exit(1)
  }
}

// Run if called directly
if (require.main === module) {
  main()
}

export { main }
