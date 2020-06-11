import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

// Supporting functions !

function shuffleCases(cases) {
	var arr = cases.slice();
	console.log(arr)
	for (var i = arr.length-1; i > 0; i--) {
		var j = Math.floor(Math.random() * (i+1));
		[arr[i], arr[j]] = [arr[j], arr[i]];
	}
	console.log(arr);
	return arr;
}

function getAvg(arr) {
	let sum = 0;
	for ( var i = 0; i < arr.length; i++) {
		sum += arr[i];
	}
	return sum / arr.length;
}



class Case extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			award: this.props.award,
			text: this.props.index ,
			chosen: this.props.chosen,
			clicked: false,
		};
		console.log(this.props.reveal);
		this.handleClick = this.handleClick.bind(this);
	}
	
	handleClick() {
		if (this.state.chosen || this.props.reveal) {
			return;
		}
		if(this.props.onClick(this.props.award, this.props.index) === "Not Chosen") {
			this.setState({
				text: this.props.award,
				chosen: false,
				clicked: true,
			});
		} else {
			this.setState({
				text: "Your Case",
				chosen: true, 
			});
		}
	}
	
	render() {
		return (
			<button className="case" key={this.props.index} onClick = {this.handleClick} id={this.state.chosen ? "userCase" : (this.state.clicked) ? "clickedOther" : "otherCase"}>
				{(this.props.reveal) ? this.props.award : this.state.text}
			</button>
		);
	}
};

class Board extends React.Component {
	constructor(props) {
		super(props);
		const possible = [0.01, 1, 5, 10, 100, 1000, 10000, 100000, 500000, 1000000];
		const available = [0.01, 1, 5, 10, 100, 1000, 10000, 100000, 500000, 1000000];
		var order = shuffleCases(available);
		this.state = {
			userCase: {
				index: null,
				award: null,
			},
			possible: possible,
			available: available,
			order: order,
			gameEnded: false,
		}
		
		//Binding these as we will need to use them outside of Board
		this.createListElem = this.createListElem.bind(this);
		this.handleCaseClick = this.handleCaseClick.bind(this);
		this.handleDeal = this.handleDeal.bind(this);
		this.newGame = this.newGame.bind(this);
	}
	
	newGame() {
		const possible = [0.01, 1, 5, 10, 100, 1000, 10000, 100000, 500000, 1000000];
		const available = [0.01, 1, 5, 10, 100, 1000, 10000, 100000, 500000, 1000000];
		var order = shuffleCases(available);
		this.setState ({
			userCase: {
				index: null,
				award: null,
			},
			possible: possible,
			available: available,
			order: order,
			gameEnded: false,
		});
	}
	
	//notAvail and avail are css ids!!!
	createListElem(arrayElem) {
		let itemClass = "notAvail"
		if (this.state.available.includes(arrayElem)) {
			itemClass = "avail";
		}
		return (
			<li id={itemClass} key={arrayElem}>
				{arrayElem}
			</li>
		);
	}
	
	handleCaseClick(award, index) {
		if (this.state.userCase.award) {
			var avail = this.state.available.filter((val) => {return (val !== award) ? true : false});
			this.setState(
				{
					available: avail,
				}
			);
			if(avail.length === 1) {
				alert("You've won " + avail[0]);
				this.setState({
					gameEnded: true,
				});
			}
			return "Not Chosen";
		} else {
			this.setState({
				userCase: {
					index: index,
					award: award,
				}
			});
			return "Chosen";
		}
	
	}
	
	handleDeal() {
		let deal = getAvg(this.state.available).toFixed(2);
		alert("You've won " + deal);
		this.setState({
			gameEnded: true,
		});
	}
	
	render() {
		let possible = this.state.possible.slice();
		let available = this.state.available.slice();
		let butts = this.state.order.map((val, ind) => {
			return (
				<Case key={ind} reveal={this.state.gameEnded} index={ind} chosen={ind === this.state.userCase.index} award={val} onClick={this.handleCaseClick}/>
			);
		});
		
		let priceDisplay = possible.map(this.createListElem);
		console.log(priceDisplay);
		let curDeal = (this.state.userCase.award) ? 
									"Current Deal: " + getAvg(available).toFixed(2)
									: "Please select a case!";
		curDeal = (this.state.gameEnded) ? "Game Over!" : curDeal;
		return (
			<div id="body">
				<div id="interactive">
					<div id="alignDisplay">
					<h1>Deal or No Deal!</h1>
						<p id="deal">
						{curDeal}
						</p>
						<div id="cases">
							{butts}
						</div>
					</div>
					<div id="take">
						<button onClick={this.handleDeal} disabled={(!this.state.userCase.award)}>
							Take Deal
						</button>
						<button onClick={this.props.newGame}>
							New Game
						</button>
					</div>
				</div>
				<ul id="priceDisplay">
					{priceDisplay}
				</ul>
				
			</div>
		);
	}
}


class Game extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			forceRender: true,
		}
		this.renderFunc = this.renderFunc.bind(this);
	}
	
	renderFunc() {
		this.setState({
			//We'll use this as the key for our board. When the board's key changes,
			//React will force a reconstruction of the board prop. Hacky but it works.
			forceRender: !this.state.forceRender,
		});
	}
	
	render() {
		return (
			<div>
				<Board newGame={this.renderFunc} key={this.state.forceRender}/>
			</div>
		);
	}
}


ReactDOM.render(
  <Game />,
  document.getElementById('root')
);