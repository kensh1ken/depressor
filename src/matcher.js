const WORD_RE = /[a-z0-9']+/g;

function normalize(text) {
  return String(text ?? "")
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9']+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function tokenize(text) {
  return normalize(text).match(WORD_RE) ?? [];
}

function diceCoefficient(left, right) {
  if (!left || !right) {
    return 0;
  }

  if (left === right) {
    return 1;
  }

  if (left.length < 2 || right.length < 2) {
    return 0;
  }

  const leftPairs = new Map();
  let overlap = 0;

  for (let index = 0; index < left.length - 1; index += 1) {
    const pair = left.slice(index, index + 2);
    leftPairs.set(pair, (leftPairs.get(pair) ?? 0) + 1);
  }

  for (let index = 0; index < right.length - 1; index += 1) {
    const pair = right.slice(index, index + 2);
    const count = leftPairs.get(pair) ?? 0;
    if (count > 0) {
      leftPairs.set(pair, count - 1);
      overlap += 1;
    }
  }

  return (2 * overlap) / ((left.length - 1) + (right.length - 1));
}

function overlapScore(inputTokens, candidateTokens) {
  if (inputTokens.length === 0 || candidateTokens.length === 0) {
    return 0;
  }

  const candidateSet = new Set(candidateTokens);
  let hits = 0;

  for (const token of inputTokens) {
    if (candidateSet.has(token)) {
      hits += 1;
    }
  }

  return hits / Math.max(inputTokens.length, candidateTokens.length);
}

function scoreReference(input, reference) {
  const normalizedInput = normalize(input);
  const normalizedReference = normalize(reference);
  const inputTokens = tokenize(normalizedInput);
  const referenceTokens = tokenize(normalizedReference);

  let score = 0;

  if (!normalizedInput || !normalizedReference) {
    return 0;
  }

  if (normalizedInput === normalizedReference) {
    score += 1;
  }

  if (normalizedReference.includes(normalizedInput)) {
    score += 0.45;
  }

  if (normalizedInput.includes(normalizedReference)) {
    score += 0.35;
  }

  score += overlapScore(inputTokens, referenceTokens) * 0.4;
  score += diceCoefficient(normalizedInput, normalizedReference) * 0.25;

  return score;
}

function scoreTrack(input, track) {
  const bestReference = track.reference.reduce(
    (best, reference) => {
      const score = scoreReference(input, reference);
      return score > best.score ? { score, reference } : best;
    },
    { score: 0, reference: track.reference[0] ?? "" }
  );

  return {
    ...track,
    score: bestReference.score,
    matchedReference: bestReference.reference,
  };
}

export function matchTrack(input, tracks) {
  const scoredTracks = tracks.map((track) => scoreTrack(input, track));
  scoredTracks.sort((left, right) => right.score - left.score);
  return scoredTracks[0] ?? null;
}

export function buildSpotifyEmbedUrl(trackId) {
  return `https://open.spotify.com/embed/track/${trackId}?utm_source=generator&theme=0`;
}
