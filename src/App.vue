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
			fetchPokemonData(url) {
				fetch(url)
				.then(response => response.json())
				.then(data => {
					this.pokemonData = data.results;
				})
				.catch(error => console.error(error));
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
		<button @click="fetchPokemonData('https://pokeapi.co/api/v2/pokemon?limit=10&offset=0')" class="button my-4">Get First 10 Pokemon</button>
		<table class="table">
			<thead>
				<tr>
					<th>ID</th>
					<th>Name</th>
				</tr>
			</thead>
			<tbody>
				<tr v-for="pokemon in pokemonData" :key="pokemon.url">
					<td>{{ pokemon.url }}</td>
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
