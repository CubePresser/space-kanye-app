const onRegenerate = () => {
  const generateButton = document.getElementById("generate");
  setTimeout(() => {
    generateButton.disabled = false;
  }, 2500);
  generateButton.disabled = true;

  setContentVisibility(false);
  renderContent();
};

const getContent = async () => {
  // AWS API Gateway
  // TODO: This is fine for now, without traffic. Need to add more security/access rights here
  // so only this website can access the AWS endpoint
  return fetch('https://9l313n0znl.execute-api.us-west-2.amazonaws.com/default/space-kanye__content')
    .then(response => response.json())
    .catch((err) => {
      console.error(`Failed to fetch content from AWS: ${err}`);
      return null;
    });
}

const getKanyeElement = () => {
  return document.getElementById("kanye-quote");
}

const renderKanyeQuote = async (kanyeQuote) => {
  // const kanyeQuote = await getKanyeQuote();
  const kanyeElement = getKanyeElement();

  // Set quote
  kanyeElement.innerHTML = kanyeQuote;
};

const getApodImageElement = () => {
  return document.getElementById("apod");
}

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
  const content = await getContent();

  if (content) {
    const { image: { url: apodSrc }, quote: kanyeQuote } = content;
    renderApodImage(apodSrc);
    renderKanyeQuote(kanyeQuote);
  }
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
