// getting input from index.json

fetch('./../json/al-quran.json')
  .then(response => response.json())
  .then(data => {
    // Pick a random verse
    const randomIndex = Math.floor(Math.random() * data.length);
    const verse = data[randomIndex];

    // Update Surah and Verse Number
    document.getElementById("surah").textContent = "Surah " + verse.surah;
    document.getElementById("verse-number").textContent = "Verse Number: " + verse.verseNumber;


    // splitting of the verse loaded from json file

    const verseTextElement = document.getElementById("verse-text");
    verseTextElement.innerHTML = "";

    verse.verseText.split("").forEach(char => {
      const span = document.createElement("span");
      span.textContent = char;
      verseTextElement.appendChild(span);
    });

    startTyping();
  })
  .catch(error => {
    console.error('Error loading verses:');
  });


// typing logic 

let currentCharIndex = 0;
let startTime = null;

function startTyping() {
  currentCharIndex = 0;
  startTime = null;

  const verseTextElement = document.getElementById("verse-text");
  const spans = verseTextElement.querySelectorAll("span");
  updateActiveCursor(spans);

  document.addEventListener("keydown", handleTyping);
  document.getElementById("mobile-input").focus();



  // handle typing events

  function handleTyping(e) {
    if (e.key === " " || e.key === "Spacebar") {
      e.preventDefault(); // ✅ stop page scroll on spacebar
    }

    if (currentCharIndex >= spans.length) return;

    const expectedChar = spans[currentCharIndex].textContent;
    const typedChar = e.key;

    // Start timing on the first key press
    if (!startTime && typedChar.length === 1) {
      startTime = new Date();
    }


    // Handle Ctrl + Backspace: delete a full word
    if ((e.ctrlKey || e.metaKey) && e.key === "Backspace") {
      e.preventDefault();

      // Move cursor back to the start of the current word
      while (currentCharIndex > 0 && spans[currentCharIndex - 1].textContent === " ") {
        currentCharIndex--;
      }

      while (currentCharIndex > 0 && spans[currentCharIndex - 1].textContent !== " ") {
        currentCharIndex--;
      }
      // Remove coloring from deleted word
      let tempIndex = currentCharIndex;
      while (tempIndex < spans.length && spans[tempIndex].style.color) {
        spans[tempIndex].style.color = "";
        tempIndex++;
        if (spans[tempIndex] && spans[tempIndex].textContent === " ") break;
      }

      updateActiveCursor(spans);
      return;
    }







    // Handle correct or incorrect typing
    if (typedChar.length === 1 && typedChar !== "Backspace") {
      if (typedChar === expectedChar) {
        spans[currentCharIndex].style.color = "green";
      } else {
        spans[currentCharIndex].style.color = "red";
      }
      currentCharIndex++;
      updateActiveCursor(spans);
    } else if (typedChar === "Backspace" && currentCharIndex > 0) {
      currentCharIndex--;
      spans[currentCharIndex].style.color = "";
      updateActiveCursor(spans);
    }








    // Calculate WPM when done
    if (currentCharIndex === spans.length) {
      const endTime = new Date();
      const timeTakenInMinutes = (endTime - startTime) / 1000 / 60;
      const wordCount = spans.length / 5; // average word = 5 chars
      const wpm = Math.round(wordCount / timeTakenInMinutes);

      document.getElementById("wpm-display").textContent = `WPM: ${wpm}`;

      document.removeEventListener("keydown", handleTyping); // stop listening after done
    }
  }
}

function updateActiveCursor(spans) {
  spans.forEach(span => span.classList.remove("active-char"));

  if (currentCharIndex < spans.length) {
    const activeSpan = spans[currentCharIndex];
    activeSpan.classList.add("active-char");

    // Scroll active character into view if necessary
    activeSpan.scrollIntoView({
      behavior: "smooth",
      block: "center", // or "nearest" if you prefer minimal scroll
      inline: "nearest"
    });
  }
}
