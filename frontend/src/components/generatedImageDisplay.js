function GeneratedImageDisplay({ generatedImage, isGenerating, progress }) {
    return (
      <div>
        <h4>Generation Area</h4>
        <div>
          {generatedImage ? (
            <img src={generatedImage} alt="Generated" />
          ) : (
            <img
              src={`http://localhost:5000/backend/generated_images/NEBULA_HIVE_Default_Image.png`}
              alt="Default"
              className={`generated-image ${isGenerating ? "blinking" : ""}`}
            />
          )}
        </div>
        {isGenerating && (
          <div>
            <div style={{ width: `${progress}%`, backgroundColor: 'black' }}>
              {progress}%
            </div>
          </div>
        )}
      </div>
    );
  }
  