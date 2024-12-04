interface Artwork {
  id: string;
  title: string;
  artist: string;
  description: string;
  imageUrl: string;
  medium: string;
}
let displayArtwork: Artwork;

const $eyebutton = document.querySelector('.button-row') as HTMLDivElement;
const $insertRowContainer = document.querySelector(
  '.artwork-row',
) as HTMLDivElement;
const $holdsNoSaved = document.querySelector('.holds-no-saved');
const $arteyeButton = document.querySelector('.btn');
const $uList = document?.querySelector('ul');
const $saveButton = document.querySelector('.saved-btn');
const $dialog = document.querySelector('.dialog') as HTMLDialogElement;
const $cancelDelete = document.querySelector('.cancel-delete');
const $deleteSaved = document.querySelector('.confirm-delete');

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

  const artistName = document.createElement('h3');
  artistName.textContent = displayArtwork.artist;
  div.appendChild(artistName);

  const description = document.createElement('p');
  description.innerHTML = displayArtwork.description;
  div.appendChild(description);

  const medium = document.createElement('p');
  medium.textContent = `Medium: ${displayArtwork.medium}`;
  div.appendChild(medium);

  const heart = document.createElement('i');
  heart.className = 'fa-regular fa-heart';
  div.appendChild(heart);

  return outerDiv;
}

async function fetchRandomArtwork(): Promise<any> {
  const apiUrl = `https://api.artic.edu/api/v1/artworks?page=2&limit=100`;

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

      if (!imageUrl) {
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
    $insertRowContainer.textContent = '';
    fetchRandomArtwork();
  }
}

window.addEventListener('DOMContentLoaded', handleDCL);

function handleDCL(): void {
  if (data.currentView === 'home') {
    fetchRandomArtwork();
  }
}

$insertRowContainer?.addEventListener('click', handleHeartClick);

let totalClicks = 0;

function handleHeartClick(event: Event): void {
  const eventTarget = event.target as HTMLElement;
  if (eventTarget?.tagName === 'I') {
    totalClicks++;
    if (totalClicks % 2 === 0) {
      $dialog?.showModal();
    } else {
      const eventTarget = event.target as HTMLElement;
      if (eventTarget.className === 'fa-regular fa-heart') {
        const $heartButton = document.querySelector('.fa-heart');
        if (!$heartButton) throw new Error('$heartButton does not exist');
        $heartButton.className = 'fa-solid fa-heart';
        // create Object with the properties we need
        const artwork = {
          id: displayArtwork.id,
          title: displayArtwork.title,
          artist: displayArtwork.artist,
          description: displayArtwork.description,
          imageUrl: displayArtwork.imageUrl,
          medium: displayArtwork.medium,
        };
        data.savedArtworks.push(artwork);
        saveToLocalStorage();
        toggleNoSaved();
      }
    }
  }
}

function closeModal(event: Event): void {
  const eventTarget = event.target as HTMLButtonElement;
  if (eventTarget.className === 'cancel-delete') {
    $dialog?.close();
  }
}

$cancelDelete?.addEventListener('click', closeModal);

$deleteSaved?.addEventListener('click', confirmDelete);

function confirmDelete(event: Event): void {
  const eventTarget = event.target as HTMLButtonElement;
  if (eventTarget.className === 'confirm-delete') {
    const artId = displayArtwork.id;
    for (let i = 0; i < data.savedArtworks.length; i++) {
      if (artId === data.savedArtworks[i].id) {
        const $deleteElement = document.querySelector('.parent');
        $deleteElement?.remove();
        data.savedArtworks.splice(i, 1);
        saveToLocalStorage();
      }
    }
    // toggleNoSaved();
    // const viewName = data.currentView;
    // viewSwap(viewName);
    $dialog?.close();
  }
}

$uList?.addEventListener('click', confirmSavedDelete);

