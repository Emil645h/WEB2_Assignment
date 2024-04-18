import './App.css';
import { useState, useEffect } from 'react';

let apiUrl = "https://pokeapi.co/api/v2/pokemon?limit=16&offset=";

function App() {
  const [pokeArray, setPokeArray] = useState([]); // Use state to store the pokemon list
  const [pageIndex, setPageIndex] = useState(0);

  const handleNextClicked = () => setPageIndex(pageIndex + 1);
  const handlePreviousClicked = () => setPageIndex(pageIndex - 1);

  useEffect(() => {
    // Fetch the pokemon list when the component mounts
    fetch(apiUrl + pageIndex*16)
      .then(response => response.json())
      .then(data => setPokeArray(data.results)); // Assume the API response has a `results` field with the pokemon list
  }, [pageIndex]); // Empty dependency array means this effect runs once after the initial render


  return (
    <div className="App">
      <header className="Pokémon index">
        <h1>Pokédex:</h1>
        {/* Render the PokemonList component and pass the pokemon list */}
        <PokemonList pokeArray={pokeArray} />
      </header>
      <PreviousButton pageIndex={pageIndex} onClick={handlePreviousClicked}/>
      <NextButton pageIndex={pageIndex} onClick={handleNextClicked}/>
    </div>

  );
}

function PokemonList({ pokeArray }) {
  // Map over the pokemon list to create an array of JSX elements
  const listItems = pokeArray.map(pokemon => (
    <PokemonDiv key={pokemon.name} name={pokemon.name} url={pokemon.url} />
  ));

  return <div class="PokemonList">{listItems}</div>;
}

function PokemonDiv({ name, url }) {
  return (
    <a href={url}>
      <div class="PokeDiv">
        <h3>{name}</h3>
      </div>
    </a>
  );
}

function NextButton({ pageIndex, onClick }) {
  return <div class="button">{pageIndex < 9 && <button onClick={onClick}>Next</button>}</div>
}

function PreviousButton({ pageIndex, onClick }) {
  return <div class="button">{pageIndex > 0 && <button onClick={onClick}>Previous</button>}</div>
}

export default App;
