// Check if user name exists in localStorage when page loads
document.addEventListener("DOMContentLoaded", function () {
  const userName = localStorage.getItem("onboardlyUserName");

  if (!userName) {
    // If no name is stored, prompt the user
    promptForName();
  } else {
    // If name exists, display it
    updateGreeting(userName);
  }

  // Load saved profile photo if exists
  loadProfilePhoto();

  // Load saved chat history if exists
  loadChatHistory();

  // Set up photo upload functionality
  setupPhotoUpload();

  // Set up chat functionality
  setupChatFunctionality();

  // Set up image generation functionality
  setupImageGeneration();

  // Check if this is user's first visit and show tour
  checkAndShowTour();
});

// Global variable to store conversation history
let conversationHistory = [];

// Global variable to track current mode (chat or image generation)
let currentMode = "chat"; // "chat" or "image"

// Tour functionality
let currentTourStep = 0;
let tourActive = false;

// Command palette functionality
let commandPaletteActive = false;
let selectedCommandIndex = 0;
let availableCommands = [
  {
    command: "clear",
    description: "Clear chat history",
    icon: "clear_all",
  },
  {
    command: "logout",
    description: "Logout and reload page",
    icon: "logout",
  },
  {
    command: "tour",
    description: "Start the app tour",
    icon: "help",
  },
  {
    command: "image",
    description: "Switch to image generation mode",
    icon: "image",
  },
  {
    command: "chat",
    description: "Switch to chat mode",
    icon: "chat",
  },
];

// Tour steps configuration
const tourSteps = [
  {
    target: "#profilePhotoContainer",
    title: "Upload Profile Photo",
    content:
      "Click here to upload your profile photo. You can change it anytime!",
    position: "bottom",
  },
  {
    target: ".grid",
    title: "Quick Start Cards",
    content:
      "Click on any of these cards to quickly start a conversation with predefined questions about IPMC Ghana.",
    position: "top",
  },
  {
    target: "#modeToggle",
    title: "Mode Toggle",
    content:
      "Click here to switch between Chat mode and Image Generation mode. In Image mode, you can generate images from text descriptions. Image prompt cards will automatically switch to image mode when clicked.",
    position: "top",
  },
  {
    target: "#chatInput",
    title: "Chat Commands",
    content:
      "Type '/' to see available commands like clear, logout, and tour. Use arrow keys to navigate and Enter to select.",
    position: "top",
  },
];

// Function to check if user needs tour
function checkAndShowTour() {
  const hasSeenTour = localStorage.getItem("hasSeenTour");
  if (!hasSeenTour) {
    // Show tour after a short delay
    setTimeout(() => {
      startTour();
    }, 1000);
  }
}

// Function to start the tour
function startTour() {
  tourActive = true;
  currentTourStep = 0;
  document.body.classList.add("tour-active");
  showTourStep();
}

// Function to show current tour step
function showTourStep() {
  if (currentTourStep >= tourSteps.length) {
    endTour();
    return;
  }

  const step = tourSteps[currentTourStep];
  const targetElement = document.querySelector(step.target);

  if (!targetElement) {
    currentTourStep++;
    showTourStep();
    return;
  }

  // Remove existing tour overlay
  removeTourOverlay();

  // Create tour overlay
  createTourOverlay(targetElement, step);
}

