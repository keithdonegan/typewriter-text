// Create a self-contained typewriter effect on a given DOM element
function fehTypewriterFactory(el, options = {}) {

  // Setup default values and allow user overrides via `options`
  const phrases = options.phrases || ["Hello World!"]; // Array of phrases to cycle through
  const typingSpeed = options.typingSpeed || 60;        // Time between typed characters (ms)
  const deletingSpeed = options.deletingSpeed || 30;    // Time between deleted characters (ms)
  const delayBetween = options.delayBetween || 1500;    // Pause after typing a full phrase (ms)
  const colors = options.colors || ["#fff"];            // Array of text colors for cycling

  // Internal state tracking for current phrase, current text, and delete mode
  let currentPhraseIndex = 0;
  let currentText = '';
  let isDeleting = false;

  // Create and configure the text and cursor spans
  const textSpan = document.createElement('span');        // Holds the actual text being typed
  const cursorSpan = document.createElement('span');      // The blinking cursor
  textSpan.className = 'typewriter-text';                 // For styling text
  cursorSpan.className = 'typewriter-cursor';             // For styling cursor
  cursorSpan.textContent = '|';                           // The blinking character

  // Clear any existing content and inject our spans into the element
  el.textContent = '';
  el.appendChild(textSpan);
  el.appendChild(cursorSpan);

  // Initialize the color of the first phrase
  textSpan.style.color = colors[0] || '#fff';

  // The core typing loop, runs recursively via setTimeout
  function fehType() {
    // Get the current phrase we’re working on
    const phrase = phrases[currentPhraseIndex];

    // Handle character-by-character typing or deleting
    if (isDeleting) {
      // Remove one character from the current text
      currentText = phrase.substring(0, currentText.length - 1);
    } else {
      // Add one character to the current text
      currentText = phrase.substring(0, currentText.length + 1);
    }

    // Update the text content in the DOM
    textSpan.textContent = currentText;

    // Determine typing or deleting speed
    let delay = isDeleting ? deletingSpeed : typingSpeed;

    // Check if we just finished typing the full phrase
    if (!isDeleting && currentText === phrase) {
      delay = delayBetween;   // Pause before deleting
      isDeleting = true;      // Switch to delete mode
    }
    // Check if we just finished deleting the whole phrase
    else if (isDeleting && currentText === '') {
      isDeleting = false;                                       // Switch back to typing mode
      currentPhraseIndex = (currentPhraseIndex + 1) % phrases.length; // Move to next phrase (looped)
      delay = 500;                                              // Short pause before typing next phrase
      textSpan.style.color = colors[currentPhraseIndex % colors.length]; // Update text color
    }

    // Schedule the next step of the animation
    setTimeout(type, delay);
  }

  // Start the typing animation
  fehType();
}
