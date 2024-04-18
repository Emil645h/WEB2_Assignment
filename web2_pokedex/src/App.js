import './App.css';
import { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { createHashRouter, RouterProvider, Route, Link, useParams } from 'react-router-dom';

let apiUrl = "https://pokeapi.co/api/v2/pokemon?limit=";

function App() {
    const router = createHashRouter([
      { path: "/", element: <HomePage /> },
      { path: "/about", element: <AboutPage /> },
      { path: "/pokemon/:name", element: <SpecificPokemonPage /> }
    ]);

    return (
      <RouterProvider router={router} />
    );
}

function HomePage() {
  const [pokeArray, setPokeArray] = useState([]); // Use state to store the pokemon list
  const [pageIndex, setPageIndex] = useState(0);

  useEffect(() => {
    // Fetch the pokemon list when the component mounts
    fetch(apiUrl + (Math.min(16, 151 - 16 * pageIndex)) + "&offset=" + pageIndex*16)
      .then(response => response.json())
      .then(data => setPokeArray(data.results)); // Assume the API response has a `results` field with the pokemon list
  }, [pageIndex]);


  return (
    <div className="App">
      <header className="Pokémon index">
        <nav>
          <Link to="/" class="navLink">Home</Link>
          <Link to="/about" class="navLink">About</Link>
        </nav>
        <h1>Pokédex:</h1>
        <PokemonList pokeArray={pokeArray} />
      </header>
      <PreviousButton pageIndex={pageIndex} onClick={() => setPageIndex(pageIndex - 1)} />
      <NextButton pageIndex={pageIndex} onClick={() => setPageIndex(pageIndex + 1)} />
    </div>
  );
}

function AboutPage() {
  return (
    <div>
      <nav>
        <Link to="/" class="navLink">Home</Link>
        <Link to="/about" class="navLink">About</Link>
      </nav>
      <h1>About Pokédex</h1>
      <p>This is a WEB2 assignment about pokémons and their stats!</p>
    </div>
  );
}

function SpecificPokemonPage() {
  const { name } = useParams();
  const [pokemonDetails, setPokemonDetails] = useState(null);

  useEffect(() => {
    // Fetch the pokemon when the component mounts
    fetch(`https://pokeapi.co/api/v2/pokemon/${name.toLowerCase()}`) // Pokémon names in the API are lowercase
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Pokemon not found');
        }
      })
      .then(data => setPokemonDetails(data)) // No `.results` needed, as the API returns the details directly
      .catch(error => console.error('Error fetching data:', error));
  }, [name]);

  if (!pokemonDetails) return <h1>Loading...</h1>;

  return (
    <div className='specificPokemonContainer'>
      <nav>
        <Link to="/" className="navLink">Home</Link> {/* Corrected from class to className */}
        <Link to="/about" className="navLink">About</Link> {/* Corrected from class to className */}
      </nav>
      <h1>{pokemonDetails.name}</h1>
      <img src={pokemonDetails.sprites.front_default} alt={pokemonDetails.name} />
      <div>Type: {pokemonDetails.types.map((typeInfo) => typeInfo.type.name).join(', ')}</div>
      <div>Abilities: {pokemonDetails.abilities.map((abilityInfo) => abilityInfo.ability.name).join(', ')}</div>
      <div>Height: {pokemonDetails.height}</div>
      <div>Weight: {pokemonDetails.weight}</div>
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
    <div className="PokeDiv">
      <Link to={`/pokemon/${name.toLowerCase()}`}>{name}</Link>
    </div>
  );
}

function NextButton({ pageIndex, onClick }) {
  return <div class="button">{pageIndex < 9 && <button onClick={onClick}>Next</button>}</div>
}

function PreviousButton({ pageIndex, onClick }) {
  return <div class="button">{pageIndex > 0 && <button onClick={onClick}>Previous</button>}</div>
}

const root = ReactDOM.createRoot(document.getElementById("root"))
root.render(<App />)

export default App;
