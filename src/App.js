import  { useState, useEffect } from 'react';
import Card from './components/Card';
import Header from './components/Header';
import shuffle from './utilities/shuffle';

function App() {
  const [cards, setCards] = useState(shuffle); // Cards array from assets
  const [pickOne, setPickOne] = useState(null); // First Selection
  const [pickTwo, setPickTwo] = useState(null); // Second Selection
  const [disabled, setDisabled] = useState(false); // Delay handler
  const [wins, setWins] = useState(0); //number of wins

  // Handle card selection
  const handleClick = (card) => {
    if (!disabled) {
      pickOne ? setPickTwo(card) : setPickOne(card);
    }
  };

  const handleTurn = () => {
    setPickOne(null);
    setPickTwo(null);
    setDisabled(false);
  };

  // Start Over
  const handleNewGame = () => {
    setWins(0);
    handleTurn();
    setCards(shuffle);
  };


  // Used for selection and match handling
  useEffect(() => {
    let pickTimer;

    // Two cards have been clicked
    if (pickOne && pickTwo) {

      // Check if the cards are the same
      if (pickOne.image === pickTwo.image) {
        setCards((prevCards) => {
          return prevCards.map((card) => {
            if (card.image === pickOne.image){
              //Update card property to reflect match
              return {...card, matched: true};
            } else {
              // no match
              return card;
            }
          })
        });
        handleTurn();
      } else {
        // prevent new selections until after delay
        setDisabled(true);
        // add delay between selecctions
        pickTimer = setTimeout(() => {
          handleTurn();
        }, 1000);
      }
    }

    return () => {
      clearTimeout(pickTimer);
    };
  }, [cards, pickOne, pickTwo]);

  // if player has found all matches
  useEffect(() => {
    // check for any remaining card matches
    const checkWin = cards.filter((card) => !card.matched);

    // all matches made, handle win/badge counters
    if(cards.length && checkWin.length < 1) {
      console.log('You Win!');
      setWins(wins+1);
      handleTurn();
      setCards(shuffle);
    }
  }, [cards, wins]);
  




  return (
    <>
      <Header handleNewGame={handleNewGame} wins={wins} />
      <div className='grid'>
        {cards.map((card) => {
          const {image, id, matched} = card;

          return (
            <Card 
              key={id}
              image={image}
              selected={ card === pickOne || card === pickTwo || matched}
              onClick={() => handleClick(card)}
            
            />
          );
        })}
      </div>
    </>
  );
}

export default App;
