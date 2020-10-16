import React from "react";
import "./App.css";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      list: [],
      nextItemID: 0,
      nextCategoryID: 0,
      inputItem: "",
      inputCategory: "",
    };
  }

  // Submit button function
  submit() {
    let append = this.state.list.find(
      ({ categoryID, category, items }) => category === this.state.inputCategory
    );

    if (typeof append === "undefined") {
      // This case is for a new category
      this.setState({
        nextItemID: this.state.nextItemID + 1,
        nextCategoryID: this.state.nextCategoryID + 1,
        inputItem: "",
        inputCategory: "",
        list: [
          ...this.state.list,
          {
            categoryID: this.state.nextCategoryID,
            category: this.state.inputCategory,
            items: [
              { itemID: this.state.nextItemID, item: this.state.inputItem },
            ],
          },
        ],
      });
    } else {
      // This case if for when the category already exists
      let newList = this.state.list;
      newList[append.categoryID].items = [
        ...newList[append.categoryID].items,
        { itemID: this.state.nextItemID, item: this.state.inputItem },
      ];

      this.setState({
        nextItemID: this.state.nextItemID + 1,
        nextCategoryID: this.state.nextCategoryID,
        inputItem: "",
        inputCategory: "",
        list: newList,
      });
    }
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
          {this.state.list.map(({ categoryID, category, items }) => (
            <li key={categoryID}>
              {category}
              <ul key={categoryID}>
                {items.map(({ itemID, item }) => (
                  <li key={itemID}>{item}</li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

export default App;
