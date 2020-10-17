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
      mode: "Add",
      editCategoryIndex: -1,
      editItemIndex: -1,
    };
  }

  // Submit button function
  submit() {
    // Check what mode we are in (i.e., Add or Edit)
    if (this.state.mode === "Add") {
      // Looks for category in list
      let append = this.state.list.find(
        ({ categoryID, category, items }) =>
          category === this.state.inputCategory
      );
      // Checks if the category is already in list by checking if "append" found anything
      if (typeof append === "undefined") {
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
        let newList = this.state.list;
        let index = this.state.list.indexOf(append);
        newList[index].items = [
          ...newList[index].items,
          { itemID: this.state.nextItemID, item: this.state.inputItem },
        ];

        this.setState({
          nextItemID: this.state.nextItemID + 1,
          nextCategoryID: this.state.nextCategoryID + 1,
          inputItem: "",
          inputCategory: "",
          list: newList,
        });
      }
    } else if (this.state.mode === "Edit Category") {
      let newList = this.state.list;
      newList[this.state.editCategoryIndex].category = this.state.inputCategory;

      this.setState({
        inputCategory: "",
        inputItem: "",
        list: newList,
        mode: "Add",
        editCategoryIndex: -1,
      });
    } else if (this.state.mode === "Edit Item") {
      let newList = this.state.list;
      newList[this.state.editCategoryIndex].items[
        this.state.editItemIndex
      ].item = this.state.inputItem;

      this.setState({
        inputCategory: "",
        inputItem: "",
        list: newList,
        mode: "Add",
        editCategoryIndex: -1,
        editItemIndex: -1,
      });
    }
  }

  // Edit category function
  editCategory(editID) {
    let editCategory = this.state.list.find(
      ({ categoryID, category, items }) => editID === categoryID
    );

    this.setState({
      inputCategory: editCategory.category,
      mode: "Edit Category",
      editCategoryIndex: this.state.list.indexOf(editCategory),
    });
  }

  // Edit item function
  editItem(editCategoryID, editItemID) {
    let editCategory = this.state.list.find(
      ({ categoryID, category, items }) => editCategoryID === categoryID
    );
    let editItem = editCategory.items.find(
      ({ itemID, item }) => editItemID === itemID
    );

    this.setState({
      inputItem: editItem.item,
      mode: "Edit Item",
      editCategoryIndex: this.state.list.indexOf(editCategory),
      editItemIndex: editCategory.items.indexOf(editItem),
    });
  }

  // Delete category function
  deleteCategory(deleteID) {
    // Checks if we are in edit mode
    if (this.state.mode === "Add") {
      let newList = this.state.list.filter(
        ({ categoryID, category, items }) => deleteID !== categoryID
      );
      this.setState({
        list: newList,
      });
    }
  }

  // Delete item function
  deleteItem(deleteCategoryID, deleteItemID) {
    // Checks if we are in edit mode
    if (this.state.mode === "Add") {
      let newList = this.state.list;
      let index = this.state.list.indexOf(
        this.state.list.find(
          ({ categoryID, category, items }) => deleteCategoryID === categoryID
        )
      );

      newList[index].items = newList[index].items.filter(
        ({ itemID, item }) => deleteItemID !== itemID
      );

      this.setState({
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
          placeholder="Category"
        />

        {/* Item Input Box */}
        <input
          type="text"
          onChange={(event) => this.setState({ inputItem: event.target.value })}
          value={this.state.inputItem}
          placeholder="Item"
        />

        {/* Submit Button */}
        <button onClick={this.submit.bind(this)}>{this.state.mode}</button>

        {/* List of Items */}
        <ul>
          {this.state.list.map(({ categoryID, category, items }) => (
            <li key={categoryID}>
              {category} --{" "}
              <span onClick={this.editCategory.bind(this, categoryID)}>
                Edit{" "}
              </span>
              <span onClick={this.deleteCategory.bind(this, categoryID)}>
                Delete
              </span>
              <ul key={categoryID}>
                {items.map(({ itemID, item }) => (
                  <li key={itemID}>
                    {item} --{" "}
                    <span
                      onClick={this.editItem.bind(this, categoryID, itemID)}
                    >
                      Edit{" "}
                    </span>
                    <span
                      onClick={this.deleteItem.bind(this, categoryID, itemID)}
                    >
                      Delete
                    </span>
                  </li>
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
