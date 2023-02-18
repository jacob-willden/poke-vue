<script setup>
defineProps({
	friend: {
		type: String,
		required: true
	}
});
</script>

<template>
	<h2>I am Error. Go meet {{ friend }}.</h2>
</template>