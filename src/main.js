import references from "./assets/references.json" with { type: "json" };

const queryInput = document.getElementById("query");
const resultText = document.getElementById("resultText");
const embed = document.getElementById("embed");
const submitButton = document.getElementById("submitButton");

function cleanWords(text) {
  return String(text)
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, " ")
    .split(" ")
    .filter(function (word) {
      return word.length > 0;
    });
}

function countWordMatches(inputWords, referenceWords) {
  let matches = 0;

  for (let i = 0; i < inputWords.length; i += 1) {
    for (let j = 0; j < referenceWords.length; j += 1) {
      if (inputWords[i] === referenceWords[j]) {
        matches += 1;
        break;
      }
    }
  }

  return matches;
}

function findTrack(input) {
  const inputWords = cleanWords(input);
  let bestTrack = references[0];
  let bestScore = 0;

  for (let i = 0; i < references.length; i += 1) {
    const track = references[i];
    let trackScore = 0;

    for (let j = 0; j < track.reference.length; j += 1) {
      const referenceWords = cleanWords(track.reference[j]);
      const score = countWordMatches(inputWords, referenceWords);

      if (score > trackScore) {
        trackScore = score;
      }
    }

    if (trackScore > bestScore) {
      bestScore = trackScore;
      bestTrack = track;
    }
  }

  return bestTrack;
}

submitButton.addEventListener("click", function () {
  const typedText = queryInput.value;

  if (typedText.trim() === "") {
    resultText.textContent = "Result: please type something first";
    return;
  }

  const track = findTrack(typedText);

  resultText.textContent = "Result: " + track.name + " by " + track.artist;
  embed.src = "https://open.spotify.com/embed/track/" + track.trackId + "?utm_source=generator&theme=0";
});
