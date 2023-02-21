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
			async fetchPokemonData(url) {
				try {
					const response = await fetch(url);
					const data = await response.json();
					this.pokemonData = data.results;
					return data.results;
				}
				catch(error) {
					console.error(error);
				}
			},
			async testFetch() {
				let result = await this.fetchPokemonData('https://pokeapi.co/api/v2/pokemon?limit=10&offset=0');
				console.log(result);
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
		<button @click="testFetch()" class="button my-4">Get First 10 Pokemon</button>
		<table class="table">
			<thead>
				<tr>
					<th>ID</th>
					<th>Name</th>
				</tr>
			</thead>
			<tbody>
				<tr v-for="pokemon in pokemonData" :key="pokemon.url">
					<td>{{ pokemon.url.split('/')[6] }}</td>
					<td>{{ pokemon.name }}</td>
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
