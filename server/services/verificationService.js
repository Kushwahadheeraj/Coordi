const { GoogleGenerativeAI } = require("@google/generative-ai");
const cache = require('./cacheService');
const logger = require('../utils/logger');
const { supabase } = require('../config/supabaseClient');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const verifyImage = async (imageUrl, reportId) => {
    const cacheKey = `verify_${reportId}`;
    const cachedData = await cache.get(cacheKey);
    if (cachedData) return cachedData;

    try {
        // This is a placeholder for the actual image verification logic with Gemini Pro Vision.
        // The actual implementation would involve passing the image data to the model.
        // For now, we simulate the analysis based on the URL.
        const model = genAI.getGenerativeModel({ model: "gemini-pro" }); // In a real case, use a Vision model
        const prompt = `Analyze the image at this URL: ${imageUrl}. Is it related to a real disaster? Does it look manipulated? Respond with a JSON object: {"is_authentic": boolean, "disaster_context": "description", "confidence_score": float}`;

        // const result = await model.generateContent(prompt); // This would be the actual call
        // const response = await result.response;
        // const analysis = JSON.parse(await response.text());
        
        // Mocking the response for now.
        const mockAnalysis = {
            is_authentic: !imageUrl.includes("fake"), // Simple mock logic
            disaster_context: "This image appears to show flooding in an urban area.",
            confidence_score: Math.random() * 0.3 + 0.65, // Random score between 0.65 and 0.95
            verification_provider: "Gemini-Mock"
        };
        
        // Update the report's verification status
        const { error } = await supabase
            .from('reports')
            .update({ verification_status: mockAnalysis.is_authentic ? 'verified' : 'fake' })
            .eq('id', reportId);

        if (error) {
            logger.error('Failed to update report verification status', { reportId, error });
        }

        await cache.set(cacheKey, mockAnalysis);
        logger.info('Image verification complete', { reportId, result: mockAnalysis.is_authentic });

        return mockAnalysis;

    } catch (error) {
        logger.error('Error with Gemini API for image verification', { error: error.message, imageUrl });
        throw new Error('Failed to verify image using Gemini API.');
    }
};

module.exports = { verifyImage }; 