import React, { useState } from 'react';
import { FileUpload } from './FileUpload';
import { Files } from './Files';

export const App = () => {

    return (
        <div className="container">
            <FileUpload />
            <hr></hr>
            <Files />
        </div>
    );
}