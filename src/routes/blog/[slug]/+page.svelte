<script lang="ts">
	import type { Post } from '../data';
	export let data: { post: Post };
</script>

<h1>{data.post.title}</h1>

<div>
	{@html data.post.content}
</div>
