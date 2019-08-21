import React from 'react';

const Input = ({sendText, setText, text, errorMessage, loading}) => {
    return (
        <div className="form-group col-12">
            <form>
                <label htmlFor="textbox" className="font-weight-bolder">Insert text here</label>
                <textarea className="form-control" id="textbox" value={text}
                          onChange={(e) => setText(e.target.value)}/>
                {loading ? <button className="btn btn-primary mt-3" type="button" disabled>
                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"/>
                </button> : <button onClick={sendText} className="btn btn-primary mt-3">Extract Entities</button>}

                {errorMessage.length > 0 ? <p className="text-danger mt-2">{errorMessage}</p> : null}
            </form>
        </div>
    );
};

export default Input;