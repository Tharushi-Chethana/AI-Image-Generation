function ImageGallery({ images, handleImageClick }) {
    return (
      <div>
        <h4>Gallery</h4>
        <div>
          {images.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`Generated ${index}`}
              onClick={() => handleImageClick(image)}
            />
          ))}
        </div>
      </div>
    );
  }
  