// Function to create tour overlay
function createTourOverlay(targetElement, step) {
  // Create overlay
  const overlay = document.createElement("div");
  overlay.id = "tourOverlay";
  overlay.className =
    "fixed inset-0 bg-black bg-opacity-50 z-[9999] flex items-center justify-center";

  // Create tour card
  const tourCard = document.createElement("div");
  tourCard.className =
    "bg-white rounded-lg shadow-xl max-w-md mx-4 p-6 relative";

  // Position the card near the target element
  const rect = targetElement.getBoundingClientRect();
  const cardStyle = getCardPosition(rect, step.position);
  tourCard.style.cssText = cardStyle;

  // Add resize event listener to reposition card when window is resized
  const handleResize = () => {
    const newRect = targetElement.getBoundingClientRect();
    const newCardStyle = getCardPosition(newRect, step.position);
    tourCard.style.cssText = newCardStyle;
  };

  window.addEventListener("resize", handleResize);

  // Store the resize handler for cleanup
  tourCard.dataset.resizeHandler = "true";
  tourCard._resizeHandler = handleResize;

  // Add content
  tourCard.innerHTML = `
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-semibold text-gray-800">${step.title}</h3>
      <button onclick="closeTour()" class="text-gray-400 hover:text-gray-600">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </button>
    </div>
    <p class="text-gray-600 mb-4">${step.content}</p>
    <div class="flex justify-between items-center">
      <span class="text-sm text-gray-500">${currentTourStep + 1} of ${
    tourSteps.length
  }</span>
      <div class="flex space-x-2">
        <button onclick="skipTour()" class="text-sm text-gray-500 hover:text-gray-700">
          Skip Tour
        </button>
        <div class="flex space-x-2">
          ${
            currentTourStep > 0
              ? `
            <button onclick="previousTourStep()" class="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors">
              Previous
            </button>
          `
              : ""
          }
          <button onclick="nextTourStep()" class="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors">
            ${currentTourStep === tourSteps.length - 1 ? "Finish" : "Next"}
          </button>
        </div>
      </div>
    </div>
  `;

  overlay.appendChild(tourCard);
  document.body.appendChild(overlay);

  // Highlight target element
  targetElement.style.zIndex = "9998";
  targetElement.style.position = "relative";
  targetElement.style.boxShadow = "0 0 0 4px rgba(59, 130, 246, 0.5)";
}

// Function to get card position based on target element
function getCardPosition(rect, position) {
  const padding = 20;
  let top, left;

  // Check if screen size is 2xl or above (1536px and above)
  const is2xlOrAbove = window.innerWidth >= 1536;

  if (is2xlOrAbove) {
    // For 2xl screens and above, use original positioning
    switch (position) {
      case "top":
        top = Math.max(0, rect.top - 200);
        left = Math.max(0, rect.left - 200);
        break;
      case "bottom":
        top = rect.bottom + padding;
        left = Math.max(0, rect.left - 100);
        break;
      case "left":
        top = rect.top;
        left = Math.max(0, rect.left - 300);
        break;
      default:
        top = rect.top + padding;
        left = rect.left + padding;
    }
  } else {
    // For screens smaller than 2xl, center the card in the middle of the page
    const cardHeight = 200; // Approximate height of the tour card
    const cardWidth = 400; // Approximate width of the tour card

    top = (window.innerHeight - cardHeight) / 2;
    left = (window.innerWidth - cardWidth) / 2;

    // Ensure the card doesn't go off-screen
    top = Math.max(20, Math.min(top, window.innerHeight - cardHeight - 20));
    left = Math.max(20, Math.min(left, window.innerWidth - cardWidth - 20));
  }

  return `position: fixed; top: ${top}px; left: ${left}px; z-index: 10000;`;
}

// Function to remove tour overlay
function removeTourOverlay() {
  const overlay = document.getElementById("tourOverlay");
  if (overlay) {
    // Remove resize event listeners from tour cards
    const tourCards = overlay.querySelectorAll('[data-resize-handler="true"]');
    tourCards.forEach((card) => {
      if (card._resizeHandler) {
        window.removeEventListener("resize", card._resizeHandler);
      }
    });

    overlay.remove();
  }

  // Remove highlighting from all elements
  document.querySelectorAll("*").forEach((el) => {
    el.style.zIndex = "";
    el.style.position = "";
    el.style.boxShadow = "";
  });

  // Remove tour-active class from body
  document.body.classList.remove("tour-active");
}

// Function to go to next tour step
function previousTourStep() {
  if (currentTourStep > 0) {
    currentTourStep--;
    showTourStep();
  }
}

function nextTourStep() {
  currentTourStep++;
  showTourStep();
}

// Function to skip tour
function skipTour() {
  endTour();
}

// Function to end tour
function endTour() {
  tourActive = false;
  removeTourOverlay();
  document.body.classList.remove("tour-active");
  localStorage.setItem("hasSeenTour", "true");

  // Show completion message
  showSuccess(
    "Tour completed! You can restart it anytime by typing 'tour' in the chat."
  );
}

// Add tour command to chat
function handleTourCommand() {
  localStorage.removeItem("hasSeenTour");
  startTour();
}

// Function to close tour (same as skip)
function closeTour() {
  skipTour();
}

// Make tour functions globally accessible
window.nextTourStep = nextTourStep;
window.previousTourStep = previousTourStep;
window.skipTour = skipTour;
window.closeTour = closeTour;

