import React from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button, ButtonGroup, Form } from "react-bootstrap";

// Instructions provides text instructions on how to use the application
class Instructions extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isInstructions: false, // Are the instructions showing?
      instructionsLabel: "Show Instructions", // Button label for instructions
    };
  }

  render() {
    return (
      <div>
        <Button
          variant="secondary"
          onClick={(event) =>
            this.setState({
              isInstructions: !this.state.isInstructions,
              instructionsLabel: this.state.isInstructions
                ? "Show Instructions"
                : "Hide Instructions",
            })
          }
        >
          {this.state.instructionsLabel}
        </Button>

        {/* Button toggles text */}
        {this.state.isInstructions && (
          <p style={{ textAlign: "center" }}>
            <b>Instructions</b>
            <br />
            Type in Category Name and Item Name.
            <br />
            Optional properties include: Priority Level, Due Date, and
            Description.
            <br />
            Checking/Unchecking the optional property will show/hide the
            property for all items.
            <br />
            Once all desired fields are filled in, click "Add".
            <br />
            <br />
            Clicking "Edit" on a category or item will fill in their respective
            text boxes. Change values here and click "Edit Category" or "Edit
            Item" to save changes.
            <br />
            <br />
            Clicking "Delete" on an item will delete the item and all its
            properties.
            <br />
            Clicking "Delete" on a category will delete the category and all its
            items.
          </p>
        )}
      </div>
    );
  }
}

// List input and output
class List extends React.Component {
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
      inputPriority: "None", // Input from priority level select box
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
          inputPriority: "None",
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
          inputPriority: "None",
          inputDescription: "",
          inputDeadline: "",
          list: newList,
        });
      }
    } else if (this.state.mode === "Edit Category") {
      // Checks if the Category is filled in
      if (this.state.inputCategory === "") {
        alert("Please fill in Category");
        return;
      }

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
      // Checks if the Item is filled in
      if (this.state.inputItem === "") {
        alert("Please fill in Item");
        return;
      }

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
        inputPriority: "None",
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
    } else {
      alert("Please exit edit mode to delete category.");
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
    } else {
      alert("Please exit edit mode to delete item.");
    }
  }

  render() {
    return (
      <div>
        <Form>
          {/* Form Group for Category Name */}
          <Form.Group>
            <Form.Label>Category Name</Form.Label>
            <Form.Control
              type="text"
              onChange={(event) =>
                this.setState({ inputCategory: event.target.value })
              }
              value={this.state.inputCategory}
              placeholder="Category"
            />
          </Form.Group>

          {/* Form Group for Item Name */}
          <Form.Group>
            <Form.Label>Item Name</Form.Label>
            <Form.Control
              type="text"
              onChange={(event) =>
                this.setState({ inputItem: event.target.value })
              }
              value={this.state.inputItem}
              placeholder="Item"
            />
          </Form.Group>

          {/* Form Group for Priority Levels */}
          <Form.Group>
            <Form.Check
              type="checkbox"
              label="Priority Level"
              checked={this.state.isPriority}
              onChange={(event) =>
                this.setState({ isPriority: !this.state.isPriority })
              }
            />

            {/* Only display select box when Priority Levels is checked */}
            {this.state.isPriority && (
              <Form.Control
                as="select"
                value={this.state.inputPriority}
                onChange={(event) =>
                  this.setState({ inputPriority: event.target.value })
                }
              >
                <option value="None">None</option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </Form.Control>
            )}
          </Form.Group>

          {/* Form Group for Due Date */}
          <Form.Group>
            <Form.Check
              type="checkbox"
              label="Due Date"
              checked={this.state.isDeadline}
              onChange={(event) =>
                this.setState({ isDeadline: !this.state.isDeadline })
              }
            />

            {/* Only display text box when Due Date is checked */}
            {this.state.isDeadline && (
              <Form.Control
                type="text"
                onChange={(event) =>
                  this.setState({ inputDeadline: event.target.value })
                }
                value={this.state.inputDeadline}
                placeholder="Due Date"
              />
            )}
          </Form.Group>

          {/* Form Group for Description */}
          <Form.Group>
            <Form.Check
              type="checkbox"
              label="Description"
              checked={this.state.isDescription}
              onChange={(event) =>
                this.setState({ isDescription: !this.state.isDescription })
              }
            />

            {/* Only display text box when Description is checked */}
            {this.state.isDescription && (
              <Form.Control
                as="textarea"
                rows="4"
                onChange={(event) =>
                  this.setState({ inputDescription: event.target.value })
                }
                value={this.state.inputDescription}
                placeholder="Description"
              />
            )}
          </Form.Group>
        </Form>

        {/* Submit Button */}
        <Button variant="primary" onClick={this.submit.bind(this)}>
          {this.state.mode}
        </Button>

        <br />
        <br />

        {/* List of Items */}
        <ul>
          {this.state.list.map(({ categoryID, category, items }) => (
            <li key={categoryID}>
              {category} --{" "}
              <ButtonGroup>
                <Button
                  variant="primary"
                  onClick={this.editCategory.bind(this, categoryID)}
                >
                  Edit
                </Button>
                <Button
                  variant="danger"
                  onClick={this.deleteCategory.bind(this, categoryID)}
                >
                  Delete
                </Button>
              </ButtonGroup>
              <ul key={categoryID}>
                {items.map(
                  ({ itemID, item, priority, description, deadline }) => (
                    <li key={itemID}>
                      {item} --{" "}
                      <ButtonGroup>
                        <Button
                          variant="primary"
                          onClick={this.editItem.bind(this, categoryID, itemID)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="danger"
                          onClick={this.deleteItem.bind(
                            this,
                            categoryID,
                            itemID
                          )}
                        >
                          Delete
                        </Button>
                      </ButtonGroup>
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

// Main application
class App extends React.Component {
  render() {
    return (
      <div style={{ padding: "20px" }}>
        <Instructions />
        <br />
        <List />
      </div>
    );
  }
}

export default App;
