<script lang="ts">
	import type { Summary } from './+layout.server';
	export let data: { summaries: Summary[] };
</script>

<h1>The blog</h1>

<ul>
	{#each data.summaries as { slug, title }}
		<li>
			<a href="/blog/{slug}">
				{title}
			</a>
		</li>
	{/each}
</ul>