// Command palette functions
function handleCommandPalette(inputValue) {
  if (inputValue.startsWith("/")) {
    const searchTerm = inputValue.slice(1).toLowerCase();

    if (searchTerm === "") {
      // Show all commands when just "/" is typed
      showCommandPalette(availableCommands);
    } else {
      // Filter commands based on search term
      const filteredCommands = availableCommands.filter(
        (cmd) =>
          cmd.command.toLowerCase().includes(searchTerm) ||
          cmd.description.toLowerCase().includes(searchTerm)
      );
      showCommandPalette(filteredCommands);
    }
  } else {
    hideCommandPalette();
  }
}

function showCommandPalette(commands) {
  hideCommandPalette(); // Remove existing palette

  if (commands.length === 0) return;

  commandPaletteActive = true;
  selectedCommandIndex = 0;

  const inputContainer = document.querySelector(".material-input-container");
  if (!inputContainer) return;

  // Create command palette
  const palette = document.createElement("div");
  palette.id = "commandPalette";
  palette.className =
    "absolute bottom-full left-0 right-0 mb-2 bg-white rounded-lg shadow-xl border border-gray-200 max-h-64 overflow-y-auto z-50";

  const commandsList = commands
    .map(
      (cmd, index) => `
    <div class="command-item flex items-center px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors ${
      index === 0 ? "bg-gray-50" : ""
    }" 
         data-command="${cmd.command}" 
         data-index="${index}">
      <span class="material-icons text-gray-500 mr-3 text-lg">${cmd.icon}</span>
      <div class="flex-1">
        <div class="font-medium text-gray-900">/${cmd.command}</div>
        <div class="text-sm text-gray-500">${cmd.description}</div>
      </div>
      <div class="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">Enter</div>
    </div>
  `
    )
    .join("");

  palette.innerHTML = commandsList;

  // Position the palette
  inputContainer.style.position = "relative";
  inputContainer.appendChild(palette);

  // Add click event listeners
  palette.querySelectorAll(".command-item").forEach((item) => {
    item.addEventListener("click", function () {
      const command = this.getAttribute("data-command");
      executeCommand(command);
    });
  });
}

function hideCommandPalette() {
  const palette = document.getElementById("commandPalette");
  if (palette) {
    palette.remove();
  }
  commandPaletteActive = false;
  selectedCommandIndex = 0;
}

function handleCommandPaletteNavigation(event) {
  if (!commandPaletteActive) return;

  const palette = document.getElementById("commandPalette");
  if (!palette) return;

  const commandItems = palette.querySelectorAll(".command-item");

  switch (event.key) {
    case "ArrowDown":
      event.preventDefault();
      selectedCommandIndex = Math.min(
        selectedCommandIndex + 1,
        commandItems.length - 1
      );
      updateCommandSelection(commandItems);
      break;
    case "ArrowUp":
      event.preventDefault();
      selectedCommandIndex = Math.max(selectedCommandIndex - 1, 0);
      updateCommandSelection(commandItems);
      break;
    case "Enter":
      event.preventDefault();
      if (commandItems[selectedCommandIndex]) {
        const command =
          commandItems[selectedCommandIndex].getAttribute("data-command");
        executeCommand(command);
      }
      break;
    case "Escape":
      event.preventDefault();
      hideCommandPalette();
      break;
  }
}

function updateCommandSelection(commandItems) {
  commandItems.forEach((item, index) => {
    if (index === selectedCommandIndex) {
      item.classList.add("bg-gray-50");
    } else {
      item.classList.remove("bg-gray-50");
    }
  });
}

function executeCommand(command) {
  const chatInput = document.getElementById("chatInput");
  if (chatInput) {
    if (command === "image") {
      toggleMode();
      hideCommandPalette();
    } else if (command === "chat") {
      toggleMode();
      hideCommandPalette();
    } else {
      chatInput.value = command;
      hideCommandPalette();
      handleSendMessage();
    }
  }
}

// Function to save chat history to localStorage
function saveChatHistory() {
  try {
    localStorage.setItem(
      "ipmcChatHistory",
      JSON.stringify(conversationHistory)
    );
  } catch (error) {
    console.error("Error saving chat history:", error);
  }
}

