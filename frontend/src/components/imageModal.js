function ImageModal({ selectedImage, handleCloseModal }) {
    if (!selectedImage) return null;
  
    return (
      <div className="modal fade show d-block">
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Image Viewer</h5>
              <button type="button" className="btn-close" onClick={handleCloseModal}></button>
            </div>
            <div className="modal-body">
              <img src={selectedImage} alt="Selected" className="img-fluid" />
            </div>
          </div>
        </div>
      </div>
    );
  }
  