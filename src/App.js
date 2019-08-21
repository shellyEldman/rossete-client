import React, {useEffect, useState} from 'react';
import {Switch, Route, withRouter} from 'react-router-dom';
import axios from 'axios';
import './App.css';
import Input from './components/input';
import Result from './components/result';

axios.defaults.headers.post['Content-Type'] = 'application/json';

const App = ({history}) => {
  const [entities, setEntities] = useState([]);
  const [text, setText] = useState('');
  const [allMentions, setAllMentions] = useState([]);
  const [slicedInput, setSlicedInput] = useState([]);
  const [highlightId, setHighlightId] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (allMentions.length) {
      let sortedMentions = [...allMentions];
      sortedMentions.sort((a, b) => (a.startOffset > b.startOffset) ? 1 : ((b.startOffset > a.startOffset) ? -1 : 0));
      let startIndex = 0;
      let slicedText = [];
      sortedMentions.forEach(value => {
        const slice = {
          isMention: false,
          text: text.slice(startIndex, value.startOffset)
        };
        slicedText.push(slice);
        const mention = {
          isMention: true,
          id: value.id,
          text: text.slice(value.startOffset, value.endOffset)
        };
        slicedText.push(mention);
        startIndex = value.endOffset;
      });

      const lastValue = {
        isMention: false,
        text: text.slice(startIndex)
      };
      slicedText.push(lastValue);
      setSlicedInput(slicedText);
    }
  }, [allMentions, text]);

  useEffect(() => {
    if (entities && entities.length) {
      let mentions = [];
      entities.forEach(entity => {
        entity.mentionOffsets.forEach(offeset => {
          mentions.push({
            ...offeset,
            id: entity.entityId
          });
        });
      });
      setAllMentions(mentions);
    }
  }, [entities]);

  const sendText = (e) => {
    e.preventDefault();
    if (text.length > 0) {
      setLoading(true);
      setErrorMessage('');
      setAllMentions([]);
      setSlicedInput([]);
      setHighlightId([]);
      setEntities([]);
      axios.post(`http://localhost:3000/entities/`, {"content": text})
          .then(res => {
            setEntities(res.data.entities);
            setLoading(false);
            history.push('/result');
          })
          .catch(err => {
            console.log('error getting entities', err);
          });
    } else {
      setErrorMessage('Enter some text...');
    }
  };

  const handleCheck = (e) => {
    const id = e.target.name;
    let highlight = [...highlightId];
    if (highlight.includes(id)) {
      const highlightFilter = highlight.filter(highlightId => highlightId !== id);
      setHighlightId(highlightFilter);
    } else {
      highlight.push(id);
      setHighlightId(highlight);
    }
  };

  return (
      <div className="App container mt-3">
        <img alt="logo" src="https://s3.amazonaws.com/styleguide.basistech.com/logos/rosette-logo.svg" id="logo"/>

        <div className="row">
          <Switch>
            <Route exact path="/" render={(props) => <Input loading={loading} errorMessage={errorMessage} {...props} sendText={sendText} setText={setText} text={text}/>}/>
            <Route exact path="/result" render={(props) => <Result text={text} {...props} slicedInput={slicedInput} highlightId={highlightId} entities={entities} handleCheck={handleCheck}/>}/>
          </Switch>
        </div>

      </div>
  );
};

export default withRouter(App);
