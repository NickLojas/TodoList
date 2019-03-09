import React, { Component } from "react";
import TextField from "@material-ui/core/TextField";

class Form extends Component {
  state = {
    text: ""
  };

  handleChange = e => {
    const newText = e.target.value;
    this.setState({
      text: newText
    });
  };

  handleKeyDown = e => {
    if (e.key === "Enter") {
      this.props.submit(this.state.text);
      this.setState({
        text: ""
      });
    }
  };

  render() {
    return (
      <TextField
        label="Todo..."
        margin="normal"
        fullWidth
        value={this.state.text}
        onChange={this.handleChange}
        onKeyDown={this.handleKeyDown}
      />
    );
  }
}

export default Form;
