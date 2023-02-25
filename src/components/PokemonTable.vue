<script>
    export default {
        name: 'PokemonTable',
        props: ['pokemonToDisplay']
    }
</script>

<template>
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
						<input @click="toggleFavorite(pokemon.id)" type="checkbox" class="checkbox favorite-button">
					</td>
				</tr>
			</tbody>
		</table>
</template>