import React from 'react';
import { FileUpload } from './FileUpload';
import { TextractContent } from './TextractContent';

export const App = () => {

    return (
            <div className="container col-xl-10 col-xxl-10 px-4 py-5">
                <div className="row align-items-center g-lg-5 py-5">
                    <div className="col-md-10 mx-auto col-lg-5">
                        <FileUpload />
                    </div>
                    <div className="col-lg-7 text-center text-lg-start border border-primary p-5">
                        <TextractContent />
                    </div>
                </div>
            <hr></hr>
        </div>
    );
}