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
			fetchPokemon() {
				fetch('https://pokeapi.co/api/v2/pokemon?limit=10&offset=0')
				.then(response => response.json())
				.then(data => {
					this.pokemonData = data.results;
				});
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
		<button @click="fetchPokemon()" class="button my-4">Get First 10 Pokemon</button>
		<ul>
			<li v-for="pokemon in pokemonData" :key="pokemon.url">{{ pokemon.name }}</li> <!-- If v-for is used on the ul element, each li will have its own ul element -->
		</ul>
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