function confirmSavedDelete(event: Event): void {
  const eventTarget = event.target as HTMLElement;
  const $li = eventTarget.closest('li');
  const $title = $li?.querySelector('h2');
  if (eventTarget?.tagName === 'I') {
    const tempModal = confirm(
      'Are you sure you want to delete from favorites?',
    );
    if (!tempModal) {
      return;
    }
    $li?.remove();
    const localStorageArtwork = getFromLocalStorage();
    for (let i = 0; i < localStorageArtwork?.savedArtworks.length; i++) {
      const $titleText = $title?.textContent;
      if (localStorageArtwork?.savedArtworks[i].title === $titleText) {
        data.savedArtworks.splice(i, 1);
        saveToLocalStorage();
      }
    }
  }
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
  const thankYou = document.getElementById('thank-you');
  //   // Hide or show the appropriate view based on viewName
  if (viewName === 'home') {
    homeView?.classList.remove('hidden');
    savedView?.classList.add('hidden');
    thankYou?.classList.add('hidden');
  } else if (viewName === 'saved') {
    savedView?.classList.remove('hidden');
    thankYou?.classList.remove('hidden');
    homeView?.classList.add('hidden');
  }

  // Update the view in the data model
  data.currentView = viewName;
  toggleNoSaved();
}

function toggleNoSaved(): void {
  const localStorageArtwork = getFromLocalStorage();
  if (localStorageArtwork.savedArtworks.length === 0) {
    $holdsNoSaved?.classList.remove('hidden');
  } else {
    $holdsNoSaved?.classList.add('hidden');
  }
}

function handleHomeClick(): void {
  viewSwap('home');
  closeNav();
}

$arteyeButton?.addEventListener('click', handleHomeClick);

function renderSavedArtworks(): void {
  const localStorageArtwork = getFromLocalStorage();
  for (let i = 0; i < localStorageArtwork.savedArtworks.length; i++) {
    const listItem = document.createElement('li');
    listItem.className = 'list-item';

    const title = document.createElement('h2');
    title.textContent = localStorageArtwork.savedArtworks[i].title;
    listItem.appendChild(title);

    const artistName = document.createElement('h3');
    artistName.textContent = localStorageArtwork.savedArtworks[i].artist;
    listItem.appendChild(artistName);

    const heart = document.createElement('i');
    heart.className = 'fa-solid fa-heart';
    listItem.appendChild(heart);

    const image = document.createElement('img');
    image.setAttribute('src', localStorageArtwork.savedArtworks[i].imageUrl);
    image.setAttribute('alt', localStorageArtwork.savedArtworks[i].title);
    listItem.appendChild(image);

    $uList?.prepend(listItem);
    toggleNoSaved();
  }
}

document.addEventListener('DOMContentLoaded', renderSavedArtworks);

$saveButton?.addEventListener('click', handleSavedView);

function handleSavedView(): void {
  viewSwap('saved');
  renderViewSwapSavedArtworks();
  toggleNoSaved();
}

function renderViewSwapSavedArtworks(): void {
  $uList.textContent = '';
  const localStorageArtwork = getFromLocalStorage();
  for (let i = 0; i < localStorageArtwork.savedArtworks.length; i++) {
    const listItem = document.createElement('li');
    listItem.className = 'list-item';

    const title = document.createElement('h2');
    title.textContent = localStorageArtwork.savedArtworks[i].title;
    listItem.appendChild(title);

    const artistName = document.createElement('h3');
    artistName.textContent = localStorageArtwork.savedArtworks[i].artist;
    listItem.appendChild(artistName);

    const heart = document.createElement('i');
    heart.className = 'fa-solid fa-heart';
    listItem.appendChild(heart);

    const image = document.createElement('img');
    image.setAttribute('src', localStorageArtwork.savedArtworks[i].imageUrl);
    image.setAttribute('alt', localStorageArtwork.savedArtworks[i].title);
    listItem.appendChild(image);

    $uList?.prepend(listItem);
    toggleNoSaved();
  }
}
