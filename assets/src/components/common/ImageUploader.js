import React, { useState } from 'react';

const ImageUploader = ({ imageUrl, setImageUrl, setImageID, label, description }) => {
    const openMediaUploader = (event) => {
        event.preventDefault(); // Prevent the default behavior
    
        const customUploader = window.wp.media({
            title: 'Choose Thumbnail',
            button: {
                text: 'Upload Thumbnail',
            },
            multiple: false,
        });
    
        customUploader.on('select', () => {
            const attachment = customUploader.state().get('selection').first().toJSON();
            setImageUrl(attachment.url);
            setImageID(attachment.id);
        });
    
        customUploader.open();
    };

    const resetImage = () => {
        setImageUrl('');
        setImageID('');
    };

    return (
        <div className="mhub-form-group">
            <label> {label} <small className="description">{description}</small></label>
            <div className="thumbnail-wrapper">
                <div className="meeting-thumbnail">
                    {imageUrl && (
                        <img src={imageUrl} alt="Meeting Thumbnail" />
                    )}
                    { ! imageUrl && (
                        <button onClick={openMediaUploader} className='upload-thumbnail'> <span className="dashicons dashicons-cloud-upload"></span>Upload Thumbnail</button>
                    )}
                    {imageUrl && (
                        <button onClick={resetImage} className='reset-thumbnail'>Reset</button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ImageUploader;
