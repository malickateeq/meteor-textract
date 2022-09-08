import React from 'react';

export const TableRow = ({ record }) => {
  return (
      <>
        <div className="accordion-item">
            <h2 className="accordion-header" id={"heading"+record._id}>
                <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target={"#collapse"+record._id} aria-expanded="true" aria-controls={"collapse"+record._id}>
                    { record.name.substring(1, 29) }.{record.name.split('.').pop()}
                    {record.analysed ? <span className="mx-3 badge bg-success">Completed</span> : <span className="mx-3 badge bg-primary">In Process</span> }
                </button>
            </h2>
            <div id={"collapse"+record._id} className="accordion-collapse collapse" aria-labelledby={"heading"+record._id} data-bs-parent="#accordionExample">
                <div className="accordion-body">
                    { JSON.stringify(record.analysis) }
                    
                </div>
            </div>
        </div>
      </>
  );
};