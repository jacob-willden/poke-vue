<script>
	import IAmError from './components/IAmError.vue';
	import CommunityIcon from './components/icons/IconCommunity.vue';

	export default {
		components: {
			IAmError,
			CommunityIcon
		},
		data() {
			return {
				message: 'Hello World!',
				pokemonToDisplay: [],
				totalRelevantPokemon: 0,
				offset: 0
			}
		},
		beforeMount() {
			this.get10Pokemon(0);
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
			async get10Pokemon(offset) {
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
				if(this.offset + number >= 0 && this.offset + number <= 1279) { // Hardcoding the limit for now
					this.offset += number;
					console.log('new offset:', this.offset);
					this.get10Pokemon(this.offset);
				}
			}
		}
	};
</script>

<template>
	<main>
		<CommunityIcon />
		<h1>{{ message }}</h1>
		<IAmError friend="Bagu" />
		<button @click="message = 'Goodbye World!'" class="button my-4">Click me</button>
		<!-- <button @click="get10Pokemon(0)" class="button my-4">Get First 10 Pokemon</button> -->
		<button @click="changeOffsetAndRefresh(-10)" class="button">Previous</button>
		<button @click="changeOffsetAndRefresh(10)" class="button">Next</button>
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
					<td>{{ pokemon.image }}</td>
					<td>
						<input @click="" type="checkbox" :data-pokemon-id="pokemon.id" class="checkbox">
					</td>
				</tr>
			</tbody>
		</table>
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
</style>
