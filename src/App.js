import React from "react";
import "./App.css";

class App extends React.Component {
  render() {
    return (
      <div>
        <input type="text" />
        <input type="text" />
        <button>Submit</button>
        <ul>
          <li>
            Item 1
            <ul>
              <li>Sub Item 1</li>
            </ul>
          </li>
        </ul>
      </div>
    );
  }
}

export default App;
