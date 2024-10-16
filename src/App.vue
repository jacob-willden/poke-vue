<!--
    @source: https://github.com/jacob-willden/poke-vue/

    @licstart  The following is the entire license notice for this file.

    This file is part of Poké-Vue.

    Poké-Vue Copyright (C) 2023, 2024 Jacob Willden
    (Released under the GNU General Public License (GNU GPL) Version 3.0 or later)

    One part of the code below is provided by Mert from StackOverflow,
	and is explicitly stated as so. Such code is released under the
	Creative Commons Attribution Share-Alike 4.0. I specify Creative
	Commons as my proxy to make the contributions from StackOverflow
	compatible with future versions of the GPL.

    Afformentioned source code derived and modified by Jacob Willden
    Date of Derivation: February 25, 2023

    Poké-Vue is free software: you can redistribute it and/or
	modify it under the terms of the GNU General Public License (GNU
	GPL) as published by the Free Software Foundation, either version
	3 of the License, or (at your option) any later version. The
	project is distributed WITHOUT ANY WARRANTY; without even the
	implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR
	PURPOSE. See the GNU GPL for more details.

    As additional permission under GNU GPL version 3 section 7, you
    may distribute non-source (e.g., minimized or compacted) forms of
    the code without the copy of the GNU GPL normally required by
    section 4, provided you include this license notice and a URL
    through which recipients can access the Corresponding Source.

    You should have recieved a copy of the GNU General Public License
    along with this project. Otherwise, see: https://www.gnu.org/licenses/

    @licend  The above is the entire license notice for this file.
-->

<script>
	//import CommunityIcon from './components/icons/IconCommunity.vue';
	//import PokemonTable from './components/PokemonTable.vue';

	export default {
		components: {
			//CommunityIcon,
			//PokemonTable
		},
		data() {
			return {
				//message: 'Hello World!',
				pokemonToDisplay: [],
				totalPokemon: 1279,
				offset: 0,
				sortSelection: 'id',
				favoritePokemon: [],
				modalElement: null,
				selectedType: 1
			}
		},
		beforeMount() {
			this.get10Pokemon(0, this.sortSelection);
		},
		mounted() {
			this.modalElement = this.$refs.modal;
		},
		methods: {
			// Derived from async Fetch example on Mozilla Developer Network: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
			async fetchData(url) {
				try {
					const response = await fetch(url);
					const data = await response.json();
					return data;
				}
				catch(error) {
					console.error(error);
				}
			},
			async get10Pokemon(offset, sortSelection) {
				if(sortSelection === 'id' && offset < this.totalPokemon - 10) {
					const data = await this.fetchData(`https://pokeapi.co/api/v2/pokemon?limit=10&offset=${offset}`);
					const pokemonList = [];
					for(let pokemon of data.results) {
						const id = pokemon.url.split('/')[6];
						const singlePokemonData = await this.getSinglePokemonData(id);
						pokemonList.push({
							id,
							name: pokemon.name,
							type: singlePokemonData.primaryType,
							image: singlePokemonData.image
						});
					}
					this.pokemonToDisplay = pokemonList;
				}
				else if(sortSelection === 'type') {
					const typeList = await this.fetchData(`https://pokeapi.co/api/v2/type/${this.selectedType}`);
					//console.log('typeList:', typeList);
					this.pokemonToDisplay = [];

					const idexesToFetch = [];
					for(let i = this.offset; i <= this.offset + 9; i++) {
						if(i < typeList.pokemon.length - 10) {
							idexesToFetch.push(i);
						}
					}

					const pokemonList = [];
					for(let index of idexesToFetch) {
						const id = typeList.pokemon[index].pokemon.url.split('/')[6];
						const name = typeList.pokemon[index].pokemon.name;

						const singlePokemonData = await this.getSinglePokemonData(id);
						pokemonList.push({
							id,
							name,
							type: singlePokemonData.primaryType,
							image: singlePokemonData.image
						});
					}
					this.pokemonToDisplay = pokemonList;
				}
			},
			async getSinglePokemonData(id) {
				const data = await this.fetchData(`https://pokeapi.co/api/v2/pokemon/${id}`);
				const primaryType = data.types[0].type.name;
				const image = data.sprites.other['official-artwork'].front_default;
				return {primaryType, image};
			},
			changeOffsetAndRefresh(number) {
				if(this.offset + number >= 0 && this.offset + number <= this.totalPokemon) {
					this.offset += number;
					console.log('new offset:', this.offset);
					this.get10Pokemon(this.offset, this.sortSelection);
				}
			},
			toggleFavorite(pokemonProxy) {
				const pokemon = JSON.parse(JSON.stringify(pokemonProxy)); // Extract Proxy object data, from Mert on StackOverflow: https://stackoverflow.com/questions/66605274/accessing-a-proxy-object-in-vue3

 				const index = this.favoritePokemon.findIndex(item => item.id.toString() === pokemon.id);
 				if(index === -1) {
					this.favoritePokemon.push(pokemon);
				}
				else {
					this.favoritePokemon.splice(index, 1);
				}
				//console.log('new favorites:', this.favoritePokemon);
			},
			changeSort(selection) {
				this.sortSelection = selection;
				this.changeOffsetAndRefresh(0);
			},
			changeSelectedType(type) {
				if(this.sortSelection === 'type') {
					this.selectedType = type;
					this.changeOffsetAndRefresh(0);
				}
			},
			consoleLog(string) {
				console.log(string);
			}
		}
	};
