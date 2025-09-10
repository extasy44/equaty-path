# AI Integration Setup Guide

This guide will help you set up AI models for the Builder Visualizer feature.

## Supported AI Providers

### 1. OpenAI (Cloud-based)

- **Pros**: Advanced vision analysis, reliable, fast processing
- **Cons**: Requires API key, usage costs, internet connection required
- **Best for**: Production use, advanced features

### 2. Ollama (Local)

- **Pros**: Privacy-focused, no API costs, works offline
- **Cons**: Limited vision capabilities, requires local setup
- **Best for**: Development, privacy-conscious users

## Setup Instructions

### OpenAI Setup

1. **Get an API Key**:
   - Visit [OpenAI Platform](https://platform.openai.com/)
   - Sign up or log in to your account
   - Navigate to API Keys section
   - Create a new API key

2. **Configure Environment Variables**:

   ```bash
   # Create a .env.local file in your project root
   OPENAI_API_KEY=your_openai_api_key_here
   NEXT_PUBLIC_OPENAI_MODEL=gpt-4o
   NEXT_PUBLIC_AI_PROVIDER=openai
   ```

3. **Supported Models**:
   - `gpt-4o` - Latest GPT-4 with vision capabilities (recommended)
   - `gpt-4-turbo` - Fast and cost-effective
   - `gpt-3.5-turbo` - Budget option

### Ollama Setup

1. **Install Ollama**:

   ```bash
   # On macOS
   brew install ollama

   # On Linux
   curl -fsSL https://ollama.ai/install.sh | sh

   # On Windows
   # Download from https://ollama.ai/download
   ```

2. **Start Ollama Service**:

   ```bash
   ollama serve
   ```

3. **Pull Required Models**:

   ```bash
   # For text generation and basic analysis
   ollama pull llama2
   ollama pull codellama

   # For better performance
   ollama pull llama2:13b
   ollama pull mistral
   ```

4. **Configure Environment Variables**:
   ```bash
   # Create a .env.local file in your project root
   NEXT_PUBLIC_OLLAMA_BASE_URL=http://localhost:11434
   NEXT_PUBLIC_OLLAMA_MODEL=llama2
   NEXT_PUBLIC_AI_PROVIDER=ollama
   ```

## Testing AI Integration

1. **Start the development server**:

   ```bash
   npm run dev
   ```

2. **Navigate to Builder Visualizer**:
   - Go to `/builder-visualizer`
   - Check the AI Model Selection section
   - Test connection to your configured provider
   - Try uploading a floor plan image

3. **Verify AI Processing**:
   - Upload a floor plan image
   - Check browser console for AI processing logs
   - Verify that 3D model generation works

## Troubleshooting

### OpenAI Issues

**"API key missing" error**:

- Ensure `OPENAI_API_KEY` is set in your environment variables
- Check that the key is valid and has sufficient credits

**"Rate limit exceeded" error**:

- You've hit OpenAI's rate limits
- Wait a few minutes and try again
- Consider upgrading your OpenAI plan

### Ollama Issues

**"Connection refused" error**:

- Ensure Ollama is running: `ollama serve`
- Check that the base URL is correct (default: http://localhost:11434)
- Verify no firewall is blocking the connection

**"Model not found" error**:

- Pull the required model: `ollama pull llama2`
- Check available models: `ollama list`
- Update the model name in your configuration

**Slow processing**:

- Ollama models run locally and may be slower than cloud services
- Consider using smaller models for faster processing
- Ensure your system has sufficient RAM (8GB+ recommended)

### General Issues

**Fallback behavior**:

- The system will automatically fall back to mock data if AI services fail
- Check browser console for detailed error messages
- AI processing failures won't break the basic functionality

**Model switching**:

- You can switch between providers in the UI
- Changes take effect immediately for new requests
- Existing processed data remains unchanged

## Performance Optimization

### OpenAI Optimization

- Use `gpt-4o` for best results with vision tasks
- Implement caching to reduce API calls
- Monitor usage costs through OpenAI dashboard

### Ollama Optimization

- Use GPU acceleration if available: `ollama serve --gpu`
- Choose appropriate model sizes based on your hardware
- Consider using smaller models for development

## Security Considerations

### OpenAI

- Never commit API keys to version control
- Use environment variables for sensitive data
- Monitor API usage and costs
- Implement rate limiting in production

### Ollama

- Runs locally with no external data transmission
- Models are stored locally on your system
- No API keys required
- Ideal for sensitive architectural data

## Advanced Configuration

### Custom Prompts

You can customize AI prompts by modifying the configuration in:

- `src/app/builder-visualizer/config/ai.ts`

### Model Parameters

Adjust temperature, max tokens, and other parameters in:

- `src/app/builder-visualizer/config/ai.ts`

### Service Extensions

Add new AI providers by implementing the `AIServiceProvider` interface:

- Create new service class in `src/app/builder-visualizer/services/ai/`
- Register in `ai-service-manager.ts`

## Support

If you encounter issues:

1. Check the browser console for error messages
2. Verify your environment variables are set correctly
3. Test the AI service connection in the UI
4. Refer to the specific provider's documentation

For additional help, check the project's GitHub issues or documentation.
