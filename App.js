import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [userInput, setUserInput] = useState("");
  const [generatedImage, setGeneratedImage] = useState(null);
  const [images, setImages] = useState([]);
  const [processing, setProcessing] = useState(true);

  // Fetch images when the component mounts
  useEffect(() => {
    fetchImages();
  }, []);

  const handleInputChange = (e) => setUserInput(e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/generate", {
        userInput,
      });
      setGeneratedImage(response.data.imageUrl); // Backend response for generated image
      fetchImages(); // Refresh the list of images
    } catch (error) {
      console.error("Error generating image:", error);
    }
  };

  const fetchImages = async () => {
    try {
      const response = await axios.get("http://localhost:5000/images");
      setImages(response.data); // Update state with fetched images
    } catch (error) {
      console.error("Error fetching images:", error);
    }
  };

  return (
    <div className="App">
      <img
        src={`http://localhost:5000/backend/generated_images/NEBULA_HIVE - Topic.png`} /* Replace with the URL or path of your fallback image */
        alt="Default"
        class="topic-image"
      />
      <div class="row">
        <div class="col-6">
          <h4>Prompt Area</h4>
          <form onSubmit={handleSubmit}>
            <div class="input-group input-group-lg mb-3 inputTextArea">
              <textarea
                type="text"
                class="form-control custom-textarea"
                value={userInput}
                onChange={handleInputChange}
                placeholder="Enter a description"
                aria-label="Sizing example input"
                aria-describedby="inputGroup-sizing-sm"
              />
            </div>
            <select class="form-select form-select-lg mb-3 inputSelection" aria-label="Large select example">
              <option selected>Open this select menu</option>
              <option value="1">Tea</option>
              <option value="2">Wine</option>
              <option value="3">Cheese</option>
            </select>
            <button type="submit">Generated Image</button>
          </form>
        </div>
        <div class="col-6">
          <h4>Generation Area</h4>
          <div class="image-container">
            {generatedImage ? (
              <img
                src={`http://localhost:5000${generatedImage}`}
                alt="Generated"
                class="generated-image"
              />
            ) : (
              <img
              src={`http://localhost:5000/backend/generated_images/NEBULA_HIVE.png`} /* Replace with the URL or path of your fallback image */
                alt="Default"
                class="generated-image"
              />
            )}
          </div>    
        </div>
      </div>
      <div>
        <h4>Gallery</h4>
        <div className="PreviouslyGeneratedImages">
          {images.map((image, index) => (
            <img
              key={index}
              src={`http://localhost:5000${image}`}
              alt={`Generated ${index}`}
            />
          ))}
        </div>  
      </div>
    </div>
  );
}

export default App;
