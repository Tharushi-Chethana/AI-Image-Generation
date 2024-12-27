import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
   const [activeTab, setActiveTab] = useState(1); // State for the active tab
  const [userInput, setUserInput] = useState("");
  const [generatedImage, setGeneratedImage] = useState(null);
  const [expandedText, setExpandedText] = useState(""); // New state for expanded text
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  // const [selectePrompt, setSelectedPrompt] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false); // New state for blinking effect
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    fetchImages();
  }, []);

  const handleInputChange = (e) => setUserInput(e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsGenerating(true);
    setProgress(0);
  
    try {
      // Start image generation and get task ID
      const {data: task} = await axios.post("http://localhost:5000/start-generation", {
        userInput
      });

  
      // Poll the backend for progress updates
      const pollInterval = 500; // Poll every 500ms
      const interval = setInterval(async () => {
        try {
          const { data: progressData } = await axios.get(
            `http://localhost:5000/progress/${task.taskId}`
          );
  
          setProgress(progressData.progress);
  
          if (progressData.progress >= 100) {
            clearInterval(interval);
            setGeneratedImage(progressData.imageUrl);
            setExpandedText(progressData.expandedText);
            fetchImages(); // Refresh gallery
            setIsGenerating(false);
          }
        } catch (error) {
          console.error("Error fetching progress:", error);
          clearInterval(interval);
          setProgress(0);
          setIsGenerating(false);
        }
      }, pollInterval);
    } catch (error) {
      console.error("Error starting image generation:", error);
      setIsGenerating(false);
    }
  };

  const fetchImages = async () => {
    try {
      const response = await axios.get("http://localhost:5000/images");
      setImages(
        response.data.map((item) => ({
          imagePath: item.imagePath,
          prompt: item.prompt,
          expandedText: item.expandedText
        }))
      ); // Store both image path and prompt
    } catch (error) {
      console.error("Error fetching images:", error);
    }
  };
  

  const handleImageClick = (image, prompt) => {
    console.log(image)
    setSelectedImage(image); // Set the selected image
  };
  

  const handleCloseModal = () => setSelectedImage(null);

  return (
    <div className="App">
      <img
        src={`http://localhost:5000/backend/generated_images/NEBULA_HIVE_Topic.png`}
        alt="Default"
        className="topic-image"
      />
      <ul className="nav nav-tabs">
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 1 ? "active" : ""}`}
            onClick={() => setActiveTab(1)}
            style={{
              color: activeTab === 1 ? "black" : "white",
            }}
          >
          {/* <span style={{ color: "white" }}>Image Generation</span> */}
          Image Generation
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 2 ? "active" : ""}`}
            onClick={() => setActiveTab(2)}
            style={{
              color: activeTab === 2 ? "black" : "white",
            }}
          >
            Upscaling
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 3 ? "active" : ""}`}
            onClick={() => setActiveTab(3)}
            style={{
              color: activeTab === 3 ? "black" : "white",
            }}
          >
            Vectorization
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 4 ? "active" : ""}`}
            onClick={() => setActiveTab(4)}
            style={{
              color: activeTab === 4 ? "black" : "white",
            }}
          >
            Generate Dieline from Image
          </button>
        </li>
      </ul>

      <div className="tab-content">
        {activeTab === 1 && (
          <div className="tab-pane active">
            {/* Content for Tab 1 */}
            <div className="row">
              <div className="col-6">
                <h4>Prompt Area</h4>
                <form onSubmit={handleSubmit}>
                  <div className="input-group input-group-lg mb-3 inputTextArea">
                    <textarea
                      type="text"
                      className="form-control custom-textarea"
                      value={userInput}
                      onChange={handleInputChange}
                      placeholder="Enter a description"
                      aria-label="Sizing example input"
                      aria-describedby="inputGroup-sizing-sm"
                    />
                  </div>
                  <select
                    className="form-select form-select-lg mb-3 inputSelection"
                    aria-label="Large select example"
                  >
                    <option selected>Open this select menu</option>
                    <option value="1">Tea Box</option>
                    <option value="2">Wine Box</option>
                    <option value="3">Cheese Box</option>
                  </select>
                  <button type="submit">Generate Image</button>
                </form>
              </div>
              <div className="col-6">
                <h4>Generation Area</h4>
                <div className="image-container">
                  {generatedImage ? (
                    <img
                      src={`http://localhost:5000${generatedImage}`}
                      alt="Generated"
                      className="generated-image"
                    />
                  ) : (
                    <img
                      src={`http://localhost:5000/backend/generated_images/NEBULA_HIVE_Default_Image.png`}
                      alt="Default"
                      className={`generated-image ${isGenerating ? "blinking" : ""}`}
                    />
                  )}
                </div>
                <div className="expandedTextr">
                  {expandedText ? (
                    <p>{expandedText}</p>
                  ) : (
                    <p>Please Wait ...</p>
                  )}
                </div>
                <div>{expandedText}</div>
                <div className="progress-container">
                  {isGenerating && (
                    <div className="progress-bar-wrapper">
                      <div
                        className="progress-bar"
                        style={{ width: `${progress}%`, backgroundColor: 'black' }}
                      >
                        {progress}%
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div>
              <h4 className="gallery">Gallery</h4>
              <div className="PreviouslyGeneratedImages">
                {images.map((image, index) => (
                  <img
                    key={index}
                    src={`http://localhost:5000${image.imagePath}`}
                    alt={`Generated ${index}`}
                    onClick={() => handleImageClick(image)}
                  />
                ))},
              </div>
            </div>

            {/* Modal Component */}
            {selectedImage && (
              <div
                className="modal fade show d-block"
                tabIndex="-1"
                role="dialog"
                aria-labelledby="exampleModalLabel"
                aria-hidden="true"
              >
                <div className="modal-dialog modal-lg" role="document">
                  <div className="modal-content">
                    <div className="modal-header justify-content-center">
                      <h5 className="modal-title" id="exampleModalLabel">
                        Image Details
                      </h5>
                      <button
                        type="button"
                        className="btn-close position-absolute end-0 top-0 mt-2 me-2"
                        onClick={handleCloseModal}
                        aria-label="Close"
                      ></button>
                    </div>
                    <div className="modal-body">
                      <ul className="list-unstyled">
                        <li className="mb-3">
                          <strong>Prompt:</strong>
                          <p className="imagePrompt">{selectedImage.prompt}</p>
                        </li>
                        <li className="mb-3">
                          <strong>Expanded Text:</strong>
                          <p className="imagePrompt">{selectedImage.expandedText}</p>
                        </li>                        
                        <li>
                          <strong>Image:</strong>
                          <img
                            src={`http://localhost:5000${selectedImage.imagePath}`}
                            alt="Selected"
                            className="img-fluid"
                          />
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        {activeTab === 2 && (
          <div className="tab-pane active">
            {/* Content for Tab 2 */}
            <h4>Tab 2 Content</h4>
            <p>Content for the second tab goes here.</p>
          </div>
        )}
        {activeTab === 3 && (
          <div className="tab-pane active">
            {/* Content for Tab 3 */}
            <h4>Tab 3 Content</h4>
            <p>Content for the third tab goes here.</p>
          </div>
        )}
        {activeTab === 4 && (
          <div className="tab-pane active">
            {/* Content for Tab 4 */}
            <h4>Tab 4 Content</h4>
            <p>Content for the fourth tab goes here.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;