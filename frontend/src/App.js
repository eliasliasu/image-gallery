import axios from 'axios';
import React from 'react';
import { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Header, Search, ImageCard, Welcome, Spinner } from './components'; //this utilizes the index.js in the components folder
import { Container, Row, Col } from 'react-bootstrap';

// const UNSPLASH_KEY = process.env.REACT_APP_UNSPLASH_KEY;
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5050';

const App = () => {
  const [word, setWord] = useState('');
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true); // New state for loading

  const getSavedImages = async () => {
    try {
      const res = await axios.get(`${API_URL}/images`);
      setImages(res.data || []);
      setLoading(false); // Set loading to false once the images are retrieved
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getSavedImages();
  }, []);

  const handleSearchSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.get(`${API_URL}/new-image?query=${word}`);

      setImages([{ ...res.data, title: word }, ...images]);
    } catch (err) {
      console.log(err);
    }

    setWord('');
  };

  const handleDeleteImage = async (id) => {
    try {
      // Send delete request to the API
      const res = await axios.delete(`${API_URL}/images/${id}`);
      if (res.data?.deleted_id) {
        setImages(images.filter((image) => image.id !== id));
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleSaveImage = async (id) => {
    const imageToBeSaved = images.find((image) => image.id === id);
    imageToBeSaved.saved = true;

    try {
      const res = await axios.post(`${API_URL}/images`, imageToBeSaved);
      if (res.data?.inserted_id) {
        setImages(
          images.map((image) =>
            imageToBeSaved.id === id ? { ...image, saved: true } : image
          )
        );
      }
    } catch (err) {
      console.log(err);
    }
  };

  // conditionally load spinner

  return (
    <div className="App">
      <Header title="Images Gallery" />
      {loading ? (
        <Spinner />
      ) : (
        <>
          <Search
            word={word}
            setWord={setWord}
            handleSubmit={handleSearchSubmit}
          />
          <Container className="mt-4">
            {images.length ? (
              <Row xs={1} md={2} lg={3}>
                {images.map((images, i) => (
                  <Col key={i} className="pb-3">
                    <ImageCard
                      images={images}
                      deleteImage={handleDeleteImage}
                      saveImage={handleSaveImage}
                    />
                  </Col>
                ))}
              </Row>
            ) : (
              <Welcome />
            )}
          </Container>
        </>
      )}
    </div>
  );
};

export default App;
