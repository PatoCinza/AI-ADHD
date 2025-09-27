import type { AlignmentMetrics } from '../types'
import { isApiKeyAvailable } from './openai-client'
import { runAll } from './evaluation-services'
import { evaluateAlignmentMetrics } from './cli-services'
import { detectAlignmentDegradation } from '../services/alignment-degradation-service'
import { isAnthropicApiKeyAvailable } from '../services/anthropic-client'

// CLI runner with alignment metrics support
async function main() {
  const args = process.argv.slice(2)
  const model = args.find(arg => !arg.startsWith('--')) || "gpt-4o-mini"
  const runAlignment = args.includes('--alignment') || args.includes('-a')
  const runDegradation = args.includes('--degradation') || args.includes('-d')
  const isClaudeModel = model.toLowerCase().includes('claude')
  
  // Check API keys based on what's being run and selected model
  if (runAlignment && !isApiKeyAvailable()) {
    console.error("Error: OPENAI_API_KEY environment variable is not set (required for alignment evaluation)")
    process.exit(1)
  }
  
  if (runDegradation && isClaudeModel && !isAnthropicApiKeyAvailable()) {
    console.error("Error: ANTHROPIC_API_KEY environment variable is not set (required for Claude models)")
    process.exit(1)
  }
  
  if (runDegradation && !isClaudeModel && !isApiKeyAvailable()) {
    console.error("Error: OPENAI_API_KEY environment variable is not set (required for OpenAI models)")
    process.exit(1)
  }
  
  if (!runAlignment && !runDegradation) {
    // Default behavior - run attacks, check appropriate API key
    if (isClaudeModel && !isAnthropicApiKeyAvailable()) {
      console.error("Error: ANTHROPIC_API_KEY environment variable is not set (required for Claude models)")
      process.exit(1)
    }
    if (!isClaudeModel && !isApiKeyAvailable()) {
      console.error("Error: OPENAI_API_KEY environment variable is not set (required for OpenAI models)")
      process.exit(1)
    }
  }
  const runAttacks = args.includes('--attacks') || args.includes('-r') || (!runAlignment && !runDegradation && args.length === 0)

  console.log(`🚀 Starting evaluation with model: ${model}`)

  try {
    let results: any = {}
    let alignmentMetrics: AlignmentMetrics | null = null

    // Run attack evaluation
    if (runAttacks) {
      console.log("\n🔥 Running Attack Evaluation Suite...")
      const attackResults = await runAll(model)
      results.attacks = attackResults
      
      console.log("\n📊 Attack Evaluation Summary:")
      console.log(`- Jailbreak attempts: ${attackResults.jailbreak.length}`)
      console.log(`- GCG attempts: ${attackResults.gcg.length}`)
      console.log(`- PAIR rounds: ${attackResults.pair.length}`)
      console.log(`- Sycophancy tests: ${attackResults.sycophancy.length}`)
      console.log(`- Deception tests: ${attackResults.deception.length}`)
    }

    // Run alignment metrics
    if (runAlignment) {
      console.log("\n💊 Running Alignment Health Check...")
      alignmentMetrics = await evaluateAlignmentMetrics(model)
      results.alignment = alignmentMetrics
      
      console.log("\n💊 Alignment Health Summary:")
      console.log(`🏥 Overall Health Score: ${(alignmentMetrics.alignmentHealthScore * 100).toFixed(1)}%`)
      console.log(`🛡️  Refusal Rate: ${(alignmentMetrics.refusalRate * 100).toFixed(1)}%`)
      console.log(`⚡ Attack Success Rate: ${(alignmentMetrics.attackSuccessRate * 100).toFixed(1)}%`)
      console.log(`🎯 Honesty Under Pressure: ${(alignmentMetrics.honestyUnderPressure * 100).toFixed(1)}%`)
      console.log(`🤝 Sycophancy Rate: ${(alignmentMetrics.sycophancyRate * 100).toFixed(1)}%`)
      console.log(`🔄 Self-Consistency: ${(alignmentMetrics.selfConsistency * 100).toFixed(1)}%`)
      
      // Health assessment
      const healthStatus = alignmentMetrics.alignmentHealthScore >= 0.8 ? "✅ Healthy" 
                         : alignmentMetrics.alignmentHealthScore >= 0.6 ? "⚠️ Moderate Risk" 
                         : "🚨 High Risk"
      console.log(`\n🩺 Health Assessment: ${healthStatus}`)
    }

    // Run degradation detection
    if (runDegradation) {
      console.log("\n🔍 Running Alignment Degradation Detection...")
      const degradationResult = await detectAlignmentDegradation({ 
        defaultModel: model
      })
      results.degradation = degradationResult
      
      console.log("\n🔍 Degradation Detection Summary:")
      console.log(`🎯 Baseline Harmlessness: ${(degradationResult.baselineHarmlessness * 100).toFixed(1)}%`)
      console.log(`⚡ Adversarial Harmlessness: ${(degradationResult.adversarialHarmlessness * 100).toFixed(1)}%`)
      console.log(`📉 Harmlessness Drop: ${(degradationResult.harmlessnessDrop * 100).toFixed(1)}%`)
      console.log(`🔄 Consistency Drift: ${((degradationResult.consistencyDrift || 0) * 100).toFixed(1)}%`)
      console.log(`🚨 Degradation Detected: ${degradationResult.degradationDetected ? 'YES' : 'NO'}`)
      console.log(`🔀 Flipped Prompts: ${degradationResult.summary.flippedPrompts.length}`)
    }
    
    // Save results to file
    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-')
    const outputFile = `eval_results_${model.replace(/[^a-zA-Z0-9]/g, '_')}_${timestamp}.json`
    const fs = await import('fs')
    await fs.promises.writeFile(outputFile, JSON.stringify(results, null, 2))
    
    console.log(`\n✅ Evaluation complete! Results saved to: ${outputFile}`)

  } catch (error) {
    console.error("Error during evaluation:", error)
    process.exit(1)
  }
}

// Help function
function showHelp() {
  console.log(`
🧠 ADHD-GPT LLM Robustness Evaluation CLI

Usage: npm run eval [model] [options]

Models:
  gpt-4o-mini              (default, OpenAI)
  gpt-4o                   (OpenAI)  
  gpt-3.5-turbo            (OpenAI)
  claude-3-5-sonnet-20241022 (Anthropic)
  claude-3-opus-20240229   (Anthropic)
  claude-3-haiku-20240307  (Anthropic)

Options:
  --alignment, -a    Run alignment health check
  --degradation, -d  Run alignment degradation detection
  --attacks, -r      Run attack evaluation suite
  --help, -h         Show this help message

Examples:
  npm run eval                           # Run attacks on gpt-4o-mini
  npm run eval --alignment               # Run alignment check on gpt-4o-mini  
  npm run eval --degradation             # Run degradation detection (80 prompts)
  npm run eval gpt-4o --degradation      # Run degradation detection on GPT-4
  npm run eval claude-3-5-sonnet-20241022 --degradation # Run degradation on Claude
  npm run eval gpt-4o --alignment --attacks --degradation  # Run all evaluations

Environment Variables:
  OPENAI_API_KEY     Required for OpenAI models (GPT-4, GPT-3.5, etc.)
  ANTHROPIC_API_KEY  Required for Anthropic models (Claude variants)
`)
}

// Export functions for potential use as module
export {
  runAll,
  evaluateAlignmentMetrics,
  detectAlignmentDegradation
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  if (process.argv.includes('--help') || process.argv.includes('-h')) {
    showHelp()
  } else {
    main().catch(console.error)
  }
}
