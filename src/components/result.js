import React from 'react';

const Result = ({slicedInput, highlightId, entities, handleCheck, text}) => {
    return(
        <div className="col-12">
            <div className="row">
                <div className="col-12 col-xl-8">
                    <h1>Text</h1>
                    {text.length === 0 ? <p>No text..</p> : null}
                    {entities.length === 0 ? <p>{text}</p> : null}
                    <p>
                        {slicedInput && slicedInput.map((input, i) => {
                            if (input.isMention && highlightId.includes(input.id)) {
                                return <span className="bg-info" key={i}>{input.text}</span>
                            } else {
                                return <span key={i}>{input.text}</span>
                            }
                        })}
                    </p>
                </div>

                <div className="col-12 col-xl-4">
                    <h1>Entities</h1>
                    {entities && entities.map(entity => {
                        return (
                            <div key={entity.entityId} className="input-group mb-3">
                                <div className="input-group-prepend">
                                    <div className="input-group-text">
                                        <input name={entity.entityId} onChange={handleCheck} type="checkbox"
                                               aria-label="Checkbox for following text input"/>
                                    </div>
                                </div>
                                <p className="form-control"
                                   aria-label="Text input with checkbox">{entity.normalized}</p>
                            </div>
                        );
                    })}
                    {entities.length === 0 ? <p>No entities..</p> : null}
                </div>
            </div>
        </div>
    );
};

export default Result;