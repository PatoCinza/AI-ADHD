# 🚀 Multi-Provider Setup Guide

ADHD-GPT now supports **both OpenAI and Anthropic** models with automatic routing based on your selection!

## ✨ What's New

### 🔄 **Universal Model Selection**
- **OpenAI Models**: GPT-4o, GPT-4o Mini, GPT-3.5 Turbo
- **Anthropic Models**: Claude 3.5 Sonnet
- **Smart Routing**: Automatically uses the correct API based on selected model

### 🎯 **API Key Management**
- **Dual Support**: Both `VITE_OPENAI_API_KEY` and `VITE_ANTHROPIC_API_KEY`
- **Visual Indicators**: Green/red dots show which APIs are available
- **Smart Disabling**: Models are disabled if their API key is missing

### 🔍 **Feature Matrix**

| Feature | OpenAI Models | Claude Models |
|---------|---------------|---------------|
| 🚀 Attack Evaluation | ✅ Full Support | ✅ Full Support |
| 💊 Alignment Health | ✅ Available | ⚠️ Coming Soon |
| 🔍 Degradation Detection | ⚠️ Basic Support | ✅ **Optimal** |
| ⚡ Full Evaluation | ✅ Traditional Suite | ✅ **Enhanced with Degradation** |

## 🛠️ Setup Instructions

### 1. **Environment Variables**
Create or update your `.env` file:

```bash
# OpenAI (for GPT models)
VITE_OPENAI_API_KEY=sk-proj-your-openai-key-here

# Anthropic (for Claude models) 
VITE_ANTHROPIC_API_KEY=sk-ant-your-anthropic-key-here
```

### 2. **Get Your API Keys**

**OpenAI**: https://platform.openai.com/api-keys  
**Anthropic**: https://console.anthropic.com/

### 3. **Install Dependencies**
```bash
npm install
```

The `@anthropic-ai/sdk` is already included in the updated package.json.

## 🎨 How It Works

### **Smart Model Detection**
The system automatically detects the model type:
```typescript
// Claude models automatically route to Anthropic
const isClaudeModel = model.includes('claude')
const apiCall = isClaudeModel ? callClaude : callOpenAI
```

### **API Key Status Indicators**
Real-time status showing which providers are available:
- 🟢 **Ready** - API key configured and working
- 🔴 **Missing** - API key not found

### **Intelligent Button States**
Evaluation buttons automatically disable based on:
- Selected model requirements
- Available API keys  
- Current running state

## 🚀 Usage Examples

### **OpenAI Models (Traditional)**
1. Select "GPT-4o Mini" 
2. Requires: `VITE_OPENAI_API_KEY`
3. Best for: Traditional robustness testing

### **Claude Models (Enhanced)**
1. Select "Claude 3.5 Sonnet"
2. Requires: `VITE_ANTHROPIC_API_KEY` 
3. Best for: Alignment degradation detection

### **Full Evaluation Comparison**
- **OpenAI**: Runs traditional attack suite
- **Claude**: Runs enhanced suite with alignment degradation detection

## 🔬 Alignment Degradation Detection

### **Why Claude is Optimal**
- Research paper specifically tested Claude Sonnet 4
- Anthropic's models designed for safety research
- Enhanced constitutional AI for better baseline/adversarial contrast

### **Cross-Provider Support**
While optimized for Claude, degradation detection now works with:
- ✅ **Claude 3.5 Sonnet** (Recommended)
- ⚠️ **GPT Models** (Basic support, may need threshold adjustment)

## 🎯 Best Practices

### **For Research**
- **Use Claude** for alignment degradation studies
- **Use GPT** for traditional robustness benchmarking
- **Compare results** across both providers

### **For Development**  
- **Start with GPT-4o Mini** (cost-effective testing)
- **Validate with Claude** (safety-focused evaluation)
- **Use Full Evaluation** for comprehensive assessment

### **For Production**
- **Monitor both providers** for comprehensive coverage
- **Set up both API keys** for redundancy
- **Use alignment degradation** as early warning system

## 🛡️ Security Notes

- **Never commit API keys** to git
- **Use environment variables** only
- **Monitor API usage** on both platforms
- **Rotate keys regularly** for security

## 🎪 UI Enhancements

### **Model Selector**
- Shows "(API key required)" for unavailable models
- Visual status indicators for each provider
- Smart option disabling

### **Evaluation Controls**  
- Context-aware button states
- Provider-specific error messages
- Real-time availability checking

---

**🎯 Result: Seamless dual-provider experience with intelligent routing! 🎯**

*Now supports the full spectrum from traditional robustness testing to cutting-edge alignment degradation detection* ⚡
