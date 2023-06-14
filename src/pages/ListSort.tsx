import React from "react";

function ListSort() {
  const [fruitItems, setFruitItems] = React.useState([
    "Taskdemo",
    "Taskdemo",
    "Taskdemo",
  ]);
  const [newFruitItem, setNewFruitItem] = React.useState("");

  //save reference for dragItem and dragOverItem
  const dragItem = React.useRef<any>(null);
  const dragOverItem = React.useRef<any>(null);

  //const handle drag sorting
  const handleSort = () => {
    //duplicate items
    let _fruitItems = [...fruitItems];

    //remove and save the dragged item content
    const draggedItemContent = _fruitItems.splice(dragItem.current, 1)[0];

    //switch the position
    _fruitItems.splice(dragOverItem.current, 0, draggedItemContent);

    //reset the position ref
    dragItem.current = null;
    dragOverItem.current = null;

    //update the actual array
    setFruitItems(_fruitItems);
  };

  //handle name change
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewFruitItem(e.target.value);
  };

  //handle new item addition
  const handleAddItem = () => {
    const _fruitItems = [...fruitItems];
    _fruitItems.push(newFruitItem);
    setFruitItems(_fruitItems);
  };

  return (
    <div className="app">
      

      <div className="input-group">
        <input
          type="text"
          name="Task name"
          placeholder="e.g Deploy"
          onChange={handleNameChange}
        />
        <button className="btn" onClick={handleAddItem}>
          Add item
        </button>
      </div>

      <div className="list-sort">
        {fruitItems.map((item, index) => (
          <div
            key={index}
            className="list-item"
            draggable
            onDragStart={(e) => (dragItem.current = index)}
            onDragEnter={(e) => (dragOverItem.current = index)}
            onDragEnd={handleSort}
            onDragOver={(e) => e.preventDefault()}
          >
    
            <h3>{item}</h3>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ListSort;
