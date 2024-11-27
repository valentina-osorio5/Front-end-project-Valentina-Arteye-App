/* exported data */

const key = 'savedArtworks';

const data = {
  savedArtworks: [] as {
    id: string;
    title: string;
    artist: string;
    description: string;
    imageUrl: string;
    medium: string;
  }[],
  currentView: 'home',
};
