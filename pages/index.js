import { useState } from 'react';

export default function Home() {
  const [image, setImage] = useState(null);
  const [caricatureUrl, setCaricatureUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) return;

    setLoading(true);
    const formData = new FormData();
    formData.append('image', image);

    const res = await fetch('/api/caricature', {
      method: 'POST',
      body: formData,
    });

    const data = await res.json();
    setCaricatureUrl(data.caricatureUrl);
    setLoading(false);
  };

  return (
    <div>
      <h1>AI Caricature Generator</h1>
      <form onSubmit={handleSubmit}>
        <input type="file" accept="image/*" onChange={handleImageChange} required />
        <button type="submit">Generate Caricature</button>
      </form>
      {loading && <p>Generating...</p>}
      {caricatureUrl && (
        <div>
          <h2>Your Caricature:</h2>
          <img src={caricatureUrl} alt="Caricature" />
          <a href={caricatureUrl} download="caricature.jpg">Download</a>
        </div>
      )}
    </div>
  );
}