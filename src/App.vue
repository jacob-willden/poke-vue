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
				totalPokemon: 1279, // Hardcoding the limit for now
				offset: 0,
				sortSelection: 'id',
				favoritePokemon: [],
				modalVisible: false
			}
		},
		beforeMount() {
			this.get10Pokemon(0, this.sortSelection);
		},
		methods: {
			// Derived from async Fetch example in Vue: https://blog.bitsrc.io/requests-in-vuejs-fetch-api-and-axios-a-comparison-a0c13f241888
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
				const pokemon = JSON.parse(JSON.stringify(pokemonProxy)); // To extract Proxy object data, from Mert on StackOverflow: https://stackoverflow.com/questions/66605274/accessing-a-proxy-object-in-vue3

 				const index = this.favoritePokemon.findIndex(item => item.id.toString() === pokemon.id);
 				if(index === -1) {
					this.favoritePokemon.push(pokemon);
				}
				else {
					this.favoritePokemon.splice(index, 1);
				}
				//console.log('new favorites:', this.favoritePokemon);
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
					<input type="radio" @change="sortSelection = 'id'" name="sort-pokemon" value="id" checked>
					Sort by ID
				</label>
				<label class="radio">
					<input type="radio" @change="sortSelection = 'type'" name="sort-pokemon" value="type">
					Sort by Type
				</label>
			</span>
			<!-- <p>sortSelection: {{ sortSelection }}</p> -->
			<button @click="modalVisible = !modalVisible" class="button view-favorites">View Favorites</button>
		</div>

		<!-- <PokemonTable pokemonToDisplay={{pokemonToDisplay}} /> -->
		<table class="table">
			<thead>
				<tr>
					<th>ID</th>
					<th>Name</th>
					<th>Type</th>
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
						<input @click="toggleFavorite(pokemon)" type="checkbox" class="checkbox favorite-button">
					</td>
				</tr>
			</tbody>
		</table>

		<div class="button-row">
			<button @click="changeOffsetAndRefresh(-10)" class="button">Previous</button>
			<button @click="changeOffsetAndRefresh(10)" class="button">Next</button>
		</div>

		<div class="modal" :class="{'is-active': modalVisible}">
			<div class="modal-background"></div>

			<div class="modal-content">
				<div class="box">
					<table class="table">
						<thead>
							<tr>
								<th>ID</th>
								<th>Name</th>
								<th>Type</th>
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
				</div>
			</div>

			<button @click="modalVisible = false" class="modal-close is-large" aria-label="close"></button>
			</div>
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
	.view-favorites {
		margin-left: 1rem;
	}
</style>
