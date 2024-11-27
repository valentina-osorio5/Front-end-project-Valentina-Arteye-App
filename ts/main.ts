interface Artwork {
  id: string;
  title: string;
  artist: string;
  // place: string;
  description: string;
  imageUrl: string;
  medium: string;
  // display: any;
}

const $eyebutton = document.querySelector('.button-row') as HTMLDivElement;
const $insertRowContainer = document.querySelector(
  '.artwork-row',
) as HTMLDivElement;

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

  // const place = document.createElement('p');
  // place.textContent = displayArtwork.place;
  // div.appendChild(place);

  const description = document.createElement('p');
  description.textContent = displayArtwork.description;
  div.appendChild(description);

  const medium = document.createElement('p');
  medium.textContent = `Medium: ${displayArtwork.medium}`;
  div.appendChild(medium);

  // const display = document.createElement('p');
  // if (displayArtwork.catalogue_display === 'null') {
  //   display.textContent = 'On Display: No';
  // } else {
  //   display.textContent = `On Display: ${displayArtwork.display}`;
  // }
  // div.appendChild(display);

  console.log(outerDiv);
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
        console.log('image is null');
        fetchRandomArtwork();
        return;
      }

      console.log('Title:', artwork.title);
      console.log('Artist:', artwork.artist_display);
      console.log('Description:', artwork.description);
      console.log('Image URL:', imageUrl);
      console.log('Medium:', artwork.medium_display);
      const displayArtwork = {
        id: artwork.image_id,
        title: artwork.title,
        artist: artwork.artist_display,
        // place: artwork.place_of_origin,
        description: artwork.description,
        imageUrl,
        medium: artwork.medium_display,
        // display: artwork.catalogue_display,
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
    console.log('eye was clicked');
    $insertRowContainer.textContent = '';
    fetchRandomArtwork();
  }
}

// const artworkExample = {
//   image_id: '123',
//   title: 'title1',
//   artist_display: 'artist name',
//   place_of_origin: 'place',
//   description: 'description',
//   imageUrl:
//     'https://images.unsplash.com/photo-1732613942657-61684c51eb55?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw0fHx8ZW58MHx8fHx8',
//   medium_display: 'pic',
//   catalogue_display: null,
// };

window.addEventListener('DOMContentLoaded', handleDCL);

function handleDCL(): void {
  console.log('page loaded');
  fetchRandomArtwork();
  console.log('fetchRandomArtwork called');
}
