interface Artwork {
  id: string;
  title: string;
  artist: string;
  description: string;
  imageUrl: string;
  medium: string;
}
let displayArtwork;

const $eyebutton = document.querySelector('.button-row') as HTMLDivElement;
const $insertRowContainer = document.querySelector(
  '.artwork-row',
) as HTMLDivElement;
const $heartButton = document.querySelector('.fa-heart');
const $holdsNoSaved = document.querySelector('.holds-no-saved');
const $arteyeButton = document.querySelector('.btn');

function renderArtwork(displayArtwork: any): any {
  const outerDiv = document.createElement('div');
  outerDiv.className = 'parent';

  const imageContainerDiv = document.createElement('div');
  imageContainerDiv.className = 'three-fourths';

  const imageDiv = document.createElement('div');
  imageDiv.className = 'image-div';
  imageContainerDiv.appendChild(imageDiv);
  outerDiv.append(imageContainerDiv);

  const image = document.createElement('img');
  image.setAttribute('src', displayArtwork.imageUrl);
  image.setAttribute('alt', displayArtwork.title);
  imageDiv.appendChild(image);

  const div = document.createElement('div');
  div.className = 'one-fourth';
  outerDiv.append(div);

  const title = document.createElement('h2');
  title.textContent = displayArtwork.title;
  div.appendChild(title);

  const artistName = document.createElement('h2');
  artistName.textContent = displayArtwork.artist;
  div.appendChild(artistName);

  const description = document.createElement('p');
  description.textContent = displayArtwork.description;
  div.appendChild(description);

  const medium = document.createElement('p');
  medium.textContent = `Medium: ${displayArtwork.medium}`;
  div.appendChild(medium);

  return outerDiv;
}

async function fetchRandomArtwork(): Promise<any> {
  // {
  //   id: string;
  //   title: string;
  //   artist: string;
  //   place: string;
  //   description: string;
  //   imageUrl: string;
  //   medium: string;
  //   display: any;
  // }[]
  const apiUrl = `https://api.artic.edu/api/v1/artworks?page=1&limit=100`;

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response?.json();
    const artworks = data.data;

    if (artworks.length > 0) {
      // Generate a random index
      const randomIndex = Math.floor(Math.random() * artworks.length);
      const artwork = artworks[randomIndex];
      const imageUrl = `https://www.artic.edu/iiif/2/${artwork.image_id}/full/843,/0/default.jpg`;
      if (!artwork.image_id) {
        fetchRandomArtwork();
        return;
      }

      displayArtwork = {
        id: artwork.image_id,
        title: artwork.title,
        artist: artwork.artist_display,
        description: artwork.description,
        imageUrl,
        medium: artwork.medium_display,
      };
      const outerDiv = renderArtwork(displayArtwork);
      $insertRowContainer.append(outerDiv);
      return displayArtwork;
    }
  } catch (error: any) {
    console.error('Error fetching artwork data:', error.message);
  }
}

$eyebutton?.addEventListener('click', handleEyeClick);

function handleEyeClick(event: Event): any {
  const eventTarget = event.target as SVGElement;
  if (eventTarget === null) throw new Error();
  if (eventTarget.tagName === 'svg') {
    $heartButton.className = 'fa-regular fa-heart'
    $insertRowContainer.textContent = '';
    fetchRandomArtwork();
  }
}

window.addEventListener('DOMContentLoaded', handleDCL);

function handleDCL(): void {
  fetchRandomArtwork();
  $heartButton.className = 'fa-regular fa-heart'
}

$heartButton?.addEventListener('click', handleHeartClick);

function handleHeartClick(): void {
  console.log('heart button clicked');
  // console.log(displayArtwork);
  $heartButton.className = 'fa-solid fa-heart';
  // create Object with the properties we need
  // const artwork = {
  //   id: displayArtwork.id,
  //   title: displayArtwork.title,
  //   artist: displayArtwork.artist,
  //   description: displayArtwork.description,
  //   imageUrl: displayArtwork.imageUrl,
  //   medium: displayArtwork.medium,
  // };
  data.savedArtworks.push(displayArtwork);
  saveToLocalStorage();
}

function openNav() {
  document.getElementById('mySidenav').style.width = '250px';
}

function closeNav() {
  document.getElementById('mySidenav').style.width = '0';
}

function viewSwap(viewName: 'home' | 'saved'): void {
  const homeView = document.getElementById('home-view');
  const savedView = document.getElementById('saved');
  //   // Hide or show the appropriate view based on viewName
  if (viewName === 'home') {
    homeView?.classList.remove('hidden');
    savedView?.classList.add('hidden');
  } else if (viewName === 'saved') {
    savedView?.classList.remove('hidden');
    homeView?.classList.add('hidden');
  }

  // Update the view in the data model
  data.currentView = viewName;
  toggleNoSaved();
}

function toggleNoSaved(): void {
  if (data.savedArtworks.length === 0) {
    $holdsNoSaved?.classList.remove('hidden');
  } else {
    $holdsNoSaved?.classList.add('hidden');
  }
}

function handleArteyeClick(): void {
  console.log('arteye was clicked');
  viewSwap('home');
}

$arteyeButton?.addEventListener('click', handleArteyeClick);
