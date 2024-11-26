// interface Artwork{
//    id: string;
//   //   title: string;
//   //   artist: string;
//   //   place: string;
//   //   description: string;
//   //   imageUrl: string;
//   //   medium: string;
//   //   display: any;
// }

const $eyebutton = document.querySelector('.button-row') as HTMLDivElement;
const

// fetchRandomArtwork();


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

      console.log('Title:', artwork.title);
      console.log('Artist:', artwork.artist_display);
      console.log('Place of Origin:', artwork.place_of_origin);
      console.log('Description:', artwork.description);
      console.log('Image URL:', imageUrl);
      console.log('Medium:', artwork.medium_display);
      console.log('On Display?', artwork.catalogue_display);
      return {
        id: artwork.image_id,
        title: artwork.title,
        artist: artwork.artist_display,
        place: artwork.place_of_origin,
        description: artwork.description,
        imageUrl: imageUrl,
        medium: artwork.medium_display,
        display: artwork.catalogue_display,
      };
    } else {
      console.log('No artworks available.');
    }
  } catch (error: any) {
    console.error('Error fetching artwork data:', error.message);
  }
}

$eyebutton?.addEventListener('click', handleEyeClick);

function handleEyeClick(event: Event): any {
  console.log('hi');
  const eventTarget = event.target as SVGElement;
  console.log('eventTarget:', eventTarget.tagName);
  if (eventTarget === null) throw new Error();
  if (eventTarget.tagName === 'svg') {
    console.log('eye was clicked');
    fetchRandomArtwork();
  }
}

// function renderArtwork(artworks){
//   const div = document.createElement('div');
//   div.className = 'one-fourth';

//   const title = document.createElement('h2');
//   title.textContent = artwork.title;
//   div.appendChild(title);

//   const artistName = document.createElement('h2');
//   artistName.textContent = artwork.artist_display;
//   div.appendChild(artistName);

//   const place = document.createElement('p');
//   place.textContent = artwork.place_of_origin;
//   div.appendChild(place);

//   const description = document.createElement('p');
//   description.textContent = artwork.description;
//   div.appendChild(description);

//   const medium = document.createElement('p');
//   medium.textContent= artwork.medium_display
//   div.appendChild(medium);


//   const display = document.createElement('p');
//   if (artwork.catalogue_display === null){
//   display.textContent = 'No';
//   } else {
//     display.textContent = artwork.catalogue_display
//   }
//   div.appendChild(display);


//   const imageDiv = document.createElement('div');
//   imageDiv.className = 'three-fourths';

//   const image = document.createElement('img');
//   image.setAttribute('src', imageUrl);
//   imageDiv.appendChild(image);

//   div.append(imageDiv);

//   return div;
// }

// window.addEventListener('DOMContentLoaded', handleDCL);

// function handleDCL(){
//   console.log('page loaded');
//   fetchRandomArtwork();
//   console.log('fetchRandomArtwork called');
// }
