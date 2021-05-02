import { randomDate, defaultImage } from "./util.js";

const onRegenerate = () => {
  const generateButton = document.getElementById("generate");
  setTimeout(() => {
    generateButton.disabled = false;
  }, 2500);
  generateButton.disabled = true;

  setContentVisibility(false);
  renderContent();
};

const getKanyeElement = () => {
  return document.getElementById("kanye-quote");
}

const getKanyeQuote = () => {
  return fetch("https://api.kanye.rest")
    .then((response) => response.json())
    .then(({ quote }) => quote)
    .catch((err) => console.error(`Failed to fetch kanye quote: ${err}`));
};

const renderKanyeQuote = async (kanyeQuote) => {
  // const kanyeQuote = await getKanyeQuote();
  const kanyeElement = getKanyeElement();

  // Set quote
  kanyeElement.innerHTML = kanyeQuote;
};

const getApodImageElement = () => {
  return document.getElementById("apod");
}

const getApodImageSrc = (retryCount = 0) => {
  if (retryCount >= 3) {
    console.error("Too many retries.");
    return defaultImage;
  }

  const date = randomDate(new Date(2015, 1, 1), new Date());
  const photoDate = new Date(
    date.getTime() - date.getTimezoneOffset() * 60 * 1000
  )
    .toISOString()
    .split("T")[0];

  return fetch(
    `https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY&date=${photoDate}`
  )
    .then((response) => response.json())
    .then(({ url }) => {
      const isValid = !url.startsWith('https://www.youtube') && !url.startsWith('https://player.vimeo');
      if (isValid) {
        return url;
      } else {
        return getApodImageSrc(retryCount + 1);
      }
    })
    .catch((err) => console.error(`Failed to fetch apod image: ${err}`));
};

const renderApodImage = async (apodSrc) => {
  // const apodSrc = await getApodImageSrc();
  const apodElement = getApodImageElement();

  // Set image
  apodElement.src = apodSrc;
};

const setContentVisibility = (visible) => {
  const invisibleClass = "invisible";
  const [ contentElement ] = document.getElementsByClassName("content-container");

  if (visible) {
    contentElement.classList.remove(invisibleClass);
  } else {
    contentElement.classList.add(invisibleClass);
  }
}

const setMaxWidthOfQuote = (sourceElement) => {
  const quote = document.getElementById('kanye-quote');
  const width = Math.min(sourceElement.width - 40, window.innerWidth * .6);
  quote.style.flexBasis = `${width}px`;
}

const setCallbacks = () => {
  const generateButton = document.getElementById("generate");
  generateButton.onclick = onRegenerate;

  const apodElement = document.getElementById("apod");
  apodElement.onload = () => {
    setContentVisibility(true);
    setMaxWidthOfQuote(apodElement);
  };
};

const findScreenRatio = () => {
  const [contentElement] = document.getElementsByClassName("content-container");
  contentElement.classList.add(window.innerHeight >= window.innerWidth ? "portrait" : "landscape");
}

const renderContent = async () => {
  const [ kanyeQuote, apodSrc ] = await Promise.all([
    getKanyeQuote(), getApodImageSrc()
  ]);

  renderApodImage(apodSrc);
  renderKanyeQuote(kanyeQuote);
}

// Add new elements
const render = () => {
  renderContent();
  findScreenRatio();
};

const main = () => {
  setCallbacks();
  render();
};
main();