// Function to load chat history from localStorage
function loadChatHistory() {
  try {
    const savedHistory = localStorage.getItem("ipmcChatHistory");
    if (savedHistory) {
      conversationHistory = JSON.parse(savedHistory);
      // Restore chat UI if there's history
      if (conversationHistory.length > 0) {
        restoreChatUI();
      }
    }
  } catch (error) {
    console.error("Error loading chat history:", error);
    conversationHistory = [];
  }
}

// Function to restore chat UI from saved history
function restoreChatUI() {
  // Create chat container if it doesn't exist
  let chatContainer = document.getElementById("chatContainer");
  if (!chatContainer) {
    chatContainer = createChatContainer();
  }

  // Hide the prompt cards
  const promptCardsContainer = document.querySelector(".grid");
  if (promptCardsContainer) {
    promptCardsContainer.style.display = "none";
  }

  // Display all saved messages
  conversationHistory.forEach((entry) => {
    const userMessageElement = createMessageElement(entry.user, "user");
    const aiMessageElement = createMessageElement(entry.ai, "ai");

    // If this is an image message, add the image to the AI message
    if (entry.type === "image" && entry.imageData) {
      const aiBubble = aiMessageElement.querySelector(".message-bubble");
      if (aiBubble) {
        // Create image element
        const imageElement = document.createElement("img");
        imageElement.src = `data:image/png;base64,${entry.imageData}`;
        imageElement.className = "max-w-full h-auto rounded-lg shadow-md mt-2";
        imageElement.alt = "Generated image";

        // Add text response if any
        if (entry.ai) {
          aiBubble.innerHTML = window.geminiAPI.formatResponse({
            success: true,
            text: entry.ai,
          });
          aiBubble.appendChild(imageElement);
        } else {
          aiBubble.appendChild(imageElement);
        }
      }
    }

    chatContainer.appendChild(userMessageElement);
    chatContainer.appendChild(aiMessageElement);
  });

  // Scroll to bottom
  chatContainer.scrollTop = chatContainer.scrollHeight;
}

function promptForName() {
  let name = null;

  // Keep prompting until user enters a valid name
  while (!name || name.trim() === "") {
    name = prompt("Welcome to Onboardly! Please enter your name to continue:");

    // If user cancels the prompt, set a default name
    if (name === null) {
      name = "Guest";
      break;
    }

    // If user enters only spaces, show error and prompt again
    if (name.trim() === "") {
      alert("Please enter a valid name.");
    }
  }

  // Clean up the name (remove extra spaces)
  name = name.trim();

  // Store the name in localStorage
  localStorage.setItem("onboardlyUserName", name);

  // Update the greeting
  updateGreeting(name);

  // Show welcome message
  if (name !== "Guest") {
    setTimeout(() => {
      alert(`Welcome to Onboardly, ${name}! You're now logged in.`);
    }, 500);
  }
}

function updateGreeting(name) {
  const greetingElement = document.getElementById("userGreeting");
  if (greetingElement) {
    greetingElement.textContent = `Hi ${name}`;
  }
}

// Optional: Function to clear user data (for testing or logout)
function clearUserData() {
  localStorage.removeItem("onboardlyUserName");
  location.reload();
}

// Optional: Function to change user name
function changeUserName() {
  const currentName = localStorage.getItem("onboardlyUserName");
  const newName = prompt(
    `Current name: ${currentName}\nEnter new name:`,
    currentName
  );

  if (newName && newName.trim() !== "" && newName.trim() !== currentName) {
    localStorage.setItem("onboardlyUserName", newName.trim());
    updateGreeting(newName.trim());
    alert("Name updated successfully!");
  }
}
// Profile photo functionality
function setupPhotoUpload() {
  const profilePhotoContainer = document.getElementById(
    "profilePhotoContainer"
  );
  const photoUpload = document.getElementById("photoUpload");

  if (profilePhotoContainer && photoUpload) {
    // Click on profile photo container triggers file input
    profilePhotoContainer.addEventListener("click", function () {
      photoUpload.click();
    });

    // Handle file selection
    photoUpload.addEventListener("change", function (event) {
      const file = event.target.files[0];
      if (file) {
        handlePhotoUpload(file);
      }
    });
  }
}

