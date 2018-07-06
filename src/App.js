import React, { Component } from 'react';

class App extends Component {
  state = {
    running: false,
    interval: null,
    timer: 'Session',
    sessionLength: 25,
    breakLength: 5,
    timeLeft: 25 * 60
  };

  reset = () => {
    this.beep.pause();
    this.beep.currentTime = 0;
    clearInterval(this.state.interval);
    this.setState({
      running: false,
      interval: null,
      timer: 'Session',
      sessionLength: 25,
      breakLength: 5,
      timeLeft: 25 * 60
    });
  };

  formatTime = () => {
    const minutes = String(Math.floor(this.state.timeLeft / 60)).padStart(
      2,
      '0'
    );
    const seconds = String(this.state.timeLeft % 60).padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  sessionDecrement = () => {
    this.setState({ sessionLength: Math.max(1, this.state.sessionLength - 1) });
  };

  sessionIncrement = () => {
    this.setState({
      sessionLength: Math.min(60, this.state.sessionLength + 1)
    });
  };

  breakDecrement = () => {
    this.setState({ breakLength: Math.max(1, this.state.breakLength - 1) });
  };

  breakIncrement = () => {
    this.setState({
      breakLength: Math.min(60, this.state.breakLength + 1)
    });
  };

  startStop = () => {
    window.state = this.state;

    if (!this.state.running) {
      this.setState({
        running: true,
        timeLeft: this.state.sessionLength * 60
      });
    }

    if (this.state.interval) {
      clearInterval(this.state.interval);
      this.setState({ interval: false });
    } else {
      this.setState({
        interval: setInterval(() => {
          this.setState({ timeLeft: this.state.timeLeft - 1 }, () => {
            if (this.state.timeLeft === 0) {
              this.beep.play();
            } else if (this.state.timeLeft < 0) {
              if (this.state.timer === 'Session') {
                this.setState({
                  timer: 'Break',
                  timeLeft: this.state.breakLength * 60
                });
              } else {
                this.setState({
                  timer: 'Session',
                  timeLeft: this.state.sessionLength * 60
                });
              }
            }
          });
        }, 1000)
      });
    }
  };

  render() {
    const { timer, sessionLength, breakLength } = this.state;
    return (
      <div className="App">
        <audio
          id="beep"
          ref={r => {
            this.beep = r;
          }}
          src="audio/openhat.wav"
        />
        <div id="pomodoro">
          <div id="timer-label">{timer}</div>
          <div id="time-left">{this.formatTime()}</div>
          <div id="session">
            <div id="session-label">Session Length</div>
            <button id="session-decrement" onClick={this.sessionDecrement}>
              -
            </button>
            <div id="session-length">{sessionLength}</div>
            <button id="session-increment" onClick={this.sessionIncrement}>
              +
            </button>
          </div>
          <button id="start_stop" onClick={this.startStop}>
            Start/Stop
          </button>
          <div id="break">
            <div id="break-label">Break Length</div>
            <button id="break-decrement" onClick={this.breakDecrement}>
              -
            </button>
            <div id="break-length">{breakLength}</div>
            <button id="break-increment" onClick={this.breakIncrement}>
              +
            </button>
          </div>
          <button id="reset" onClick={this.reset}>
            Reset
          </button>
        </div>
      </div>
    );
  }
}

export default App;
