import axios from 'axios';
import React from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
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

      const reversedImages = (res.data || []).reverse(); // Reverse the order of the images to display the most recent first
      setImages(reversedImages);
      setLoading(false); // Set loading to false once the images are retrieved
      toast.success('saved images downloaded');
    } catch (err) {
      console.log(err);
      toast.error(err.message);
    }
  };

  useEffect(() => {
    getSavedImages();
  }, []);

  //search for new image from unsplash
  const handleSearchSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.get(`${API_URL}/new-image?query=${word}`);

      setImages([{ ...res.data, title: word }, ...images]);
      toast.info(`New image ${word.toUpperCase()} was found!`);
    } catch (err) {
      console.log(err);
      toast.error(err.message);
    }

    setWord('');
  };

  //remove unsaved images from view
  const handleRemoveImage = (id) => {
    const removedImage = images.find((image) => image.id === id);
    setImages(images.filter((image) => image.id !== id));
    toast.info(`Image ${removedImage.title?.toUpperCase()} was removed!`);
  };

  //delete saved image
  const handleDeleteImage = async (id) => {
    try {
      // Send delete request to the API
      const res = await axios.delete(`${API_URL}/images/${id}`);
      if (res.data?.deleted_id) {
        toast.warning(
          `Image ${images.find((i) => i.id === id).title.toUpperCase()} was deleted!`
        );
        setImages(images.filter((image) => image.id !== id));
      }
    } catch (err) {
      console.log(err);
      toast.error(err.message);
    }
  };

  // save image to database
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
        toast.info(`Image ${imageToBeSaved.title.toUpperCase()} was saved!`);
      }
    } catch (err) {
      console.log(err);
      toast.error(err.message);
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
                      removeImage={handleRemoveImage}
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
      <ToastContainer position="bottom-right" />
    </div>
  );
};

export default App;
