import React from "react";
import "./App.css";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [],
      nextID: 0,
      inputItem: "",
      inputCategory: "",
    };
  }

  // Submit button function
  submit() {
    this.setState({
      nextID: this.state.nextID + 1,
      inputItem: "",
      inputCategory: "",
      items: [
        ...this.state.items,
        {
          item: this.state.inputItem,
          category: this.state.inputCategory,
          id: this.state.nextID + 1,
        },
      ],
    });
  }

  render() {
    return (
      <div>
        {/* Category Input Box */}
        <input
          type="text"
          onChange={(event) =>
            this.setState({ inputCategory: event.target.value })
          }
          value={this.state.inputCategory}
        />

        {/* Item Input Box */}
        <input
          type="text"
          onChange={(event) => this.setState({ inputItem: event.target.value })}
          value={this.state.inputItem}
        />

        {/* Submit Button */}
        <button onClick={this.submit.bind(this)}>Submit</button>

        {/* List of Items */}
        <ul>
          {this.state.items.map(({ item, id }) => (
            <li key={id}>{item}</li>
          ))}
        </ul>
      </div>
    );
  }
}

export default App;
