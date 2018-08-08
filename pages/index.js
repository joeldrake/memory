import React from 'react';
import Layout from './../components/Layout.js';
import _ from 'lodash';
import './../static/css/cards.css';

class Index extends React.Component {
  state = {
    isLoading: true,
    checkingCards: false,
    cards: [],
    pairs: [
      {
        word: 'chaussures',
        image: '/static/img/chaussures.jpg',
      },
      {
        word: 'chemise',
        image: '/static/img/chemise.jpg',
      },
      {
        word: 'macaron',
        image: '/static/img/macaron.jpg',
      },
      {
        word: 'macron',
        image: '/static/img/macron.jpg',
      },
      {
        word: 'voiture',
        image: '/static/img/voiture.jpg',
      },
      {
        word: 'chapeau',
        image: '/static/img/chapeau.jpg',
      },
      {
        word: 'arbre',
        image: '/static/img/arbre.jpg',
      },
      {
        word: 'valise',
        image: '/static/img/valise.jpg',
      },
    ],
  };

  componentDidMount() {
    this.initBoard();
  }

  initBoard = cards => {
    console.log('New Board');
    let newCards = [];

    const pairs = this.state.pairs;
    const numCards = this.state.pairs.length * 2;

    for (let i = 0; i < numCards; i++) {
      const pairNumber = Math.floor(i / 2);
      let type = 'word';
      let content = pairs[pairNumber].word;
      if (i / 2 === pairNumber) {
        type = 'image';
        content = pairs[pairNumber].image;
      }

      newCards[i] = {
        flipped: false,
        cleared: false,
        pairNumber,
        type,
        content,
      };
    }

    const shuffledCards = this.shuffle(newCards);
    this.setState({
      cards: shuffledCards,
    });
  };

  shuffle(a) {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
      j = Math.floor(Math.random() * (i + 1));
      x = a[i];
      a[i] = a[j];
      a[j] = x;
    }
    return a;
  }

  handleCardClick = i => e => {
    let { cards, checkingCards } = this.state;

    if (checkingCards) {
      return;
    }

    cards[i].flipped = true;

    let flippedCards = cards.filter(card => {
      return card.flipped && !card.cleared;
    });

    if (flippedCards.length >= 2) {
      this.checkCards(1000, cards, flippedCards);
    } else {
      this.setState({
        cards,
      });
    }
  };

  checkCards = (time, cards, flippedCards) => {
    this.setState({
      checkingCards: true,
    });
    let newCards = null;
    setTimeout(() => {
      if (flippedCards[0].pairNumber === flippedCards[1].pairNumber) {
        //match
        flippedCards[0].cleared = true;
        flippedCards[1].cleared = true;
        newCards = _.union(cards, flippedCards);
        /*
        const newCards = cards.map((card) => {
          if(card.pairNumber = flippedCards[0].pairNumber) {
            return
          }
          return card;
        });
        */
        this.setState({
          cards: newCards,
          checkingCards: false,
        });
        this.checkWin(newCards);
      } else {
        newCards = cards.map(card => {
          if (!card.cleared) {
            card.flipped = false;
          }

          return card;
        });
        this.setState({
          cards: newCards,
          checkingCards: false,
        });
      }
    }, time || 1000);
  };

  checkWin = cards => {
    let notClearedCards = cards.filter(card => {
      return !card.cleared;
    });
    console.log(notClearedCards.length);
    if (!notClearedCards.length) {
      //all cards are cleared, time to celebrate!
      const goAgain = confirm('All cleared! Want to go again?');
      if (goAgain) {
        //reset board
        cards.forEach(card => {
          card.flipped = false;
        });
        this.setState({
          cards: cards,
        });
        setTimeout(() => {
          this.initBoard();
        }, 300);
      }
    }
  };

  render() {
    const cards = this.state.cards.map((card, i) => {
      let style = {};
      let text = card.content;

      if (card.type === 'image') {
        style = {
          backgroundImage: `url(${card.content})`,
        };
        text = '';
      }

      return (
        <div
          className={
            `card card${i}` +
            (card.cleared ? ` cleared` : null) +
            (card.flipped ? ` flipped` : null)
          }
          onClick={
            !card.cleared && !card.flipped ? this.handleCardClick(i) : null
          }
          key={i}
        >
          <div className={`cardFace frontside`}>?</div>
          <div className={`cardFace backside`} style={style}>
            {text}
          </div>
        </div>
      );
    });
    return (
      <Layout>
        <div className={`main`}>
          <div className={`cardsWrapper`}>{cards}</div>
        </div>
      </Layout>
    );
  }
}

export default Index;