</script>

<template>
	<main>
		<h1 class="title">Pokémon Vue App</h1>
		<!-- <CommunityIcon />
		<h1>{{ message }}</h1>
		<button @click="message = 'Goodbye World!'" class="button my-4">Click me</button>
		<button @click="get10Pokemon(0, sortSelection)" class="button my-4">Get First 10 Pokemon</button> -->
		<!-- View Favorites Popup Button -->
		<div class="button-row">
			<span id="sort-buttons">
				<label class="radio">
					<input type="radio" @change="changeSort('id')" name="sort-pokemon" value="id" checked>
					Sort by ID
				</label>
				<label class="radio">
					<input type="radio" @change="changeSort('type')" name="sort-pokemon" value="type">
					Sort by Type
				</label>
			</span>
			<!-- <p>sortSelection: {{ sortSelection }}</p> -->
			<div class="select">
				<label for="type-select">Type</label>
				<select id="type-select" @change="changeSelectedType($event.target.value)"> <!-- https://stackoverflow.com/questions/51953173/how-do-i-pass-input-text-using-v-onchange-to-my-vue-method -->
					<option value="1">Normal</option>
					<option value="2">Fighting</option>
					<option value="3">Flying</option>
					<option value="4">Poison</option>
					<option value="5">Ground</option>
					<option value="6">Rock</option>
					<option value="7">Bug</option>
					<option value="8">Ghost</option>
					<option value="9">Steel</option>
					<option value="10">Fire</option>
					<option value="11">Water</option>
					<option value="12">Grass</option>
					<option value="13">Electric</option>
					<option value="14">Psychic</option>
					<option value="15">Ice</option>
					<option value="16">Dragon</option>
					<option value="17">Dark</option>
					<option value="18">Fairy</option>
				</select>
			</div>
		</div>

		<button @click="modalElement.showModal()" class="button favorites-button">View Favorites</button>
		<dialog ref="modal">
			<button @click="modalElement.close()" class="button">Close</button>
			<table class="table">
				<thead>
					<tr>
						<th>ID</th>
						<th>Name</th>
						<th>Primary Type</th>
						<th>Image</th>
					</tr>
				</thead>
				<tbody>
					<tr v-for="pokemon in favoritePokemon" :key="pokemon.id">
						<td>{{ pokemon.id }}</td>
						<td>{{ pokemon.name }}</td>
						<td>{{ pokemon.type }}</td>
						<td><a :href="pokemon.image">View</a></td>
					</tr>
				</tbody>
			</table>
		</dialog>

		<!-- <PokemonTable pokemonToDisplay={{pokemonToDisplay}} /> -->
		<table class="table">
			<thead>
				<tr>
					<th>ID</th>
					<th>Name</th>
					<th>Primary Type</th>
					<th>Image</th>
					<th>Favorite?</th>
				</tr>
			</thead>
			<tbody>
				<tr v-for="pokemon in pokemonToDisplay" :key="pokemon.id">
					<td>{{ pokemon.id }}</td>
					<td>{{ pokemon.name }}</td>
					<td>{{ pokemon.type }}</td>
					<td><a :href="pokemon.image">View</a></td>
					<td>
						<input @click="toggleFavorite(pokemon)" type="checkbox" class="checkbox favorite-button" :checked="favoritePokemon.find(item => item.id === pokemon.id) ? true : false">
					</td>
				</tr>
			</tbody>
		</table>

		<div class="button-row">
			<button @click="changeOffsetAndRefresh(-10)" id="previous-button" class="button">Previous</button>
			<button @click="changeOffsetAndRefresh(10)" id="next-button" class="button">Next</button>
		</div>

		<p>This project uses the <a href="https://pokeapi.co/">the PokéAPI (Pokémon Application Programming Interface)</a>.</p>
	</main>
</template>

<style scoped>
	h1 {
		font-size: 2rem;
	}
	.my-4 {
		margin-top: 1rem;
		margin-bottom: 1rem;
	}
	.button-row {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding-bottom: 1rem;
	}
	.select {
		margin-left: 1rem;
	}
	.favorites-button {
		margin-bottom: 1rem;
	}
</style>