function handlePhotoUpload(file) {
  // Validate file type
  if (!file.type.startsWith("image/")) {
    alert("Please select a valid image file.");
    return;
  }

  // Validate file size (max 5MB)
  const maxSize = 5 * 1024 * 1024; // 5MB in bytes
  if (file.size > maxSize) {
    alert("Image size should be less than 5MB.");
    return;
  }

  // Create FileReader to convert image to base64
  const reader = new FileReader();

  reader.onload = function (e) {
    const imageDataUrl = e.target.result;

    // Save to localStorage
    localStorage.setItem("onboardlyProfilePhoto", imageDataUrl);

    // Update the profile photo display
    updateProfilePhoto(imageDataUrl);

    // Show success message
    alert("Profile photo updated successfully!");
  };

  reader.onerror = function () {
    alert("Error reading the image file. Please try again.");
  };

  // Read the file as data URL
  reader.readAsDataURL(file);
}

function loadProfilePhoto() {
  const savedPhoto = localStorage.getItem("onboardlyProfilePhoto");
  const profilePhoto = document.getElementById("profilePhoto");

  if (profilePhoto) {
    if (savedPhoto) {
      updateProfilePhoto(savedPhoto);
    } else {
      // Ensure default photo is set
      profilePhoto.src = getDefaultProfilePhoto();
    }
  }
}

function updateProfilePhoto(imageDataUrl) {
  const profilePhoto = document.getElementById("profilePhoto");
  if (profilePhoto) {
    profilePhoto.src = imageDataUrl;
  }
}

// Optional: Function to remove profile photo
function removeProfilePhoto() {
  localStorage.removeItem("onboardlyProfilePhoto");
  const profilePhoto = document.getElementById("profilePhoto");
  if (profilePhoto) {
    profilePhoto.src = getDefaultProfilePhoto();
  }
  alert("Profile photo removed successfully!");
}

// Function to get default profile photo
function getDefaultProfilePhoto() {
  return "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Crect width='40' height='40' fill='%23cccccc'/%3E%3Ctext x='50%25' y='50%25' font-size='20' text-anchor='middle' dy='.3em' fill='%23666666'%3E👤%3C/text%3E%3C/svg%3E";
}

// Enhanced clear user data function to include photo
function clearUserData() {
  localStorage.removeItem("onboardlyUserName");
  localStorage.removeItem("onboardlyProfilePhoto");
  location.reload();
}

// Function to load ABOUT.md content
async function loadAboutContent() {
  try {
    const response = await fetch("ABOUT.md");
    if (!response.ok) {
      throw new Error(`Failed to load ABOUT.md: ${response.status}`);
    }
    const aboutContent = await response.text();

    // Parse and clean markdown content for AI context
    const cleanContent = parseMarkdownToText(aboutContent);

    // Extract key information from ABOUT.md and format it for the AI context
    const aboutContext = `You are an AI assistant for IPMC Ghana, a leading IT solutions provider in West Africa. Here is the company information to help you provide accurate responses:

${cleanContent}

Please provide helpful, accurate information about IPMC Ghana's services, programs, and capabilities. Always be professional and informative.`;

    return aboutContext;
  } catch (error) {
    console.error("Error loading ABOUT.md:", error);
    // Fallback to basic context if ABOUT.md cannot be loaded
    return `You are an AI assistant for IPMC Ghana, a leading IT solutions provider in West Africa. Please provide helpful, accurate information about IPMC Ghana's services, programs, and capabilities. Always be professional and informative.`;
  }
}

