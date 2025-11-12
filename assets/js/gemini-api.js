// Gemini 1.5 Flash API Integration with Image Generation Support
class GeminiAPI {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.baseURL = "https://generativelanguage.googleapis.com/v1beta/models";
  }

  async generateResponse(prompt) {
    try {
      const response = await fetch(
        `${this.baseURL}/gemini-2.0-flash-001:generateContent?key=${this.apiKey}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: prompt,
                  },
                ],
              },
            ],
            generationConfig: {
              temperature: 0.7,
              topK: 40,
              topP: 0.95,
              maxOutputTokens: 2048,
            },
            safetySettings: [
              {
                category: "HARM_CATEGORY_HARASSMENT",
                threshold: "BLOCK_MEDIUM_AND_ABOVE",
              },
              {
                category: "HARM_CATEGORY_HATE_SPEECH",
                threshold: "BLOCK_MEDIUM_AND_ABOVE",
              },
              {
                category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                threshold: "BLOCK_MEDIUM_AND_ABOVE",
              },
              {
                category: "HARM_CATEGORY_DANGEROUS_CONTENT",
                threshold: "BLOCK_MEDIUM_AND_ABOVE",
              },
            ],
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.candidates && data.candidates[0] && data.candidates[0].content) {
        return {
          success: true,
          text: data.candidates[0].content.parts[0].text,
          usage: data.usageMetadata || null,
        };
      } else {
        throw new Error("Invalid response format from Gemini API");
      }
    } catch (error) {
      console.error("Gemini API Error:", error);
      return {
        success: false,
        error: error.message,
        text: "Sorry, I encountered an error while processing your request. Please try again.",
      };
    }
  }

  // New method for image generation
  async generateImage(prompt) {
    try {
      const response = await fetch(
        `${this.baseURL}/gemini-2.0-flash-001:generateContent?key=${this.apiKey}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: prompt,
                  },
                ],
              },
            ],
            generationConfig: {
              responseModalities: ["TEXT", "IMAGE"],
            },
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.candidates && data.candidates[0] && data.candidates[0].content) {
        const parts = data.candidates[0].content.parts;
        let textResponse = "";
        let imageData = null;

        for (const part of parts) {
          if (part.text) {
            textResponse = part.text;
          } else if (
            part.inlineData &&
            part.inlineData.mimeType.startsWith("image/")
          ) {
            imageData = part.inlineData.data;
          }
        }

        return {
          success: true,
          text: textResponse,
          imageData: imageData,
          usage: data.usageMetadata || null,
        };
      } else {
        throw new Error("Invalid response format from Gemini API");
      }
    } catch (error) {
      console.error("Gemini Image Generation Error:", error);
      return {
        success: false,
        error: error.message,
        text: "Sorry, I encountered an error while generating the image. Please try again.",
      };
    }
  }

  // Method for image editing (text-and-image-to-image)
  async editImage(imageFile, editPrompt) {
    try {
      // Convert image file to base64
      const base64Image = await this.fileToBase64(imageFile);

      const response = await fetch(
        `${this.baseURL}/gemini-2.0-flash-001:generateContent?key=${this.apiKey}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: editPrompt,
                  },
                  {
                    inlineData: {
                      mimeType: imageFile.type,
                      data: base64Image,
                    },
                  },
                ],
              },
            ],
            generationConfig: {
              responseModalities: ["TEXT", "IMAGE"],
            },
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.candidates && data.candidates[0] && data.candidates[0].content) {
        const parts = data.candidates[0].content.parts;
        let textResponse = "";
        let imageData = null;

        for (const part of parts) {
          if (part.text) {
            textResponse = part.text;
          } else if (
            part.inlineData &&
            part.inlineData.mimeType.startsWith("image/")
          ) {
            imageData = part.inlineData.data;
          }
        }

        return {
          success: true,
          text: textResponse,
          imageData: imageData,
          usage: data.usageMetadata || null,
        };
      } else {
        throw new Error("Invalid response format from Gemini API");
      }
    } catch (error) {
      console.error("Gemini Image Editing Error:", error);
      return {
        success: false,
        error: error.message,
        text: "Sorry, I encountered an error while editing the image. Please try again.",
      };
    }
  }

  // Helper method to convert file to base64
  fileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64 = reader.result.split(",")[1]; // Remove data URL prefix
        resolve(base64);
      };
      reader.onerror = (error) => reject(error);
    });
  }

  // Streaming response method
  async generateStreamingResponse(prompt, onChunk) {
    try {
      const response = await fetch(
        `${this.baseURL}/gemini-2.0-flash-001:generateContent?key=${this.apiKey}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: prompt,
                  },
                ],
              },
            ],
            generationConfig: {
              temperature: 0.7,
              topK: 40,
              topP: 0.95,
              maxOutputTokens: 2048,
            },
            safetySettings: [
              {
                category: "HARM_CATEGORY_HARASSMENT",
                threshold: "BLOCK_MEDIUM_AND_ABOVE",
              },
              {
                category: "HARM_CATEGORY_HATE_SPEECH",
                threshold: "BLOCK_MEDIUM_AND_ABOVE",
              },
              {
                category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                threshold: "BLOCK_MEDIUM_AND_ABOVE",
              },
              {
                category: "HARM_CATEGORY_DANGEROUS_CONTENT",
                threshold: "BLOCK_MEDIUM_AND_ABOVE",
              },
            ],
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      let fullText = "";

      if (data.candidates && data.candidates[0] && data.candidates[0].content) {
        fullText = data.candidates[0].content.parts[0].text;

        // Simulate streaming by sending chunks
        const words = fullText.split(" ");
        let currentText = "";

        for (let i = 0; i < words.length; i++) {
          currentText += (i > 0 ? " " : "") + words[i];
          onChunk(currentText);

          // Small delay to simulate streaming
          await new Promise((resolve) => setTimeout(resolve, 50));
        }

        return {
          success: true,
          text: fullText,
          usage: data.usageMetadata || null,
        };
      } else {
        throw new Error("Invalid response format from Gemini API");
      }
    } catch (error) {
      console.error("Gemini API Error:", error);
      return {
        success: false,
        error: error.message,
        text: "Sorry, I encountered an error while processing your request. Please try again.",
      };
    }
  }

  // Method to format the response for better display
  formatResponse(response) {
    if (!response.success) {
      return response.text;
    }

    // Basic formatting for common response types
    let formattedText = response.text;

    // Format headers (h1-h6)
    formattedText = formattedText.replace(
      /^### (.*$)/gim,
      '<h3 class="text-lg font-bold text-gray-900 mt-4 mb-2">$1</h3>'
    );
    formattedText = formattedText.replace(
      /^## (.*$)/gim,
      '<h2 class="text-xl font-bold text-gray-900 mt-6 mb-3">$1</h2>'
    );
    formattedText = formattedText.replace(
      /^# (.*$)/gim,
      '<h1 class="text-2xl font-bold text-gray-900 mt-8 mb-4">$1</h1>'
    );

    // Format bold text
    formattedText = formattedText.replace(
      /\*\*(.*?)\*\*/g,
      '<strong class="font-bold">$1</strong>'
    );
    formattedText = formattedText.replace(
      /__(.*?)__/g,
      '<strong class="font-bold">$1</strong>'
    );

    // Format italic text
    formattedText = formattedText.replace(
      /\*(.*?)\*/g,
      '<em class="italic">$1</em>'
    );
    formattedText = formattedText.replace(
      /_(.*?)_/g,
      '<em class="italic">$1</em>'
    );

    // Format code blocks with Tailwind classes
    formattedText = formattedText.replace(
      /```(\w+)?\n([\s\S]*?)```/g,
      '<pre class="bg-gray-100 border border-gray-300 rounded-lg p-4 my-3 overflow-x-auto"><code class="text-sm font-mono text-gray-800">$2</code></pre>'
    );

    // Format inline code with Tailwind classes
    formattedText = formattedText.replace(
      /`([^`]+)`/g,
      '<code class="bg-gray-100 text-red-600 px-1 py-0.5 rounded text-sm font-mono">$1</code>'
    );

    // Format unordered lists
    formattedText = formattedText.replace(
      /^[-*+]\s+(.*$)/gim,
      '<li class="ml-4">$1</li>'
    );
    formattedText = formattedText.replace(
      /(<li.*<\/li>)/gim,
      '<ul class="list-disc ml-6 my-2">$1</ul>'
    );

    // Format ordered lists
    formattedText = formattedText.replace(
      /^\d+\.\s+(.*$)/gim,
      '<li class="ml-4">$1</li>'
    );
    formattedText = formattedText.replace(
      /(<li.*<\/li>)/gim,
      '<ol class="list-decimal ml-6 my-2">$1</ol>'
    );

    // Format links
    formattedText = formattedText.replace(
      /\[([^\]]+)\]\(([^)]+)\)/g,
      '<a href="$2" class="text-blue-600 hover:text-blue-800 underline" target="_blank">$1</a>'
    );

    // Format horizontal rules
    formattedText = formattedText.replace(
      /^[-*_]{3,}$/gm,
      '<hr class="border-gray-300 my-4">'
    );

    // Format blockquotes
    formattedText = formattedText.replace(
      /^>\s+(.*$)/gim,
      '<blockquote class="border-l-4 border-gray-300 pl-4 my-3 italic text-gray-700">$1</blockquote>'
    );

    // Format strikethrough
    formattedText = formattedText.replace(
      /~~(.*?)~~/g,
      '<del class="line-through">$1</del>'
    );

    // Convert line breaks to HTML
    formattedText = formattedText.replace(/\n/g, "<br>");

    return formattedText;
  }
}

// Initialize Gemini API with your API key
// You'll need to get a free API key from Google AI Studio
// https://makersuite.google.com/app/apikey
const GEMINI_API_KEY = "AIzaSyAsWFUuZHTcx4XslNpdHvV4iphY93jwh4I"; // Replace with your actual API key

// Create global instance
const geminiAPI = new GeminiAPI(GEMINI_API_KEY);

// Export for use in other files
window.geminiAPI = geminiAPI;
