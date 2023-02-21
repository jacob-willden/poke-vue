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
				pokemonData: []
			}
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
			async get10Pokemon() {
				const data = await this.fetchData('https://pokeapi.co/api/v2/pokemon?limit=10&offset=0');
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
				this.pokemonData = pokemonList;
			},
			async getSinglePokemonData(id) {
				const data = await this.fetchData(`https://pokeapi.co/api/v2/pokemon/${id}`);
				const primaryType = data.types[0].type.name;
				const image = data.sprites.other['official-artwork'].front_default;
				return {primaryType, image};
			}
		}
	};
</script>

<template>
	<main>
		<CommunityIcon />
		<h1>{{ message }}</h1>
		<button @click="message = 'Goodbye World!'" class="button my-4">Click me</button>
		<IAmError friend="Bagu" />
		<button @click="get10Pokemon()" class="button my-4">Get First 10 Pokemon</button>
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
				<tr v-for="pokemon in pokemonData" :key="pokemon.url">
					<td>{{ pokemon.id }}</td>
					<td>{{ pokemon.name }}</td>
					<td>{{ pokemon.type }}</td>
					<td>{{ pokemon.image }}</td>
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