// Function to parse markdown to clean text
function parseMarkdownToText(markdown) {
  return (
    markdown
      // Remove markdown headers (# ## ### etc.)
      .replace(/^#{1,6}\s+/gm, "")
      // Remove bold formatting (**text** or __text__)
      .replace(/\*\*(.*?)\*\*/g, "$1")
      .replace(/__(.*?)__/g, "$1")
      // Remove italic formatting (*text* or _text_)
      .replace(/\*(.*?)\*/g, "$1")
      .replace(/_(.*?)_/g, "$1")
      // Remove code blocks (```code```)
      .replace(/```[\s\S]*?```/g, "")
      // Remove inline code (`code`)
      .replace(/`([^`]*)`/g, "$1")
      // Remove links [text](url)
      .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
      // Remove horizontal rules (--- or ***)
      .replace(/^[-*_]{3,}$/gm, "")
      // Remove list markers (- * +)
      .replace(/^[-*+]\s+/gm, "")
      // Remove numbered list markers (1. 2. etc.)
      .replace(/^\d+\.\s+/gm, "")
      // Remove blockquotes (>)
      .replace(/^>\s+/gm, "")
      // Remove strikethrough (~~text~~)
      .replace(/~~(.*?)~~/g, "$1")
      // Clean up multiple spaces and newlines
      .replace(/\n\s*\n\s*\n/g, "\n\n")
      .replace(/\s{2,}/g, " ")
      .trim()
  );
}

// Chat functionality with Gemini API
function setupChatFunctionality() {
  const chatInput = document.getElementById("chatInput");
  const sendButton = document.getElementById("sendButton");
  const promptCards = document.querySelectorAll(".prompt-card");

  // Handle send button click
  if (sendButton) {
    sendButton.addEventListener("click", handleSendMessage);
  }

  // Handle Enter key press
  if (chatInput) {
    chatInput.addEventListener("keypress", function (event) {
      if (event.key === "Enter") {
        handleSendMessage();
      }
    });

    // Handle input changes for command palette
    chatInput.addEventListener("input", function (event) {
      handleCommandPalette(event.target.value);
    });

    // Handle keydown for command palette navigation
    chatInput.addEventListener("keydown", function (event) {
      handleCommandPaletteNavigation(event);
    });
  }

  // Handle prompt card clicks
  promptCards.forEach((card) => {
    card.addEventListener("click", function () {
      const prompt = this.getAttribute("data-prompt");
      if (prompt) {
        // Check if this is an image generation prompt
        const isImagePrompt =
          prompt.toLowerCase().includes("generate") ||
          prompt.toLowerCase().includes("create") ||
          prompt.toLowerCase().includes("image") ||
          prompt.toLowerCase().includes("illustration") ||
          prompt.toLowerCase().includes("3d") ||
          prompt.toLowerCase().includes("rendered");

        if (isImagePrompt && currentMode === "chat") {
          // Switch to image mode first, then send the prompt
          toggleMode();
          setTimeout(() => {
            sendMessage(prompt);
          }, 100); // Small delay to ensure mode switch completes
        } else {
          // Send the prompt in current mode
          sendMessage(prompt);
        }
      }
    });
  });
}

// Image generation functionality
function setupImageGeneration() {
  const modeToggle = document.getElementById("modeToggle");

  // Handle mode toggle
  if (modeToggle) {
    modeToggle.addEventListener("click", toggleMode);
  }
}

// Function to toggle between chat and image generation modes
function toggleMode() {
  const modeIcon = document.getElementById("modeIcon");
  const imageUploadBtn = document.getElementById("imageUploadBtn");
  const chatInput = document.getElementById("chatInput");

  if (currentMode === "chat") {
    // Switch to image generation mode
    currentMode = "image";
    modeIcon.textContent = "auto_awesome";
    chatInput.placeholder =
      "Describe the image you want to generate (e.g., 'a futuristic office with computers')...";
    showSuccess(
      "Switched to Image Generation mode. Try describing what you want to see!"
    );
  } else {
    // Switch to chat mode
    currentMode = "chat";
    modeIcon.textContent = "chat_bubble_outline";
    chatInput.placeholder = "Ask whatever you want";
    showSuccess("Switched to Chat mode");
  }
}

async function handleSendMessage() {
  const chatInput = document.getElementById("chatInput");
  const message = chatInput.value.trim();

  if (message) {
    await sendMessage(message);
    chatInput.value = "";
  }
}

async function sendMessage(message) {
  // Check for clear command first
  if (message.toLowerCase().trim() === "clear") {
    clearChat();
    return;
  }

  // Check for logout command
  if (message.toLowerCase().trim() === "logout") {
    logout();
    return;
  }

  // Check for tour command
  if (message.toLowerCase().trim() === "tour") {
    handleTourCommand();
    return;
  }

  // Show loading state
  showLoadingState();

  try {
    // Check if Gemini API is available
    if (!window.geminiAPI) {
      throw new Error(
        "Gemini API not loaded. Please check your API key configuration."
      );
    }

    // Create message elements first
    const userMessageElement = createMessageElement(message, "user");
    const aiMessageElement = createMessageElement("", "ai");

    // Add user message to chat
    let chatContainer = document.getElementById("chatContainer");
    if (!chatContainer) {
      chatContainer = createChatContainer();
    }
    chatContainer.appendChild(userMessageElement);
    chatContainer.appendChild(aiMessageElement);

    // Scroll to bottom
    chatContainer.scrollTop = chatContainer.scrollHeight;

    let response;

    if (currentMode === "image") {
      // Handle image generation
      response = await window.geminiAPI.generateImage(message);

      // Display image response
      if (response.success && response.imageData) {
        const aiBubble = aiMessageElement.querySelector(".message-bubble");
        if (aiBubble) {
          // Create image element
          const imageElement = document.createElement("img");
          imageElement.src = `data:image/png;base64,${response.imageData}`;
          imageElement.className =
            "max-w-full h-auto rounded-lg shadow-md mt-2";
          imageElement.alt = "Generated image";

          // Add text response if any
          if (response.text) {
            aiBubble.innerHTML = window.geminiAPI.formatResponse({
              success: true,
              text: response.text,
            });
            aiBubble.appendChild(imageElement);
          } else {
            aiBubble.appendChild(imageElement);
          }
        }
      } else {
        // Handle text-only response or error
        const aiBubble = aiMessageElement.querySelector(".message-bubble");
        if (aiBubble) {
          aiBubble.innerHTML = window.geminiAPI.formatResponse({
            success: response.success,
            text: response.text,
          });
        }
      }
    } else {
      // Handle normal chat mode
      // Load ABOUT.md content dynamically
      const aboutContext = await loadAboutContent();

      // Build conversation history context
      let conversationContext = "";
      if (conversationHistory.length > 0) {
        conversationContext = "\n\nPrevious Conversation:\n";
        conversationHistory.forEach((entry, index) => {
          conversationContext += `User: ${entry.user}\nAI: ${entry.ai}\n\n`;
        });
      }

      // Combine context with conversation history and current message
      const contextualizedMessage = `${aboutContext}${conversationContext}Current User Question: ${message}`;

      // Get streaming response from Gemini
      response = await window.geminiAPI.generateStreamingResponse(
        contextualizedMessage,
        (chunk) => {
          // Update AI message with streaming content
          const aiBubble = aiMessageElement.querySelector(".message-bubble");
          if (aiBubble) {
            aiBubble.innerHTML = window.geminiAPI.formatResponse({
              success: true,
              text: chunk,
            });
          }
          chatContainer.scrollTop = chatContainer.scrollHeight;
        }
      );
    }

    // Add to conversation history for both chat and image modes
    if (currentMode === "chat") {
      conversationHistory.push({
        user: message,
        ai: response.text,
        type: "chat",
      });
    } else if (currentMode === "image") {
      conversationHistory.push({
        user: message,
        ai: response.text,
        imageData: response.imageData,
        type: "image",
      });
    }

    // Keep only last 10 conversations to prevent context overflow
    if (conversationHistory.length > 10) {
      conversationHistory = conversationHistory.slice(-10);
    }

    // Save chat history to localStorage
    saveChatHistory();

    // Hide loading state
    hideLoadingState();
  } catch (error) {
    console.error("Error sending message:", error);
    hideLoadingState();

    // Check if it's an image generation error
    if (currentMode === "image" && error.message.includes("not available")) {
      showError(
        "Image generation may not be available in your region. Please try chat mode instead."
      );
    } else {
      showError("Failed to get response. Please try again.");
    }
  }
}

function showLoadingState() {
  const sendButton = document.getElementById("sendButton");
  if (sendButton) {
    sendButton.innerHTML = `
      <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900"></div>
    `;
    sendButton.style.pointerEvents = "none";
  }
}

function hideLoadingState() {
  const sendButton = document.getElementById("sendButton");
  if (sendButton) {
    sendButton.innerHTML = `
      <span class="material-icons text-white text-xl">send</span>
    `;
    sendButton.style.pointerEvents = "auto";
  }
}

function displayResponse(userMessage, apiResponse) {
  // Create chat container if it doesn't exist
  let chatContainer = document.getElementById("chatContainer");
  if (!chatContainer) {
    chatContainer = createChatContainer();
  }

  // Create message elements
  const userMessageElement = createMessageElement(userMessage, "user");
  const aiMessageElement = createMessageElement(apiResponse.text, "ai");

  // Add messages to chat container
  chatContainer.appendChild(userMessageElement);
  chatContainer.appendChild(aiMessageElement);

  // Scroll to bottom
  chatContainer.scrollTop = chatContainer.scrollHeight;
}

function createChatContainer() {
  // Hide the prompt cards
  const promptCardsContainer = document.querySelector(".grid");
  if (promptCardsContainer) {
    promptCardsContainer.style.display = "none";
  }

  // Add chat-active class to main
  const mainElement = document.querySelector("main");
  if (mainElement) {
    mainElement.classList.add("chat-active");
  }

  // Create chat container
  const chatContainer = document.createElement("div");
  chatContainer.id = "chatContainer";
  chatContainer.className = "flex-1 overflow-y-auto px-4 py-6 w-full mx-auto";
  chatContainer.style.maxHeight = "calc(100vh - 300px)";

  // Insert chat container before the input
  const inputContainer = document.querySelector(".material-fab-container");
  if (inputContainer && inputContainer.parentNode) {
    inputContainer.parentNode.insertBefore(chatContainer, inputContainer);
  }

  return chatContainer;
}

function createMessageElement(message, sender) {
  const messageDiv = document.createElement("div");
  messageDiv.className = "flex w-full mb-4";

  const messageBubble = document.createElement("div");

  if (sender === "user") {
    messageBubble.className =
      "message-bubble bg-gradient-to-r from-red-500 to-red-600 text-white rounded-2xl rounded-br-md px-4 py-3 ml-auto max-w-xs lg:max-w-md shadow-lg material-ripple";
  } else {
    messageBubble.className =
      "message-bubble bg-white text-gray-800 rounded-2xl rounded-bl-md px-4 py-3 mr-auto max-w-xs lg:max-w-md shadow-md border border-gray-200";
  }

  // Format the message content
  if (sender === "ai") {
    messageBubble.innerHTML = window.geminiAPI.formatResponse({
      success: true,
      text: message,
    });
  } else {
    messageBubble.textContent = message;
  }

  messageDiv.appendChild(messageBubble);
  return messageDiv;
}

function showError(message) {
  // Create a simple error notification
  const errorDiv = document.createElement("div");
  errorDiv.className =
    "error-notification fixed top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg z-50";
  errorDiv.textContent = message;

  document.body.appendChild(errorDiv);

  // Remove after 3 seconds
  setTimeout(() => {
    if (errorDiv.parentNode) {
      errorDiv.parentNode.removeChild(errorDiv);
    }
  }, 3000);
}

function showSuccess(message) {
  // Create a simple success notification
  const successDiv = document.createElement("div");
  successDiv.className =
    "success-notification fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50";
  successDiv.textContent = message;

  document.body.appendChild(successDiv);

  // Remove after 2 seconds
  setTimeout(() => {
    if (successDiv.parentNode) {
      successDiv.parentNode.removeChild(successDiv);
    }
  }, 2000);
}

// Function to clear chat and show prompt cards
function clearChat() {
  const chatContainer = document.getElementById("chatContainer");
  if (chatContainer) {
    chatContainer.remove();
  }

  // Remove chat-active class from main
  const mainElement = document.querySelector("main");
  if (mainElement) {
    mainElement.classList.remove("chat-active");
  }

  const promptCardsContainer = document.querySelector(".grid");
  if (promptCardsContainer) {
    promptCardsContainer.style.display = "grid";
  }

  // Clear conversation history
  conversationHistory = [];

  // Save empty history to localStorage
  saveChatHistory();

  // Show a brief confirmation message
  showSuccess("Chat cleared successfully!");
}

// Function to logout user
function logout() {
  // Clear all user data
  localStorage.removeItem("onboardlyUserName");
  localStorage.removeItem("onboardlyProfilePhoto");
  localStorage.removeItem("ipmcChatHistory");

  // Clear conversation history
  conversationHistory = [];

  // Clear chat UI
  const chatContainer = document.getElementById("chatContainer");
  if (chatContainer) {
    chatContainer.remove();
  }

  // Show prompt cards
  const promptCardsContainer = document.querySelector(".grid");
  if (promptCardsContainer) {
    promptCardsContainer.style.display = "grid";
  }

  // Reset greeting
  const greetingElement = document.getElementById("userGreeting");
  if (greetingElement) {
    greetingElement.textContent = "Hi Guest";
  }

  // Reset profile photo
  const profilePhoto = document.getElementById("profilePhoto");
  if (profilePhoto) {
    profilePhoto.src = getDefaultProfilePhoto();
  }

  // Show logout message
  showSuccess("Logged out successfully! Reloading page...");

  // Reload the page after a short delay to trigger login prompt
  setTimeout(() => {
    location.reload();
  }, 1500);
}
