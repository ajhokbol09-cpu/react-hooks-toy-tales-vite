
import React, { useState, useEffect } from "react";
import Header from "./Header";
import ToyForm from "./ToyForm";
import ToyContainer from "./ToyContainer";

function App() {
  const [toys, setToys] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const API_URL =
    import.meta.env.VITE_TOYS_API_URL || "http://localhost:3001/toys";

  useEffect(() => {
    fetch(API_URL)
      .then((response) => response.json())
      .then((data) => setToys(data))
      .catch((error) => console.error("Error loading toys:", error));
  }, []);

  function handleClick() {
    setShowForm((previous) => !previous);
  }

        // Replace the toy in place so liking it preserves the list order.
  function handleAddToy(newToy) {
    fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...newToy,
        likes: 0,
      }),
    })
      .then((response) => response.json())
      .then((createdToy) => {
        setToys((previousToys) => [...previousToys, createdToy]);
        setShowForm(false);
      })
      .catch((error) => console.error("Error adding toy:", error));
  }

  function handleLike(toy) {
    fetch(`${API_URL}/${toy.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        likes: toy.likes + 1,
      }),
    })
      .then((response) => response.json())
      .then((updatedToy) => {
        setToys((previousToys) =>
          previousToys.map((item) =>
            item.id === updatedToy.id ? updatedToy : item
          )
        );
      })
      .catch((error) => console.error("Error liking toy:", error));
  }

  function handleDonate(toy) {
    fetch(`${API_URL}/${toy.id}`, {
      method: "DELETE",
    })
      .then(() => {
        setToys((previousToys) =>
          previousToys.filter((item) => item.id !== toy.id)
        );
      })
      .catch((error) => console.error("Error deleting toy:", error));
  }

  return (
    <>
      <Header />

      {showForm && <ToyForm onAddToy={handleAddToy} />}

      <div className="buttonContainer">
        <button onClick={handleClick}>Add a Toy</button>
      </div>

      <ToyContainer
        toys={toys}
        onLike={handleLike}
        onDonate={handleDonate}
      />
    </>
  );
}

export default App;
