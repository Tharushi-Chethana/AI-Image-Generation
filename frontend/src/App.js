// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import "./App.css";
// import "bootstrap/dist/css/bootstrap.min.css";

// function App() {
//   const [userInput, setUserInput] = useState("");
//   const [generatedImage, setGeneratedImage] = useState(null);
//   // const [expandedText, setExpandedText] = useState(""); // New state for expanded text
//   const [images, setImages] = useState([]);
//   const [selectedImage, setSelectedImage] = useState(null);
//   const [isGenerating, setIsGenerating] = useState(false); // New state for blinking effect
//   const [progress, setProgress] = useState(0);

//   useEffect(() => {
//     fetchImages();
//   }, []);

//   const handleInputChange = (e) => setUserInput(e.target.value);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsGenerating(true);
//     setProgress(0);
  
//     try {
//       // Start image generation and get task ID
//       const { data: task } = await axios.post("http://localhost:5000/start-generation", {
//         userInput,
//       });
  
//       // Poll the backend for progress updates
//       const pollInterval = 500; // Poll every 500ms
//       const interval = setInterval(async () => {
//         try {
//           const { data: progressData } = await axios.get(
//             `http://localhost:5000/progress/${task.taskId}`
//           );
  
//           setProgress(progressData.progress);
  
//           if (progressData.progress >= 100) {
//             clearInterval(interval);
//             setGeneratedImage(progressData.imageUrl);
//             fetchImages(); // Refresh gallery
//             setIsGenerating(false);
//           }
//         } catch (error) {
//           console.error("Error fetching progress:", error);
//           clearInterval(interval);
//           setProgress(0);
//           setIsGenerating(false);
//         }
//       }, pollInterval);
//     } catch (error) {
//       console.error("Error starting image generation:", error);
//       setIsGenerating(false);
//     }
//   };

//   const fetchImages = async () => {
//     try {
//       const response = await axios.get("http://localhost:5000/images");
//       setImages(response.data); // Update state with fetched images
//     } catch (error) {
//       console.error("Error fetching images:", error);
//     }
//   };

//   const handleImageClick = (image) => {
//     setSelectedImage(image); // Set the selected image for the modal
//   };

//   const handleCloseModal = () => setSelectedImage(null);

//   return (
//     <div className="App">
//       <img
//         src={`http://localhost:5000/backend/generated_images/NEBULA_HIVE_Topic.png`}
//         alt="Default"
//         className="topic-image"
//       />
//       <div className="row">
//         <div className="col-6">
//           <h4>Prompt Area</h4>
//           <form onSubmit={handleSubmit}>
//             <div className="input-group input-group-lg mb-3 inputTextArea">
//               <textarea
//                 type="text"
//                 className="form-control custom-textarea"
//                 value={userInput}
//                 onChange={handleInputChange}
//                 placeholder="Enter a description"
//                 aria-label="Sizing example input"
//                 aria-describedby="inputGroup-sizing-sm"
//               />
//             </div>
//             <select
//               className="form-select form-select-lg mb-3 inputSelection"
//               aria-label="Large select example"
//             >
//               <option selected>Open this select menu</option>
//               <option value="1">Tea Box</option>
//               <option value="2">Wine Box</option>
//               <option value="3">Cheese Box</option>
//             </select>
//             <button type="submit">Generate Image</button>
//           </form>
//         </div>
//         <div className="col-6">
//           <h4>Generation Area</h4>
//           <div className="image-container">
//             {generatedImage ? (
//               <img
//                 src={`http://localhost:5000${generatedImage}`}
//                 alt="Generated"
//                 className="generated-image"
//               />
//             ) : (
//               <img
//                 src={`http://localhost:5000/backend/generated_images/NEBULA_HIVE_Default_Image.png`}
//                 alt="Default"
//                 className={`generated-image ${isGenerating ? "blinking" : ""}`}
//               />
//             )}
//           </div>
//           <div className="progress-container">
//             {isGenerating && (
//               <div className="progress-bar-wrapper">
//                 <div
//                   className="progress-bar"
//                   style={{ width: `${progress}%`, backgroundColor: 'black' }}
//                 >
//                   {progress}%
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* <div className="expanded-text-container">
//             <h5>Expanded Text</h5>
//             <p>{expandedText}</p>
//           </div> */}
//         </div>
//       </div>
//       <div>
//         <h4 className="gallery">Gallery</h4>
//         <div className="PreviouslyGeneratedImages">
//           {images.map((image, index) => (
//             <img
//               key={index}
//               src={`http://localhost:5000${image}`}
//               alt={`Generated ${index}`}
//               onClick={() => handleImageClick(image)}
//             />
//           ))}
//         </div>
//       </div>

//       {/* Modal Component */}
//       {selectedImage && (
//         <div
//           className="modal fade show d-block"
//           tabIndex="-1"
//           role="dialog"
//           aria-labelledby="exampleModalLabel"
//           aria-hidden="true"
//         >
//           <div className="modal-dialog modal-lg" role="document">
//             <div className="modal-content">
//               <div className="modal-header">
//                 <h5 className="modal-title" id="exampleModalLabel">
//                   Image Viewer
//                 </h5>
//                 <button
//                   type="button"
//                   className="btn-close"
//                   onClick={handleCloseModal}
//                   aria-label="Close"
//                 ></button>
//               </div>
//               <div className="modal-body">
//                 <img
//                   src={`http://localhost:5000${selectedImage}`}
//                   alt="Selected"
//                   className="img-fluid"
//                 />
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default App;


function App() {
  const [userInput, setUserInput] = useState("");
  const [generatedImage, setGeneratedImage] = useState(null);
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsGenerating(true);
    setProgress(0);

    try {
      const { data: task } = await axios.post("http://localhost:5000/start-generation", { userInput });
      const interval = setInterval(async () => {
        const { data: progressData } = await axios.get(`http://localhost:5000/progress/${task.taskId}`);
        setProgress(progressData.progress);

        if (progressData.progress >= 100) {
          clearInterval(interval);
          setGeneratedImage(progressData.imageUrl);
          fetchImages();
          setIsGenerating(false);
        }
      }, 500);
    } catch (error) {
      console.error("Error starting image generation:", error);
      setIsGenerating(false);
    }
  };

  const fetchImages = async () => {
    try {
      const response = await axios.get("http://localhost:5000/images");
      setImages(response.data);
    } catch (error) {
      console.error("Error fetching images:", error);
    }
  };

  const handleImageClick = (image) => setSelectedImage(image);
  const handleCloseModal = () => setSelectedImage(null);

  return (
    <div className="App">
      <PromptInput userInput={userInput} setUserInput={setUserInput} handleSubmit={handleSubmit} />
      <GeneratedImageDisplay generatedImage={generatedImage} isGenerating={isGenerating} progress={progress} />
      <ImageGallery images={images} handleImageClick={handleImageClick} />
      <ImageModal selectedImage={selectedImage} handleCloseModal={handleCloseModal} />
    </div>
  );
}
