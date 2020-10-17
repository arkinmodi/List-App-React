import React from "react";
import "./App.css";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      list: [], // List of objects containing categories and items in each category
      nextItemID: 0, // Next ID number of a new item
      nextCategoryID: 0, // Next ID number of a new category
      inputItem: "", // Input text in item text box
      inputCategory: "", // Input text in category text box
      inputDescription: "", // Input text in description text box
      inputDeadline: "", // Input text in due date text box
      inputPriority: "", // Input from priority level select box
      mode: "Add", // Add or Edit mode
      editCategoryIndex: -1, // Category index to edit
      editItemIndex: -1, // Item index to edit
      isPriority: false, // Is priority level checkbox checked?
      isDescription: false, // Is description checkbox checked?
      isDeadline: false, // Is due date checkbox checked?
    };
  }

  // Submit button function
  submit() {
    // Check what mode we are in (i.e., Add or Edit)
    if (this.state.mode === "Add") {
      // Checks if the Category and Item are both filled in
      if (this.state.inputItem === "" || this.state.inputCategory === "") {
        alert("Please fill in both Category and Item");
        return;
      }

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
          inputPriority: "",
          inputDescription: "",
          inputDeadline: "",
          list: [
            ...this.state.list,
            {
              categoryID: this.state.nextCategoryID,
              category: this.state.inputCategory,
              items: [
                {
                  itemID: this.state.nextItemID,
                  item: this.state.inputItem,
                  priority: this.state.inputPriority,
                  description: this.state.inputDescription,
                  deadline: this.state.inputDeadline,
                },
              ],
            },
          ],
        });
      } else {
        let newList = this.state.list;
        let index = this.state.list.indexOf(append);
        newList[index].items = [
          ...newList[index].items,
          {
            itemID: this.state.nextItemID,
            item: this.state.inputItem,
            priority: this.state.inputPriority,
            description: this.state.inputDescription,
            deadline: this.state.inputDeadline,
          },
        ];

        this.setState({
          nextItemID: this.state.nextItemID + 1,
          nextCategoryID: this.state.nextCategoryID + 1,
          inputItem: "",
          inputCategory: "",
          inputPriority: "",
          inputDescription: "",
          inputDeadline: "",
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
      let newItem =
        newList[this.state.editCategoryIndex].items[this.state.editItemIndex];
      newItem.item = this.state.inputItem;
      newItem.priority = this.state.inputPriority;
      newItem.deadline = this.state.inputDeadline;
      newItem.description = this.state.inputDescription;

      this.setState({
        inputCategory: "",
        inputItem: "",
        inputPriority: "",
        inputDeadline: "",
        inputDescription: "",
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
      ({ itemID, item, priority, description, deadline }) =>
        editItemID === itemID
    );
    this.setState({
      inputItem: editItem.item,
      inputPriority: editItem.priority,
      inputDeadline: editItem.deadline,
      inputDescription: editItem.description,
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
        ({ itemID, item, priority, description, deadline }) =>
          deleteItemID !== itemID
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
        <br />
        <input
          type="checkbox"
          checked={this.state.isPriority}
          onChange={(event) =>
            this.setState({ isPriority: !this.state.isPriority })
          }
        />
        Priority Levels{" "}
        {/* Only display select box when Priority Levels is checked */}
        {this.state.isPriority && (
          <select
            value={this.state.inputPriority}
            onChange={(event) =>
              this.setState({ inputPriority: event.target.value })
            }
          >
            <option value=""></option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        )}
        <br />
        <input
          type="checkbox"
          checked={this.state.isDeadline}
          onChange={(event) =>
            this.setState({ isDeadline: !this.state.isDeadline })
          }
        />
        Due Date {/* Only display text box when Due Date is checked */}
        {this.state.isDeadline && (
          <input
            type="text"
            onChange={(event) =>
              this.setState({ inputDeadline: event.target.value })
            }
            value={this.state.inputDeadline}
            placeholder="Due Date"
          />
        )}
        <br />
        <input
          type="checkbox"
          checked={this.state.isDescription}
          onChange={(event) =>
            this.setState({ isDescription: !this.state.isDescription })
          }
        />
        Description {/* Only display text box when Description is checked */}
        {this.state.isDescription && (
          <input
            type="text"
            onChange={(event) =>
              this.setState({ inputDescription: event.target.value })
            }
            value={this.state.inputDescription}
            placeholder="Description"
          />
        )}
        <br />
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
                {items.map(
                  ({ itemID, item, priority, description, deadline }) => (
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
                      {/* Shows respective property when respective checkbox is checked */}
                      {(this.state.isPriority ||
                        this.state.isDeadline ||
                        this.state.isDescription) && (
                        <ul key={itemID + "extra"}>
                          {this.state.isPriority && (
                            <li key={itemID + "p"}>Priority: {priority}</li>
                          )}
                          {this.state.isDeadline && (
                            <li key={itemID + "dd"}>Due Date: {deadline}</li>
                          )}
                          {this.state.isDescription && (
                            <li key={itemID + "desc"}>
                              Description: {description}
                            </li>
                          )}
                        </ul>
                      )}
                    </li>
                  )
                )}
              </ul>
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

export default App;
