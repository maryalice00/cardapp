let deckId = null;
let remainingCards = 0;
let shuffleInProgress = false;
let drawingInterval = null;
let isDrawing = false;

async function createDeck() {
  const response = await fetch('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1');
  const data = await response.json();
  deckId = data.deck_id;
  remainingCards = data.remaining;
}

async function drawCard() {
  if (remainingCards === 0) {
    alert("Error: no cards remaining!");
    stopDrawing();
    return;
  }

  const response = await fetch(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=1`);
  const data = await response.json();
  
  if (data.success) {
    const card = data.cards[0];
    remainingCards = data.remaining;

    const cardContainer = document.getElementById('cardContainer');
    cardContainer.innerHTML = `<img src="${card.image}" alt="${card.value} of ${card.suit}">`;
  } else {
    console.error('Failed to draw a card');
  }
}

async function shuffleDeck() {
  if (shuffleInProgress) {
    return;
  }

  shuffleInProgress = true;
  const cardContainer = document.getElementById('cardContainer');
  cardContainer.innerHTML = ''; // Remove all cards from the screen

  try {
    const response = await fetch(`https://deckofcardsapi.com/api/deck/${deckId}/shuffle/`);
    const data = await response.json();

    if (data.success) {
      alert("Deck shuffled successfully!");
      remainingCards = data.remaining;
    } else {
      console.error('Failed to shuffle the deck');
    }
  } catch (error) {
    console.error('Error during shuffle:', error);
  } finally {
    shuffleInProgress = false;
  }
}

function startDrawing() {
  isDrawing = true;
  document.getElementById('drawButton').innerText = 'Stop Drawing';
  drawingInterval = setInterval(drawCard, 1000);
}

function stopDrawing() {
  isDrawing = false;
  document.getElementById('drawButton').innerText = 'Start Drawing';
  clearInterval(drawingInterval);
}

function toggleDrawing() {
  if (isDrawing) {
    stopDrawing();
  } else {
    startDrawing();
  }
}

window.onload = async function() {
  await createDeck();
  const shuffleButton = document.getElementById('shuffleButton');
  
  shuffleButton.addEventListener('click', shuffleDeck);
};
